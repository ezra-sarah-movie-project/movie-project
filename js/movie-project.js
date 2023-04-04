import {setFavorite, patchFavorite, deleteFavorite, getFavorites, getFavorite, renderMovieCards} from "./movies.js";
import {getMovies} from "./moviesApi.js";


(async ()=> {
    const movies = await getMovies();
    console.log(movies);

    let favorites = await getFavorites();
    console.log(favorites);
    let parent = document.querySelector('.slides');
    await renderMovieCards(favorites, parent);

    let userMovieTitle = document.querySelector('#movie-title-input');
    let userMovieRating = document.querySelector('#rating-input');
    let userMovieGenre = document.querySelector('#genre-input');
    let userMovieDescription = document.querySelector('#description-input');
    let userMovieSubmit = document.querySelector('#movie-submit-button');

    userMovieSubmit.addEventListener('click', async (event)=>{
        event.preventDefault();
        let userMovie = {
            title: userMovieTitle.value,
            genre: userMovieGenre.value,
            rating: userMovieRating.value,
            description: userMovieDescription.value,
        }
        await setFavorite(userMovie);
    });

    // Code to get the delete movie button to delete a movie
    let deleteButton = document.querySelector('#delete-movie-btn');
    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();
        let id = document.querySelector('#delete-by-id').value;
        let deletedMovie = await deleteFavorite(id);
        console.log(`Movie with ID ${id} deleted:`, deletedMovie);
    });

    let userPatchId = document.querySelector('#patch-id');
    let userPatchTitle = document.querySelector('#patch-title');
    let userPatchRating = document.querySelector('#patch-rating');
    let userPatchGenre = document.querySelector('#patch-genre');
    let userPatchDescription = document.querySelector('#patch-description');
    let userPatchButton = document.querySelector('#patch-button');

    userPatchButton.addEventListener('click', async (event)=>{
        event.preventDefault();
        let movieToUpdate = await getFavorite(userPatchId.value);

        let update = {
            title: userPatchTitle.value ? userPatchTitle.value : movieToUpdate.title,
            genre: userPatchGenre.value ? userPatchGenre.value : movieToUpdate.genre,
            rating: userPatchRating.value ? userPatchRating.value: movieToUpdate.rating,
            description: userPatchDescription.value ? userPatchDescription.value: movieToUpdate.description
        }
        await patchFavorite(userPatchId.value,update);
    });


    //CAROUSEL FUNCTIONALITY
    let arrows = document.querySelectorAll('.arrow');

    arrows.forEach(function(arrow){
        // start a direction variable
        let direction;
        let slideMask = document.querySelector('.slider-mask');
        let slidesContainer = document.querySelector('.slides');
        arrow.addEventListener('click', function(event){
            // if the arrow clicked has a class of left, set direction to left, otherwise set to right
            if (event.target.classList.contains('arrow-left')) {
                direction = 'left';
            } else {
                direction = 'right';
            }
            // get the active slide
            let activeSlide = slideMask.querySelector('.slide.active');
            // remove active class from active slide
            activeSlide.classList.remove('active');
            // if direction is left, get previous sibling, otherwise get next sibling and reassign to activeSlide
            if (direction === 'left') {
                activeSlide = activeSlide.previousElementSibling;
            } else {
                activeSlide = activeSlide.nextElementSibling;
            }
            //if activeSlide is null, we are at the end of the carousel
            if (!activeSlide) {
                //if direction is left, get last slide, otherwise get first slide
                activeSlide = direction === 'left' ? slidesContainer.lastElementChild : slidesContainer.firstElementChild;
            }
            //add active to the new active slide
            activeSlide.classList.add('active');
            // remove left and right classes from active slide
            activeSlide.classList.remove('left', 'right');

            let previousSibling = activeSlide.previousElementSibling;
            //get all previous element siblings
            let previousSlides = [];
            while (previousSibling) {
                previousSlides.unshift(previousSibling);
                previousSibling = previousSibling.previousElementSibling;
            }
            //loop through previous slides and add left class, remove right class
            previousSlides.forEach(function(slide){
                slide.classList.remove('right');
                slide.classList.add('left');
            });
            // get next sibling of active slide
            let nextSibling = activeSlide.nextElementSibling;
            // get all next element siblings
            let nextSlides = [];
            while (nextSibling) {
                nextSlides.push(nextSibling);
                nextSibling = nextSibling.nextElementSibling;
            }
            // loop through next slides and add right class, remove left class
            nextSlides.forEach(function(slide){
                slide.classList.remove('left');
                slide.classList.add('right');
            });
        });
    });

})();