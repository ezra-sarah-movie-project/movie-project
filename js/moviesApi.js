import {keys} from './keys.js'
import {getLocalMovies, setMovies} from './db-interaction.js'

export const getMovies = async () => {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${keys.MOVIES_APPID}`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getGenres = async () => {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${keys.MOVIES_APPID}&language=en-US`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const storeMovies = async (results) => {
    let newMovie;
    for (let i = 0; i < results.length; i++) {
        newMovie = {
            title: results[i].original_title,
            genre: getMovieGenre(results[i]),
            rating: results[i].vote_average,
            image: `https://image.tmdb.org/t/p/original/${results[i].poster_path}`,
            description: results[i].overview,
        };
        const movies = await getLocalMovies(); // get all movies from the JSON file
        const isDuplicate = movies.some((movie) => {
            return movie.title === newMovie.title; // check if the new movie already exists in the file
        });
        if (!isDuplicate) {
            await setMovies(newMovie); // save the new movie to the file
        }
    }
};


const getMovieGenre = (movie)=>{
    const genreArray =[
        {id: 28, name: 'Action'},
        {id: 12, name: 'Adventure'},
        {id: 16, name: 'Animation'},
        {id: 35, name: 'Comedy'},
        {id: 80, name: 'Crime'},
        {id: 99, name: 'Documentary'},
        {id: 18, name: 'Drama'},
        {id: 10751, name: 'Family'},
        {id: 14, name: 'Fantasy'},
        {id: 36, name: 'History'},
        {id: 27, name: 'Horror'},
        {id: 10402, name: 'Music'},
        {id: 9648, name: 'Mystery'},
        {id: 10749, name: 'Romance'},
        {id: 878, name: 'Science Fiction'},
        {id: 10770, name: 'TV Movie'},
        {id: 53, name: 'Thriller'},
        {id: 10752, name: 'War'},
        {id: 37, name: 'Western'},
    ];

    for (let i = 0; i < genreArray.length; i++) {
        if (movie.genre_ids[0] === genreArray[i].id) {
            return genreArray[i].name;
        }
    }
    return "unknown";
};
