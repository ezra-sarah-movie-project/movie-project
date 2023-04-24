import {getLocalMovies} from "./db-interaction.js";

// loading screen while loading DOM
window.addEventListener('load',()=>{
    const loader = document.querySelector('.loading');
    loader.classList.add('loading-hidden');
    loader.addEventListener('transitioned', ()=>{
        document.body.removeChild("loading");
    });
});

// render favorite movies in carousel
export const renderCarouselCards = (movies, parent) => {
    movies.forEach(movie => {
        const element = document.createElement('div');
        if (movie.id === 1) {
            element.classList.add('slide', 'active');
        } else {
            element.classList.add('slide', 'right');
        }
        element.innerHTML = `
      <div class="column shrink movie-container">
        <div class="column shrink movie-container-left">
          <div class="column shrink align-center">
            <img src=${movie.image} alt="" class="movie-poster">
          </div>
        </div>
        <div class="column shrink movie-container-right">
          <h2>${movie.title}</h2>
          <p>${movie.rating} Stars</p>
          <p>Genre: ${movie.genre}</p>
          <p>${movie.description}</p>
          <div class="movie-container-buttons">
            <button type="button" class="remove-button">Remove</button>
            <button type="button">Watch Trailer</button>
          </div>
        </div>
      </div>
    `;
        parent.appendChild(element);

        // Add click event listener to the remove button
        const removeButton = element.querySelector('.remove-button');
        removeButton.addEventListener('click', (event) => {
            // Remove the clicked movie card element from the DOM
            removeMovieCard(event, movies, parent);

            // Repopulate the rest of the movie cards
            parent.innerHTML = '';
            const remainingMovies = movies.filter(m => m.id !== movie.id);
            renderCarouselCards(remainingMovies, parent);
        });
    });
};

//render smaller movie cards.
export const renderMovieCards = async (parent) => {
    let movies = await getLocalMovies();
    console.log("LOCAL MOVIES ARRAY")
    console.log(movies);
    movies.forEach(movie => {
        const element = document.createElement("div");
        element.innerHTML = `
             <div class="movie-card movieStuff">
            <div class="movie-poster-compact">
              <img src="${movie.image}" alt="${movie.title} movie poster">
            </div>
            <h3>${movie.title}</h3>
            <div class="description-scroller">
              <p>${movie.description}</p>
            </div>
            <div class="rating-bar">
              <p>Rating: ${movie.rating}</p>
            </div>
            <div>
            <p>Genre: ${movie.genre}</p>
            </div>
            <div class="display-flex justify-center">
              <button class="movie-card-delete-btn">Delete</button>
            </div>
          </div>
        `;
        parent.appendChild(element);
    });
}
// // remove carousel movie from DOM and
// function removeMovieCard(event) {
//     const element = event.currentTarget.parentNode.parentNode.parentNode;
//     element.remove();
//     let nextMovieParent = element.nextSibling;
//     // Add the 'active' class to the next movie card's parent
//     nextMovieParent.classList.add('active');
// }

//create new favorite movie and save to database using "POST" method
export const newUserMovie = async (event)=> {
    event.preventDefault();
    // target all other siblings using parent node
    let childrenForm = event.target.parentNode.children;

    let userMovieTitle = document.querySelector('#movie-title-input');
    let userMovieRating = document.querySelector('#rating-input');
    let userMovieGenre = document.querySelector('#genre-input');
    let userMovieDescription = document.querySelector('#description-input');

    let userMovie = {
        title: userMovieTitle.value,
        genre: userMovieGenre.value,
        rating: userMovieRating.value,
        description: userMovieDescription.value,
        image: 'images/img.png',
    }
    await setFavorite(userMovie);
    //reset form fields with empty strings after submission
    for (let i =0; i<childrenForm.length; i++){
        childrenForm[i].value = "";
    }
    location.reload();
};

//delete favorite movie from database using "DELETE" method
export const userDeleteSubmit = async (event) => {
    event.preventDefault();
    // target all other siblings using parent node
    let childrenForm = event.target.parentNode.children;
    //reset form fields with empty strings after submission
    let id = document.querySelector('#delete-by-id').value;
    const confirmDelete = () => confirm(`Are you sure you want to delete this movie? This action CANNOT be undone.`);
    if (confirmDelete() === true) {
        let deletedMovie = await deleteFavorite(id);
        console.log(`Movie with ID ${id} deleted:`, deletedMovie);
    }
    for (let i = 0; i < childrenForm.length; i++) {
        childrenForm[i].value = "";
    }
    location.reload();
};

// user edited movie submission sent using 'PATCH' method
export const userPatchSubmit = async (event) => {
    //prevent default submission
    event.preventDefault();
    // target all other siblings using parent node
    let childrenForm = event.target.parentNode.children;
    // target ID patch input
    let userPatchId = document.querySelector('#patch-id');
    // target patch title input
    let userPatchTitle = document.querySelector('#patch-title');
    // target user rating input
    let userPatchRating = document.querySelector('#patch-rating');
    // target user genre input
    let userPatchGenre = document.querySelector('#patch-genre');
    // target user description input
    let userPatchDescription = document.querySelector('#patch-description');
    // get the favorite movie object by ID
    let movieToUpdate = await getFavorite(userPatchId.value);
    //update the favorite movie depending on the user entered fields, use current info if empty
    let update = {
        title: userPatchTitle.value ? userPatchTitle.value : movieToUpdate.title,
        genre: userPatchGenre.value ? userPatchGenre.value : movieToUpdate.genre,
        rating: userPatchRating.value ? userPatchRating.value: movieToUpdate.rating,
        description: userPatchDescription.value ? userPatchDescription.value: movieToUpdate.description
    }
    //patch request sent to database
    await patchFavorite(userPatchId.value,update);
    //reset form fields with empty strings after submission
    for (let i =0; i<childrenForm.length; i++){
        childrenForm[i].value = "";
    }
    location.reload();
};

//CAROUSEL FUNCTIONALITY
let arrows = document.querySelectorAll('.arrow');
// carousel forEach
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


    //MODAL POP UP FUNCTIONALITY
    // target the modal
    let modal = document.querySelector("#myModal");
    // target modal button
    let btn = document.querySelector("#myBtn");
    // target span that closes the modal
    let span = document.querySelector(".close");
    // display modal on click
    btn.onclick = function() {
        modal.style.display = "block";
    }
    // when X is clicked, close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // click anywhere outside of modal close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //MODAL FUNCTIONALITY END

});