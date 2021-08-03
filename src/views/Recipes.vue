<template>
  <div id="recipes">
    <div class="container">
      <div class="col-12 mx-auto">
        <div class="row">
          <div class="col-4 mx-auto">
            <div class="input-group mb-3">
              <span class="input-group-text" id="search-recipe"
                ><img src="../assets/img/search.svg" alt="Search"
              /></span>
              <input type="text" id="searchField" class="form-control" v-model="searchQuery" />
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

        <div class="row" style="padding-top: 1rem;">
          <div class="col-6 mx-auto">
            <form id="recipesForm" @submit.prevent="submitForm">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  id="inputName"
                  placeholder="Name"
                  aria-label="Name"
                  v-model="recipe.name"
                  required="required"
                />
                <button
                  type="button"
                  id="clearBtn"
                  v-on:click="clearRecipeForm()"
                  class="btn btn-outline-secondary"
                >
                  <img src="../assets/img/backspace.svg" alt="Clear" />
                </button>
                <button type="submit" id="submitBtn" class="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <p class="error" style="padding-top: 1rem;" v-if="!isResponseOK">
          Something went wrong. Please try again..
        </p>

        <div class="row" style="padding-top: 2rem;">
          <div class="col-8 mx-auto">
            <table
              class="table table-striped table-hovering"
              aria-label="Recipes table"
            >
              <thead>
                <th scope="col"></th>
              </thead>
              <tbody>
                <tr
                  v-for="recipe in resultQuery"
                  :key="recipe.id"
                  @click="$data.recipe = recipe"
                >
                  <td>
                    <button
                      type="button"
                      id="detailBtn"
                      class="btn btn-sm btn-dark"
                      @click="viewRecipeDetail(recipe.id)"
                    >
                      <img src="../assets/img/eye.svg" alt="Details" />
                    </button>
                  </td>
                  <td class="align-middle">{{ recipe.name }}</td>
                  <td>
                    <button
                      type="button"
                      id="deleteBtn"
                      class="btn btn-sm btn-danger"
                      @click="deleteRecipe(recipe)"
                    >
                      <img src="../assets/img/trash.svg" alt="Delete" />
                    </button>
                  </td>
                  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
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
  name: "Recipes",
  components: { ConfirmDialogue },
  data() {
    return {
      searchQuery: null,
      recipe: {
        name: null,
      },
      recipes: [],
      isResponseOK: true,
    };
  },
  async created() {
    await this.getRecipes();
  },
  methods: {
    submitForm() {
      if (this.recipe.id === undefined) {
        this.createRecipe();
      } else {
        this.editRecipe();
      }
    },
    async getRecipes() {
      let response = await fetch("http://localhost:8000/api/recipes/");
      this.recipes = await response.json();
    },
    async createRecipe() {
      await this.getRecipes();
      let response = await fetch("http://localhost:8000/api/recipes/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.recipe),
      });
      this.isResponseOK = response.ok;
      await this.getRecipes();
    },
    async editRecipe() {
      await this.getRecipes();
      await fetch(`http://localhost:8000/api/recipes/${this.recipe.id}/`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.recipe),
      });
      await this.getRecipes();
    },
    async deleteRecipe() {
      await this.getRecipes();
      const ok = await this.$refs.confirmDialogue[0].show();
      if (ok) {
        await fetch(`http://localhost:8000/api/recipes/${this.recipe.id}/`, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.recipe),
        });
      }
      await this.getRecipes();
    },
    viewRecipeDetail(recipeId) {
      this.$router.push({ name: "RecipeDetails", params: { id: recipeId } });
    },
    clearRecipeForm() {
      this.recipe = {
        name: null
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
        return this.recipes.filter((recipe) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((item) => {
              return recipe.name.toLowerCase().includes(item);
            });
        });
      } else {
        return this.recipes;
      }
    },
  },
};
</script>

<style></style>
