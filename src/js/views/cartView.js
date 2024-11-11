import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class CartView extends View {
  _parentElement = document.querySelector(".cart__list");
  _errorMessage = "No items in cart yet. Find a nice recipe and add the ingredients to a cart :)";
  _message = "";

  addHandlerDeleteItem(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".cart__btn");
      if (!btn) return;

      const ingredientIndex = +btn.dataset.ingredientIndex;

      handler(ingredientIndex);
    });
  }

  addHandlerDeleteAll(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".cart--delete");
      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
      ${this._data
        .map(
          (ingredient, index) => `
            <li class="cart__item">
              <div class="cart__quantity">${ingredient.quantity || ""} ${ingredient.unit || ""} ${
            ingredient.description
          }</div>
              <button class="cart__btn" data-ingredient-index="${index}"> 
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
            </li>
          `
        )
        .join("")}
        <div class='cart__flex'>
      <button class="btn--small btn--shop cart--delete"> 
        DELETE ALL
      </button>
      <button class="btn--small btn--shop cart--order"> 
        ORDER
      </button>
      </div>
    `;
  }
}

export default new CartView();
