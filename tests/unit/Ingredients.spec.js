import { mount, config } from "@vue/test-utils";
import Ingredients from "../../src/views/Ingredients.vue";

import { columnData } from "../utils.js";

config.showDeprecationWarnings = false;

describe("ingredients view", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Ingredients, {
      methods: {
        getIngredients: () => {
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
    expect(typeof Ingredients.data).toBe("function");
  });

  it("is a Vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("renders the correct table headers", () => {
    expect(wrapper.html()).toContain("#");
    expect(wrapper.html()).toContain("Name");
    expect(wrapper.html()).toContain("Cost");
    expect(wrapper.html()).toContain("Amount");
    expect(wrapper.html()).toContain("Unit");
  });

  it("has five input fields, and a search field", () => {
    expect(wrapper.contains('input[id="inputArticleNumber"]')).toBe(true);
    expect(wrapper.contains('input[id="inputName"]')).toBe(true);
    expect(wrapper.contains('input[id="inputCostPerAmount"]')).toBe(true);
    expect(wrapper.contains('input[id="inputAmount"]')).toBe(true);
    expect(wrapper.contains('select[id="inputUnit"]')).toBe(true);
    expect(wrapper.contains('input[id="searchField"]')).toBe(true);
  });

  it("has clear inputs button, a clear search button, and a submit button", () => {
    expect(wrapper.contains('button[id="clearBtn"]')).toBe(true);
    expect(wrapper.contains('button[id="submitBtn"]')).toBe(true);
    expect(wrapper.contains('button[id="clearSearchBtn"]')).toBe(true);
  });

  it("input fields load data", () => {
    expect(wrapper.vm.$data.ingredient).toEqual({
      article_number: null,
      name: null,
      cost_per_amount: null,
      amount: null,
      unit: "gram",
    });

    wrapper.find('input[id="inputArticleNumber"]').setValue("999");
    wrapper.find('input[id="inputName"]').setValue("carrot-test");
    wrapper.find('input[id="inputCostPerAmount"]').setValue("1");
    wrapper.find('input[id="inputAmount"]').setValue("500");
    wrapper.find('select[id="inputUnit"]').setValue("gram");

    expect(wrapper.find('input[id="inputArticleNumber"]').element.value).toBe(
      "999"
    );
    expect(wrapper.find('input[id="inputName"]').element.value).toBe(
      "carrot-test"
    );
    expect(wrapper.find('input[id="inputCostPerAmount"]').element.value).toBe(
      "1"
    );
    expect(wrapper.find('input[id="inputAmount"]').element.value).toBe("500");
    expect(wrapper.find('select[id="inputUnit"]').element.value).toBe("gram");

    expect(wrapper.vm.$data.ingredient).toEqual({
      article_number: "999",
      name: "carrot-test",
      cost_per_amount: "1",
      amount: "500",
      unit: "gram",
    });
  });

  it("clear button wipes loaded data out", async () => {
    await wrapper.setData({
      ingredient: {
        article_number: "999",
        name: "carrot-test",
        cost_per_amount: "1",
        amount: "500",
        unit: "gram",
      },
    });

    expect(wrapper.vm.$data.ingredient).toEqual({
      article_number: "999",
      name: "carrot-test",
      cost_per_amount: "1",
      amount: "500",
      unit: "gram",
    });

    let clearBtn = wrapper.find('button[id="clearBtn"]');
    expect(clearBtn.exists()).toBe(true);
    expect(clearBtn.is("button")).toBe(true);
    await clearBtn.trigger("click");

    expect(wrapper.vm.$data.ingredient).toEqual({
      article_number: null,
      name: null,
      cost_per_amount: null,
      amount: null,
      unit: "gram",
    });

    expect(wrapper.find('input[id="inputArticleNumber"]').element.value).toBe(
      ""
    );
    expect(wrapper.find('input[id="inputName"]').element.value).toBe("");
    expect(wrapper.find('input[id="inputCostPerAmount"]').element.value).toBe(
      ""
    );
    expect(wrapper.find('input[id="inputAmount"]').element.value).toBe("");
    expect(wrapper.find('select[id="inputUnit"]').element.value).toBe("gram");
  });

  it("opens confirmation modal when delete button is pressed", async () => {
    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(0);
    await wrapper.setData({
      ingredients: [
        {
          article_number: "998",
          name: "carrot-sample",
          cost_per_amount: "1.01",
          amount: "501",
          unit: "gram",
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
      ingredients: [
        {
          article_number: "998",
          name: "carrot-sample",
          cost_per_amount: "1.01",
          amount: "501",
          unit: "gram",
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
    await searchField.setValue("sample ingredient");
    expect(searchField.element.value).toBe("sample ingredient");

    let clearSearchBtn = wrapper.find('button[id="clearSearchBtn"]');
    expect(clearSearchBtn.exists()).toBe(true);
    expect(clearSearchBtn.is("button")).toBe(true);
    await clearSearchBtn.trigger("click");
    expect(searchField.element.value).toBe("");
  });

  it("filters searched data", async () => {
    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(0);
    await wrapper.setData({
      ingredients: [
        {
          article_number: "998",
          name: "sample ingredient X",
          cost_per_amount: "1.01",
          amount: "501",
          unit: "kilogram",
        },
        {
          article_number: "997",
          name: "sample ingredient Y",
          cost_per_amount: "1.02",
          amount: "502",
          unit: "liter",
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
    expect(columnData(1, rows)[0]).toBe("sample ingredient X");

    // filters sample-Y by name
    await searchField.setValue("y");
    rows = wrapper.findAll("tbody > tr").wrappers;
    expect(rows).toHaveLength(1);
    expect(columnData(1, rows)[0]).toBe("sample ingredient Y");

    // filters sample-X by article_number
    await searchField.setValue("998");
    rows = wrapper.findAll("tbody > tr").wrappers;
    expect(rows).toHaveLength(1);
    expect(columnData(0, rows)[0]).toBe("998");
    expect(columnData(1, rows)[0]).toBe("sample ingredient X");

    // filters sample-Y by article_number
    await searchField.setValue("997");
    rows = wrapper.findAll("tbody > tr").wrappers;
    expect(rows).toHaveLength(1);
    expect(columnData(0, rows)[0]).toBe("997");
    expect(columnData(1, rows)[0]).toBe("sample ingredient Y");
  });
});
