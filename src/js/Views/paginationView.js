import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    }); //we add the listener to the parent element so we don't have to addEventListener to the 2 buttons individually. This adds it to both of them automatically. We're using event delegation with the "e" to listen for the event on each button so we know which one was clicked. The closest method is important for searching up in the tree instead of down in the tree like we would do with QuerySelector
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const prevButton = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
    </button>
    `;
    const nextButton = `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
       <span>Page ${curPage + 1}</span>
       <svg class="search__icon">
         <use href="${icons}#icon-arrow-right"></use>
       </svg>
     </button>`;

    //  NOTE: Page 1, there are other pages
    if (curPage === 1 && numPages > 1) {
      return nextButton;
    }

    //  NOTE: Last page
    if (curPage === numPages && numPages > 1) {
      return prevButton;
    }

    //  NOTE: Random Page
    if (curPage < numPages) {
      return prevButton + nextButton;
    }
    //  NOTE: Page 1 and there are no other pages
    return '';
  }
}

export default new paginationView();
