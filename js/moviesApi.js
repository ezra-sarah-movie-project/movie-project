import {keys} from './keys.js'
export const movieListContainer = document.getElementById("movie-compact-list");

export const getMovies = async () => {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${keys.MOVIES_APPID}`);
        let data = await response.json();
        const movies = data.results.slice(0, 10).map((movie) => {
            return {
                title: movie.title,
                rating: movie.vote_average,
                description: movie.overview,
                banner: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
            };
        });
        return movies;
    } catch (error) {
        console.log(error);
    }
};

const displayMovies = async () => {
    const movies = await getMovies();
    movies.forEach((movie, index) => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movieStuff");
        movieContainer.id = `movieData${index + 1}`;
        const banner = document.createElement("img");
        banner.src = movie.banner;
        banner.classList.add("movieBanner");
        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = movie.title;
        const rating = document.createElement("div");
        rating.classList.add("Review");
        rating.textContent = `Rating: ${movie.rating}`;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.height = '20px';
        deleteButton.addEventListener("click", () => {
            movieContainer.remove();
        });

        movieContainer.appendChild(banner);
        movieContainer.appendChild(title);
        movieContainer.appendChild(rating);
        movieContainer.appendChild(deleteButton);

        movieListContainer.appendChild(movieContainer);
    });
};


await displayMovies();
