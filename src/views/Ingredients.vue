<template>
  <div id="ingredients">
    <div class="container">
      <div class="col-12 mx-auto">
        <div class="row">
          <div class="col-4 mx-auto">
            <div class="input-group mb-3">
              <span class="input-group-text" id="search-ingredient"
                ><img src="../assets/img/search.svg" alt="Search"
              /></span>
              <input
                type="text"
                id="searchField"
                class="form-control"
                v-model="searchQuery"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                id="clearSearchBtn"
                @click="clearSearchField"
              >
                <img src="../assets/img/backspace.svg" alt="Clear Search" />
              </button>
            </div>
          </div>
        </div>

        <div class="row justify-content-center" style="padding-top: 1rem;">
          <div class="col-md-10 offset-md-1">
            <form id="ingredientForm" @submit.prevent="submitForm">
              <div class="row g-1">
                <div class="col-md-1">
                  <input
                    type="number"
                    class="form-control"
                    id="inputArticleNumber"
                    placeholder="#"
                    v-model="ingredient.article_number"
                    min="1"
                    required="required"
                  />
                </div>
                <div class="col-md-3">
                  <input
                    type="text"
                    class="form-control"
                    id="inputName"
                    placeholder="Name"
                    aria-label="Name"
                    v-model="ingredient.name"
                    required="required"
                  />
                </div>
                <div class="col-md-2">
                  <input
                    type="number"
                    class="form-control"
                    id="inputAmount"
                    placeholder="Amount"
                    v-model="ingredient.amount"
                    min=".01"
                    step=".01"
                    required="required"
                  />
                </div>
                <div class="col-md-1">
                  <select
                    class="form-select"
                    aria-label="Select unit"
                    id="inputUnit"
                    v-model="ingredient.unit"
                    required="required"
                  >
                    <option value="unit">Unit</option>
                    <option value="gram">gram</option>
                    <option value="kilogram">kilogram</option>
                    <option value="liter">liter</option>
                    <option value="centiliter">centiliter</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <div class="input-group mb-3">
                    <span class="input-group-text" id="inputCostPerAmount"
                      >&euro;</span
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="inputCostPerAmount"
                      placeholder="Cost"
                      v-model="ingredient.cost_per_amount"
                      min=".01"
                      step=".01"
                      required="required"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <button
                    type="button"
                    id="clearBtn"
                    v-on:click="clearIngredientForm()"
                    class="btn btn-outline-secondary float-start"
                  >
                    <img src="../assets/img/backspace.svg" alt="Clear" />
                  </button>
                  <button
                    type="submit"
                    id="submitBtn"
                    class="btn btn-primary float-start"
                    style="margin-left: 0.25rem;"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <p class="error" v-if="!isResponseOK">
          Something went wrong. Please try again..
        </p>

        <div class="row" style="padding-top: 2rem;">
          <div class="col-12 mx-auto">
            <table
              class="table table-striped table-hovering"
              aria-label="Ingredients table"
            >
              <thead>
                <th scope="col"><strong>#</strong></th>
                <th scope="col">Name</th>
                <th scope="col">Amount</th>
                <th scope="col">Unit</th>
                <th scope="col">Cost</th>
              </thead>
              <tbody>
                <tr
                  v-for="ingredient in resultQuery"
                  :key="ingredient.id"
                  @click="$data.ingredient = ingredient"
                >
                  <td class="align-middle">
                    <strong>{{ ingredient.article_number }}</strong>
                  </td>
                  <td class="align-middle">{{ ingredient.name }}</td>
                  <td class="align-middle">{{ ingredient.amount }}</td>
                  <td class="align-middle">{{ ingredient.unit }}</td>
                  <td class="align-middle">
                    &euro;{{ ingredient.cost_per_amount }}
                  </td>
                  <td class="align-middle">
                    <button
                      type="button"
                      id="deleteBtn"
                      class="btn btn-sm btn-danger"
                      @click="deleteIngredient(ingredient)"
                    >
                      <img src="../assets/img/trash.svg" alt="Delete" />
                    </button>
                    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "../components/ConfirmDialogue.vue";

export default {
  name: "Ingredients",
  components: { ConfirmDialogue },
  data() {
    return {
      searchQuery: null,
      ingredient: {
        article_number: null,
        name: null,
        cost_per_amount: null,
        amount: null,
        unit: "gram",
      },
      ingredients: [],
      isResponseOK: true,
    };
  },
  async created() {
    await this.getIngredients();
  },
  methods: {
    submitForm() {
      if (this.ingredient.id === undefined) {
        this.createIngredient();
      } else {
        this.editIngredient();
      }
    },
    async getIngredients() {
      let response = await fetch("http://localhost:8000/api/ingredients/");
      this.ingredients = await response.json();
    },
    async createIngredient() {
      await this.getIngredients();
      let response = await fetch("http://localhost:8000/api/ingredients/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.ingredient),
      });
      this.isResponseOK = response.ok;
      await this.getIngredients();
    },
    async editIngredient() {
      await this.getIngredients();
      let response = await fetch(
        `http://localhost:8000/api/ingredients/${this.ingredient.id}/`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.ingredient),
        }
      );
      this.isResponseOK = response.ok;
      await this.getIngredients();
    },
    async deleteIngredient(ingredient) {
      await this.getIngredients();
      const ok = await this.$refs.confirmDialogue[0].show();
      if (ok) {
        await fetch(`http://localhost:8000/api/ingredients/${ingredient.id}/`, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.ingredient),
        });
      }
      await this.getIngredients();
    },
    clearIngredientForm() {
      this.ingredient = {
        article_number: null,
        name: null,
        cost_per_amount: null,
        amount: null,
        unit: "gram",
      };
      this.isResponseOK = true;
    },
    clearSearchField() {
      this.searchQuery = "";
    },
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.ingredients.filter((ingredient) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((item) => {
              return (
                ingredient.name.toLowerCase().includes(item) ||
                ingredient.article_number == item
              );
            });
        });
      } else {
        return this.ingredients;
      }
    },
  },
};
</script>

<style></style>
