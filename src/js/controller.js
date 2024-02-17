import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';

import "core-js/stable";
import "regenerator-runtime/runtime";

if(module.hot){
  module.hot.accept();
}

///////////////////////////////////////
const controlRecipes= async function () {
  try {

    const id=window.location.hash.slice(1);
    if(!id) return

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    
    //2. fetching recipe
    await model.loadRecipe(id);
    
    //3.Rendering recipee
    recipeView.render(model.state.recipe);
    
    
  } catch (error) {
    console.log(error.message);
    recipeView.renderError();
  }
};

const controlSearchResults=async function(){
  try {
    resultsView.renderSpinner();
    // 1) Get Search query
    const query=searchView.getQuery();
    if(!query) return;
    // 2) Load search results
    
    await model.loadSearchResults(query);
    // 3) Render results;
    resultsView.render(model.getSearchResultsPage());

    // 4) Render Pagination;
    paginationView.render(model.state.search);

  } catch (error) {
    console.log(error)
  }
}

const controlPagination = function(goToPage){
  // 1) Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render NEW Pagination;
    paginationView.render(model.state.search);
};

const controlServings = function(newServings){
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  recipeView.update(model.state.recipe);
}
const controlAddBookmark = function(){
  // 1) Add/remove bookmark

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}
const init = function(){ 
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults); 
  paginationView.addHandlerClick(controlPagination);
  
}
init();

const clearBookmarks = function(){
  localStorage.clear('bookmarks');
};
//clearBookmarks()
