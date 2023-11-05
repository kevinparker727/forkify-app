import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHanlderHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHanlderHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //this is new modern way to insert an entire form instead of inserting each element individually. in the FormData, it takes in a form which in this case is the this keyword because that points to the parent element directly above. This method will return an object that we can't really use, but we can transform it into an array and spread it so we can read it.
      const data = Object.fromEntries(dataArr); //since we need our data to be in an object, not an array, this method will convert the readable array back into an object which is now also readable.
      handler(data);
      //eventually this data will turn into an API call. All API calls are handled in the Model.js. So we need to get this data to the model which means we need a controller function which will then be the handler of this event.
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
