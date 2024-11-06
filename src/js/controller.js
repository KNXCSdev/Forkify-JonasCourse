import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import ResultsView from "./views/resultsView.js";
import PaginationView from "./views/paginationView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading Recipe
    //NOTE model.LoadRecipe selecting function from model.js it behaves like objects
    await model.loadRecipe(id);

    //SECTION 2) Rendering recipe
    recipeView.render(model.state.recipe);
    controlServings();
  } catch (err) {
    alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1 Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW RESULTS
  // resultsView.render(model.state.search.results)
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings = 1) {
  //UPDATE THE RECIPE SERVINGS (IN STATE)
  model.updateServings(newServings);

  recipeView.render(model.state.recipe);
  //UPDATE THE RECIPE VIEW
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
