import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import ResultsView from "./views/resultsView.js";
import BookmarksView from "./views/bookmarksView.js";
import PaginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import cartView from "./views/cartView.js";

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //Updating results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //UPDATING BOOKMARKSVIEW
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    //NOTE model.LoadRecipe selecting function from model.js it behaves like objects
    await model.loadRecipe(id);

    //SECTION 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
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

  //UPDATE THE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipeView
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddShopping = function () {
  model.state.cartIngredients = model.state.recipe.ingredients.map((ingredient) => ({
    ...ingredient,
  }));

  cartView.render(model.state.cartIngredients);
};

const controlDeleteCartItem = function (ingredientIndex) {
  // Check if index is valid

  if (ingredientIndex >= 0 && ingredientIndex < model.state.cartIngredients.length) {
    model.state.cartIngredients.splice(ingredientIndex, 1);

    cartView.render(model.state.cartIngredients);
  }
};

const controlDeleteAllCart = function () {
  model.state.cartIngredients = [];

  cartView.render(model.state.cartIngredients);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the newRecipe
    await model.uploadRecipe(newRecipe);

    //RENDER RECIPE
    recipeView.render(model.state.recipe);

    //SUCCESS MESSAGE
    addRecipeView.renderMessage();

    //REnder nookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change id in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //CLOSE FORM WINDOW
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddShopping(controlAddShopping);

  cartView.addHandlerDeleteItem(controlDeleteCartItem);
  cartView.addHandlerDeleteAll(controlDeleteAllCart);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
