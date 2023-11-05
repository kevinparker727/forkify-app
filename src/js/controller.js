/*
// import icons from '..img/icons.svg'; // Parcel 1
import icons from 'url:../img/icons.svg'; // Parcel 2 for anything that is a static file like images, music, videos, etc.
//  NOTE: Below is important for old browsers
import 'core-js/stable'; //polyfilling everything other than async await
import 'regenerator-runtime/runtime'; //polyiflling async await

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//  NOTE: Render Loading Spinner

const renderSpinner = function (parentEl) {
  const markup = `
  <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

//  NOTE: 1. Loading Recipe

const showRecipe = async function () {
  //returns a promise
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return; //guard clause in case there's no #

    renderSpinner(recipeContainer);

    const res = await fetch(
      //awaits the promise (function stops here until promise is handled)
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json(); //converts response to json() which then returns another promise which we then await again which we will eventually store in a variable

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    let { recipe } = data.data; //Changing names in the recipe object to get rid of underscores
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);

    //  NOTE: 2. Rendering Recipe

    const markup = `
      <figure class="recipe__fig">
            <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${recipe.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                recipe.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                recipe.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round">
              <svg class="">
                <use href="${icons}#icon-bookmark-fill"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
              ${recipe.ingredients
                .map(ing => {
                  return `
                  <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${ing.quantity}</div>
                    <div class="recipe__description">
                      <span class="recipe__unit">${ing.unit}</span>
                      ${ing.description}
                    </div>
                  </li>
                `;
                })
                .join('')}
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">0.5</div>
                <div class="recipe__description">
                  <span class="recipe__unit">cup</span>
                  ricotta cheese
                </div>
              </li>
            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                recipe.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${recipe.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
        `;
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', markup); //remember, this has to go into the parent element.
  } catch (err) {
    alert(err);
  }
};

//  NOTE: Imagine if you had 10 events you needed to listen for. You'd be writing addEventListener a lot. Below is an easier way.

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));

//  NOTE:  Above is a more efficient way of doing what's below.

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
*/

//  TITLE: Refactoring for MVC

//  NOTE: Code below is a copy of all of the code above so you can see the progression of everything.
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  //returns a promise
  try {
    const id = window.location.hash.slice(1);

    if (!id) return; //guard clause in case there's no #
    recipeView.renderSpinner();

    //  NOTE:  0. Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //  NOTE: 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //  NOTE: 2. Loading Recipe
    await model.loadRecipe(id); //this is an async function that will return a promise. We need to handle this promise whenever we call the function. It is also being called by an async function.

    //  NOTE: 3. Rendering Recipe
    recipeView.render(model.state.recipe);

    //  NOTE: 4. Error handling
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //  NOTE: 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //  NOTE: 2. Load search results
    await model.loadSearchResults(query);

    //  NOTE: 3. Render initial results
    // resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage(1));

    //  NOTE: 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //  NOTE: 1. Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //  NOTE: 2. Render New Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  //  NOTE: 1. Update Recipe View

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //  NOTE: 1. Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //  NOTE: 2. Update recipe view
  recipeView.update(model.state.recipe);

  //  NOTE: 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show Loading Spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //PushState will update the URL without reloading the page. PushState takes 3 arguments. The first is the state which doesn't really matter, can just write null. Second is title which is also not important, can just use an empty string. Third one is important and is the id that we want to use for the URL.

    //Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎉', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
