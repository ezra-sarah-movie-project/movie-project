let MOVIE_API = '06c433449ce8de51aea9744d39596d5f'

export const movieListContainer = document.getElementById("movie-compact-list");

export const getMovies = async () => {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API}`);
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

        movieContainer.appendChild(banner);
        movieContainer.appendChild(title);
        movieContainer.appendChild(rating);

        movieListContainer.appendChild(movieContainer);
    });
};

displayMovies();
