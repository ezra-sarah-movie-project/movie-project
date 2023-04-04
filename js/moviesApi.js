import {keys} from './keys.js'

export const getMovies = async()=>{
    try{
        let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${keys.MOVIES_APPID}`)
        let data = await response.json();
        // console.log(getMovies.data[0].title);
        return data;

    }catch(error){
        console.log(error);
    }
}
