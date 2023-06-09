import {getFavorites, renderMovieCards, newUserMovie, userDeleteSubmit, userPatchSubmit} from "./movies-utils.js";
import {getMovies} from "./moviesApi.js";

//main line JS
(async ()=> {
    //fetch movies from tmdb API
    const movies = await getMovies();
    console.log(movies);

    //fetch favorite movies from db.json
    let favorites = await getFavorites();
    console.log(favorites);

    //target parent for carousel favorite movies insertion
    let parent = document.querySelector('.slides');
    //render movie cards in carousel
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