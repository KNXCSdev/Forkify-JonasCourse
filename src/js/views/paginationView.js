import icons from "url:../../img/icons.svg";
import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    // Only Page 1, and there are no other pages
    if (numPages === 1) return "";

    // Page 1, and there are other pages
    if (curPage === 1) {
      return this._generateButtonMarkup("next", curPage + 1);
    }

    // Last Page
    if (curPage === numPages) {
      return this._generateButtonMarkup("prev", curPage - 1);
    }

    // Other page
    return `
      ${this._generateButtonMarkup("prev", curPage - 1)}
      ${this._generateButtonMarkup("next", curPage + 1)}
    `;
  }

  _generateButtonMarkup(direction, page) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--${direction}">
        ${direction === "prev" ? this._generateIcon("left") : ""}
        <span>Page ${page}</span>
        ${direction === "next" ? this._generateIcon("right") : ""}
      </button>
    `;
  }

  _generateIcon(direction) {
    return `
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${direction}"></use>
      </svg>
    `;
  }
}

export default new PaginationView();
