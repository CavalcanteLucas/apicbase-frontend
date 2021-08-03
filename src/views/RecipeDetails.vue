<template>
  <div id="recipe-detail">
    <div class="container">
      <div class="col-12 mx-auto">
        <div class="row" style="padding-top: 2rem;">
          <h2>
            <strong>{{ recipe.name }}</strong>
          </h2>
        </div>
        <div class="row" style="padding-top: 2rem;">
          <div class="col-10 mx-auto">
            <table
              class="table table-striped"
              aria-label="Recipes details table"
            >
              <thead>
                <th scope="col">Ingredient</th>
                <th scope="col">Amount</th>
                <th scope="col">Unit</th>
                <th scope="col">Cost</th>
                <th scope="col">U. cost</th>
              </thead>
              <tbody>
                <tr v-for="item in recipeDetails" :key="item.id">
                  <td class="align-middle ">{{ item.ingredient }}</td>
                  <td class="align-middle">{{ item.amount_per_recipe }}</td>
                  <td class="align-middle">{{ item.unit }}</td>
                  <td class="align-middle">&euro;{{ item.cost }}</td>
                  <td class="align-middle">&euro;{{ item.cost_per_amount }}</td>
                  <td class="align-middle">
                    <button
                      type="button"
                      id="deleteBtn"
                      class="btn btn-sm btn-danger"
                      @click="deleteRecipeItem(item)"
                    >
                      <img src="../assets/img/trash.svg" alt="Delete" />
                    </button>
                    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="col-12" style="padding-top: 2rem;">
              <form id="recipesForm" @submit.prevent="createRecipeFormula">
                <div class="row g-1">
                  <div class="col-md-2  ms-auto">
                    <select
                      id="selectedIngredient"
                      class="form-select"
                      aria-label="Select ingredient"
                      v-model="selectedIngredient.id"
                      required="required"
                    >
                      <option
                        v-for="ingredient in ingredients"
                        :value="ingredient.id"
                        :key="ingredient.id"
                        >{{ ingredient.name }} ({{ ingredient.unit }})</option
                      >
                    </select>
                  </div>
                  <div class="col-md-1 ">
                    <input
                      type="number"
                      class="form-control"
                      id="inputAmount"
                      placeholder="Amount"
                      aria-label="Amount"
                      v-model="selectedIngredient.amount"
                      min=".01"
                      step=".01"
                      required="required"
                    />
                  </div>
                  <div class="col-md-3 ">
                    <button
                      type="button"
                      id="clearBtn"
                      v-on:click="clearRecipeForm()"
                      class="btn btn-outline-secondary float-start"
                    >
                      <img src="../assets/img/backspace.svg" alt="Clear" />
                    </button>
                    <button
                      type="submit"
                      id="submitBtn"
                      class="btn btn-success float-start"
                      style="margin-left: 0.25rem;"
                    >
                      <img src="../assets/img/plus-circle.svg" alt="Add" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <h5>
              <strong
                >Total cost: &euro;{{ recipeCost }}</strong
              >
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmDialogue from "../components/ConfirmDialogue.vue";

export default {
  name: "RecipeDetails",
  components: { ConfirmDialogue },
  data() {
    return {
      recipe: {},
      recipeDetails: [],
      recipeCost: null,

      ingredients: [],
      selectedIngredient: {
        id: null,
        amount: null,
      },
    };
  },
  async created() {
    await this.getRecipe();
    await this.getRecipeDetails();
    await this.getRecipeCost();
    await this.getIngredients();
  },
  methods: {
    async getIngredients() {
      let response = await fetch(`${process.env.VUE_APP_BACKEND_API}/api/ingredients/`);
      this.ingredients = await response.json();
    },
    async getRecipe() {
      let response = await fetch(
        `${process.env.VUE_APP_BACKEND_API}/api/recipes/${this.$route.params.id}/`
      );
      this.recipe = await response.json();
    },
    async getRecipeDetails() {
      let response = await fetch(
        `${process.env.VUE_APP_BACKEND_API}/api/recipes/${this.$route.params.id}/details/`
      );
      this.recipeDetails = await response.json();
    },
    async getRecipeCost() {
      let response = await fetch(
        `${process.env.VUE_APP_BACKEND_API}/api/recipes/${this.$route.params.id}/cost/`
      );
      this.recipeCost = await response.json();
    },
    async deleteRecipeItem(item) {
      await this.getRecipe();
      await this.getRecipeDetails();
      await this.getRecipeCost();
      const ok = await this.$refs.confirmDialogue[0].show();
      if (ok) {
        await fetch(`${process.env.VUE_APP_BACKEND_API}/api/recipes-formulas/${item.id}/`, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.ingredient),
        });
      }
      await this.getRecipe();
      await this.getRecipeDetails();
      await this.getRecipeCost();
    },
    async createRecipeFormula() {
      await this.getRecipe();
      await this.getRecipeDetails();
      await this.getRecipeCost();
      await fetch(`${process.env.VUE_APP_BACKEND_API}/api/recipes-formulas/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipe: this.$route.params.id,
          ingredient: this.selectedIngredient.id,
          amount_per_recipe: this.selectedIngredient.amount,
        }),
      });
      await this.getRecipe();
      await this.getRecipeDetails();
      await this.getRecipeCost();
    },
    clearRecipeForm() {
      this.selectedIngredient = {
        id: null,
        amount: null,
      };
    },
  },
};
</script>

<style>
h5 {
  text-align: right;
  padding-top: 3rem;
}
</style>
