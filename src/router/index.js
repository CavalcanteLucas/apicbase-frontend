import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/ingredients",
    name: "Ingredients",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Ingredients.vue"),
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Recipes.vue"),
  },
  {
    path: "/recipes/:id",
    name: "RecipeDetails",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RecipeDetails.vue"),
  },
  {
    path: "*",
    name: "NotFound404",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/NotFound404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
