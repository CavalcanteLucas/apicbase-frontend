import { mount, config } from "@vue/test-utils";
import Recipes from "../../src/views/Recipes.vue";

import { columnData } from "../utils.js";

config.showDeprecationWarnings = false;

describe("recipes view", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Recipes, {
      methods: {
        getRecipes: () => {
          // do nothing
        },
      },
    });
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it("has data", () => {
    expect(typeof Recipes.data).toBe("function");
  });

  it("is a Vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("has one input field, and one search field", () => {
    expect(wrapper.contains('input[id="inputName"]')).toBe(true);
    expect(wrapper.contains('input[id="searchField"]')).toBe(true);
  });

  it("has a clear input button, a clear search button, and a submit button", () => {
    expect(wrapper.contains('button[id="clearBtn"]')).toBe(true);
    expect(wrapper.contains('button[id="submitBtn"]')).toBe(true);
    expect(wrapper.contains('button[id="clearSearchBtn"]')).toBe(true);
  });

  it("input fields load data", () => {
    expect(wrapper.vm.$data.recipe).toEqual({
      name: null,
    });
    wrapper.find('input[id="inputName"]').setValue("cake-test");
    expect(wrapper.find('input[id="inputName"]').element.value).toBe(
      "cake-test"
    );
    expect(wrapper.vm.$data.recipe).toEqual({
      name: "cake-test",
    });
  });

  it("clear button wipes loaded data out", async () => {
    await wrapper.setData({
      recipe: {
        name: "cake-test",
      },
    });

    expect(wrapper.vm.$data.recipe).toEqual({
      name: "cake-test",
    });

    let clearBtn = wrapper.find('button[id="clearBtn"]');
    expect(clearBtn.exists()).toBe(true);
    expect(clearBtn.is("button")).toBe(true);
    await clearBtn.trigger("click");

    expect(wrapper.vm.$data.recipe).toEqual({
      name: null,
    });
    expect(wrapper.find('input[id="inputName"]').element.value).toBe("");
  });

  it("opens confirmation modal when delete button is pressed", async () => {
    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(0);
    await wrapper.setData({
      recipes: [
        {
          name: "cake-sample",
        },
      ],
    });

    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(1);
    let deleteBtn = wrapper.find('button[id="deleteBtn"]');
    expect(deleteBtn.exists()).toBe(true);
    expect(deleteBtn.is("button")).toBe(true);
    let modal = wrapper.find('div[class="popup-modal"]');
    expect(modal.exists()).toBe(false);

    await deleteBtn.trigger("click");

    modal = wrapper.find('div[class="popup-modal"]');
    expect(modal.exists()).toBe(true);
    expect(modal.is("div")).toBe(true);
    expect(modal.text()).toContain("Are you sure about that?");
    expect(modal.text()).toContain("Nevermind..");
    expect(modal.text()).toContain("Just do it!");
  });

  it("closes confirmation modal when cancel button is pressed", async () => {
    await wrapper.setData({
      recipes: [
        {
          name: "carrot-sample",
        },
      ],
    });
    let deleteBtn = wrapper.find('button[id="deleteBtn"]');
    expect(deleteBtn.exists()).toBe(true);
    expect(deleteBtn.is("button")).toBe(true);
    await deleteBtn.trigger("click");

    let cancelBtn = wrapper.find('button[id="cancelBtn"]');
    expect(cancelBtn.exists()).toBe(true);
    expect(cancelBtn.is("button")).toBe(true);
    await cancelBtn.trigger("click");

    let modal = wrapper.find('div[class="popup-modal"]');
    expect(modal.exists()).toBe(false);
    cancelBtn = wrapper.find('button[id="cancelBtn"]');
    expect(cancelBtn.exists()).toBe(false);
  });

  it("clear search button wipes searched data out", async () => {
    let searchField = wrapper.find('input[id="searchField"]');
    expect(searchField.exists()).toBe(true);
    expect(searchField.is("input")).toBe(true);
    await searchField.setValue("sample recipe");
    expect(searchField.element.value).toBe("sample recipe");

    let clearSearchBtn = wrapper.find('button[id="clearSearchBtn"]');
    expect(clearSearchBtn.exists()).toBe(true);
    expect(clearSearchBtn.is("button")).toBe(true);
    await clearSearchBtn.trigger("click");
    expect(searchField.element.value).toBe("");
  });

  it("filters searched data", async () => {
    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(0);
    await wrapper.setData({
      recipes: [
        {
          name: "sample recipe X",
        },
        {
          name: "sample recipe Y",
        },
      ],
    });
    let rows = wrapper.findAll("tbody > tr").wrappers;
    expect(rows).toHaveLength(2);

    // filters sample-X by name
    let searchField = wrapper.find('input[id="searchField"]');
    expect(searchField.exists()).toBe(true);
    expect(searchField.is("input")).toBe(true);
    await searchField.setValue("x");
    rows = wrapper.findAll("tbody > tr").wrappers;
    expect(rows).toHaveLength(1);
    expect(columnData(1, rows)[0]).toBe("sample recipe X");

    // filters sample-Y by name
    await searchField.setValue("y");
    rows = wrapper.findAll("tbody > tr").wrappers;
    expect(rows).toHaveLength(1);
    expect(columnData(1, rows)[0]).toBe("sample recipe Y");
  });
});
