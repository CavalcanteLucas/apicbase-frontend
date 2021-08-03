# APICBASE

## Full-Stack Developer challenge assignment - Frontend

Written by *Lucas Cavalcante*, 2021

## Project setup

This project requires `node>=14.17.0`.

After clonning the repository, install the project dependencies:

```bash
npm install
```

And start the server:

```bash
npm run serve
```

The project should be running at <http://localhost:8080>.

Make sure that the backend project is running. Check <https://github.com/cavalcantelucas/apicbase-backend> for more information.

### Run the tests

```bash
npm run test:unit
```

In case the snapshots need update, run

```bash
npm run test:unit -- -u
```

### Check for Lint fixes

```bash
npm run lint
```

## Utilization instructions

- `/`
  - See information about the project
- `/ingredients`
  - Add ingredients
    - Fill input fields with ingredient details
    - Press the `Save` button to create a new ingredient
    - Optionally, press the `<x` button to clear the fields
  - See ingredients list
    - See the created ingredient in the list of ingredients
  - Edit an ingredient information
    - Click on the ingredient you want to edit in the list of ingredients
    - Edit information using the input fields
    - Optionally, press the `<x` button to clear the fields
    - Press `Save` when finish to edit the ingredient
  - Delete an ingredient from the list
    - Press the `trash` button besides the ingredient to delete it
    - Confirm that you want to delete the ingredient
  - Search for ingredients
    - Use the search field to look for ingredients
    - Optionally, press the `<x` button to clear the fields
    - Ingredients can be found by `article number` or by `name`
- `/recipes`
  - Add recipes
    - Fill the input fields with recipe details
    - Press the `Save` button to create a new recipe
    - Optionally, press the `<x` button to clear the fields
  - See recipes list
    - See the created recipe in the list of recipes
  - Delete a recipe from the list
    - Press the `trash` button besides the recipe to delete it
    - Confirm that you want to delete the recipe
  - Search for recipes
    - Use the search field to look for recipes
    - Optionally, press the `<x` button to clear the fields
    - Recipes can be found by `name`
  - See recipes details
    - Press the `eye` button to see the details of a recipe in a new page
      - Add an ingredient to the recipe
        - Fill the input fields with ingredient details
        - Optionally, press the `<x` button to clear the fields
        - Press the `+` button to add a new ingredient to the recipe
      - Remove an ingredient from the recipe
        - Press the `trash` button besides the ingredient to remove it from the recipe
        - Confirm that you want to remove the ingredient from the recipe
      - See the total cost of the recipe
