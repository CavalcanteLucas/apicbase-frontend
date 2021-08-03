import Vue from "vue";
import { mount, config } from "@vue/test-utils";
import RecipeDetails from "../../src/views/RecipeDetails.vue";

config.showDeprecationWarnings = false;

describe("recipe details view", () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = mount(RecipeDetails, {
      methods: {
        getRecipe: () => {
          // do nothing
        },
        getRecipeDetails: () => {
          // do nothing
        },
        getRecipeCost: () => {
          // do nothing
        },
        getIngredients: () => {
          // do nothing
        },
      },
    });
    await wrapper.setData({
      recipe: {
        name: "carrot cake",
      },
      ingredients: [
        {
          id: 0,
          article_number: "42",
          name: "carrot",
          cost_per_amount: "1.00",
          amount: "500",
          unit: "gram",
        },
        {
          id: 1,
          article_number: "43",
          name: "cream",
          cost_per_amount: "5.00",
          amount: "10",
          unit: "centiliter",
        },
      ],
    });
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it("has data", () => {
    expect(typeof RecipeDetails.data).toBe("function");
  });

  it("is a Vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("renders the correct title, table headers, and total cost", () => {
    expect(wrapper.html()).toContain("carrot cake");
    expect(wrapper.html()).toContain("Ingredient");
    expect(wrapper.html()).toContain("Amount");
    expect(wrapper.html()).toContain("Unit");
    expect(wrapper.html()).toContain("U. cost");
    expect(wrapper.html()).toContain("Total cost:");
  });

  it("has two input fields", () => {
    expect(wrapper.contains('input[id="inputAmount"]')).toBe(true);
    expect(wrapper.contains('select[id="selectedIngredient"]')).toBe(true);
  });

  it("has a clear input button, and a submit button", () => {
    expect(wrapper.contains('button[id="clearBtn"]')).toBe(true);
    expect(wrapper.contains('button[id="submitBtn"]')).toBe(true);
  });

  it("input fields load data", () => {
    expect(wrapper.vm.$data.selectedIngredient).toEqual({
      id: null,
      amount: null,
    });
    wrapper.find('select[id="selectedIngredient"]').setValue(0);
    wrapper.find('input[id="inputAmount"]').setValue(100);
    expect(wrapper.find('select[id="selectedIngredient"]').element.value).toBe(
      "0"
    );
    expect(wrapper.find('input[id="inputAmount"]').element.value).toBe("100");
    expect(wrapper.vm.$data.selectedIngredient).toEqual({
      id: 0,
      amount: "100",
    });
  });

  it("clear button wipes loaded data out", async () => {
    await wrapper.setData({
      selectedIngredient: {
        id: 0,
        amount: "100",
      },
    });

    expect(wrapper.vm.$data.selectedIngredient).toEqual({
      id: 0,
      amount: "100",
    });

    let clearBtn = wrapper.find('button[id="clearBtn"]');
    expect(clearBtn.exists()).toBe(true);
    expect(clearBtn.is("button")).toBe(true);
    await clearBtn.trigger("click");

    expect(wrapper.vm.$data.selectedIngredient).toEqual({
      id: null,
      amount: null,
    });

    expect(wrapper.find('select[id="selectedIngredient"]').element.value).toBe(
      ""
    );
    expect(wrapper.find('input[id="inputAmount"]').element.value).toBe("");
  });

  it("opens confirmation modal when delete button is pressed", async () => {
    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(0);
    await wrapper.setData({
      recipeDetails: [
        {
          ingredient: "carrot",
          amount_per_recipe: "100",
          unit: "gram",
          cost: "0.2",
          cost_per_amount: "0.002",
        },
        {
          ingredient: "cream",
          amount_per_recipe: "50",
          unit: "centiliter",
          cost: "2",
          cost_per_amount: "0.04",
        },
      ],
    });

    expect(wrapper.findAll("tbody > tr").wrappers).toHaveLength(2);
    let deleteBtn = wrapper.find('button[id="deleteBtn"]');
    expect(deleteBtn.exists()).toBe(true);
    expect(deleteBtn.is("button")).toBe(true);
    let modal = wrapper.find('div[class="popup-modal"]');
    expect(modal.exists()).toBe(false);

    await deleteBtn.trigger("click");
    await Vue.nextTick();

    modal = wrapper.find('div[class="popup-modal"]');

    expect(modal.exists()).toBe(true);
    expect(modal.is("div")).toBe(true);
    expect(modal.text()).toContain("Are you sure about that?");
    expect(modal.text()).toContain("Nevermind..");
    expect(modal.text()).toContain("Just do it!");
  });

  it("closes confirmation modal when cancel button is pressed", async () => {
    await wrapper.setData({
      recipeDetails: [
        {
          ingredient: "carrot",
          amount_per_recipe: "100",
          unit: "gram",
          cost: "0.2",
          cost_per_amount: "0.002",
        },
        {
          ingredient: "cream",
          amount_per_recipe: "50",
          unit: "centiliter",
          cost: "2",
          cost_per_amount: "0.04",
        },
      ],
    });
    let deleteBtn = wrapper.find('button[id="deleteBtn"]');
    expect(deleteBtn.exists()).toBe(true);
    expect(deleteBtn.is("button")).toBe(true);
    await deleteBtn.trigger("click");
    await Vue.nextTick();

    let cancelBtn = wrapper.find('button[id="cancelBtn"]');
    expect(cancelBtn.exists()).toBe(true);
    expect(cancelBtn.is("button")).toBe(true);
    await cancelBtn.trigger("click");

    let modal = wrapper.find('div[class="popup-modal"]');
    expect(modal.exists()).toBe(false);
    cancelBtn = wrapper.find('button[id="cancelBtn"]');
    expect(cancelBtn.exists()).toBe(false);
  });
});
