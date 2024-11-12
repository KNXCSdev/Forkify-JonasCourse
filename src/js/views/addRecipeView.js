import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2
import { MAX_INGREDIENTS } from "../config.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded :)";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _btnAdd = document.querySelector(".add__ingredient");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this.addHandlerAddIngredient();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  // Adding more ingredients input fields to add recipe functionality
  _addNewIngredient() {
    // count of existing ingredients
    const countIng = Array.from(this._parentElement.querySelectorAll(".ingredients")).length;

    // Hide '+' button, if limit of ingredients is passed
    if (countIng + 1 === MAX_INGREDIENTS) this._btnAdd.classList.add("hidden");

    return `
          <label>Ingredient ${countIng + 1}</label>
          <div class="ingredients">
            <input value="" type="number" pattern="[0-9]*" required name="ingredient-${
              countIng + 1
            }_quantity" placeholder="Quantity" />
            <select name="ingredient-${countIng + 1}_unit">
              <option selected disabled hidden>Unit</option>
              <option value="gram">Gram</option>
              <option value="milligram">Milligram</option>
              <option value="kilogram">Kilogram</option>
              <option value="ounce">Ounce</option>
              <option value="pound">Pound</option>
              <option value="litre">Litre</option>
              <option value="millilitre">Millilitre</option>
            </select>
            <input value="" type="text" pattern="[A-Za-z]*" required name="ingredient-${
              countIng + 1
            }_description" placeholder="Description" />
          </div>
    `;
  }

  // When '+' button is clicked
  addHandlerAddIngredient() {
    this._btnAdd.addEventListener(
      "click",
      function () {
        this._btnAdd.insertAdjacentHTML("beforebegin", this._addNewIngredient());
      }.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];

      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
