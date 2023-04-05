
window.addEventListener('load',()=>{
    const loader = document.querySelector('.loading');
    loader.classList.add('loading-hidden');
    loader.addEventListener('transitioned', ()=>{
        document.body.removeChild("loading");
    });
})

export const getFavorites = async () => {
    try {
        let url = `http://localhost:3000/favorites`;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

export const getFavorite = async (id) => {
    try {
        let url = `http://localhost:3000/favorites/${id}`;
        let options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

export const searchFavorite = async (movie) => {
    let favorites = await getFavorites();
    if (movie.title) {
        let favorite = favorites.find((result) => {
            return movie.title === result.title;
        });
        if (favorite) {
            return favorite;
        } else {
            return 'No movie was found with that title';
        }
    } else if(movie.genre) {
        let favoritesFiltered = favorites.filter((result) => {
            return movie.genre === result.genre;
        });
        if (favoritesFiltered.length > 0) {
            return favoritesFiltered;
        } else {
            return 'No movies were found with that genre';
        }
    }
}

export const setFavorite = async (movie) => {
    try {
        let url = `http://localhost:3000/favorites`;
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

export const patchFavorite = async (id, movie) => {
    try {
        if (!id) {
            throw new Error('You must provide an id');
        }
        let url = `http://localhost:3000/favorites/${id}`;
        let options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}
// delete database object by id
export const deleteFavorite = async (id) => {
    try {
        if (!id) {
            throw new Error('You must provide an id');
        }
        let url = `http://localhost:3000/favorites/${id}`;
        let options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

// render favorite movies in carousel
export const renderMovieCards = (movie, parent) => {
    movie.forEach(movie => {
        const element = document.createElement('div');
        if (movie.id === 1) {
            element.classList.add('slide','active');
        } else {
            element.classList.add('slide','right');
        }
        element.innerHTML = `
            <div  class="column shrink movie-container">
                <div class="column shrink movie-container-left">
                  <div class="column shrink align-center">
                    <img src=${movie.image} alt="" class="movie-poster">
                  </div>
                </div>
                <div class="column shrink movie-container-right">
                  <h2>${movie.title}</h2>
                  <p>---star rating---</p>
                  <p>${movie.description}</p>
                  <div class="movie-container-buttons">
                  </div>
                  <button type="button">Watch Trailer</button>
                </div>
            </div>
        `;
        element.querySelector('button').addEventListener('click', function () {
            element.remove();
        });
        parent.appendChild(element);
    })
}

//create new favorite movie and save to database using "POST" method
export const newUserMovie = async (event)=> {
    event.preventDefault();
    let userMovieTitle = document.querySelector('#movie-title-input');
    let userMovieRating = document.querySelector('#rating-input');
    let userMovieGenre = document.querySelector('#genre-input');
    let userMovieDescription = document.querySelector('#description-input');

    let userMovie = {
        title: userMovieTitle.value,
        genre: userMovieGenre.value,
        rating: userMovieRating.value,
        description: userMovieDescription.value,
    }
    await setFavorite(userMovie);
}
//delete favorite movie from database using "DELETE" method
export const userDeleteSubmit = async (event) => {
    event.preventDefault();
    let id = document.querySelector('#delete-by-id').value;
    let deletedMovie = await deleteFavorite(id);
    console.log(`Movie with ID ${id} deleted:`, deletedMovie);
}

// user edited movie submission sent using 'PATCH' method
export const userPatchSubmit = async (event) => {
    //prevent default submission
    event.preventDefault();
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
}

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
    let modal = document.getElementById("myModal");
    // target modal button
    let btn = document.getElementById("myBtn");
    // target span that closes the modal
    let span = document.getElementsByClassName("close")[0];
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