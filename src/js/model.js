import { async } from "regenerator-runtime";
import { API_URL, KEY, RES_PER_PAGE, SPOON_KEY, SPOON_URL } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  cartIngredients: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}?key=${KEY}`);

    //CHANGED names of the objects AND changed order
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const recipeNutrition = async function (query) {
  try {
    const data = await AJAX(
      `${SPOON_URL}recipes/complexSearch?query=${query}&number=1&includeNutrition=true&apiKey=${SPOON_KEY}`
    );

    const id = data.results[0].id;
    if (!id) return;
    const productData = await AJAX(
      `${SPOON_URL}recipes/${id}/nutritionWidget.json?apiKey=${SPOON_KEY}`
    );

    const nutritionData = {
      calories: productData.calories,
      carbs: productData.carbs,
      fat: productData.fat,
      protein: productData.protein,
      caloricBreakdown: {
        percentCarbs: productData.caloricBreakdown.percentCarbs,
        percentFat: productData.caloricBreakdown.percentFat,
        percentProtein: productData.caloricBreakdown.percentProtein,
      },
    };
    state.recipe.nutrition = nutritionData;
    console.log(nutritionData);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * 16;
  const end = page * 16;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.map((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt=OldQt*newServings/oldServings//2*8/4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const persistCart = function () {
  localStorage.setItem("cart", JSON.stringify(state.cartIngredients));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark curAt recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  const cart = localStorage.getItem("cart");
  if (storage) state.bookmarks = JSON.parse(storage);
  if (cart) state.cartIngredients = JSON.parse(cart);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

export const addIngredients = function () {
  state.cartIngredients = state.recipe.ingredients.map((ingredient) => ({
    ...ingredient,
  }));
  persistCart();
};

export const deleteCartItem = function (ingredientIndex) {
  state.cartIngredients.splice(ingredientIndex, 1);

  persistCart();
};

export const deleteAllCart = function () {
  state.cartIngredients = [];
  persistCart();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => {
        return (
          entry[0].startsWith("ingredient") &&
          (entry[0].includes("_quantity") ||
            entry[0].includes("_unit") ||
            entry[0].includes("_description")) &&
          entry[1] !== ""
        );
      })
      .reduce((acc, key) => {
        const match = key[0].match(/ingredient(-\d+)(_quantity|_unit|_description)/);

        const index = match[1].replace("-", "") - 1;
        const type = match[2].replace("_", "");

        if (!acc[index]) acc[index] = { quantity: null, unit: "", description: "" };

        acc[index][type] = key[1];

        return acc;
      }, []);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
