import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner(recipeContainer);

    // 1) Loading Recipe
    //NOTE model.LoadRecipe selecting function from model.js it behaves like objects
    await model.loadRecipe(id);

    //SECTION 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

controlRecipes();

window.addEventListener('hashchange', controlRecipes);
window.addEventListener('load', controlRecipes);
