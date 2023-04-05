import {setFavorite, patchFavorite, deleteFavorite, getFavorites, getFavorite, renderMovieCards, newUserMovie, userDeleteSubmit, userPatchSubmit} from "./movies.js";
import {getMovies} from "./moviesApi.js";


(async ()=> {
    const movies = await getMovies();
    console.log(movies);

    let favorites = await getFavorites();
    console.log(favorites);
    let parent = document.querySelector('.slides');
    await renderMovieCards(favorites, parent);

    //target user movie submit button
    let userMovieSubmit = document.querySelector('#movie-submit-button');
    // store user entered movie into database using post method
    userMovieSubmit.addEventListener('click', newUserMovie);

    // Code to get the delete movie button to delete a movie by id
    let deleteButton = document.querySelector('#delete-movie-btn');
    // delete movie by id that user entered
    deleteButton.addEventListener('click',userDeleteSubmit);

    // target the patch button to submit changes
    let userPatchButton = document.querySelector('#patch-button');
    // update the selected movie based on user inputs
    userPatchButton.addEventListener('click',userPatchSubmit);

})();