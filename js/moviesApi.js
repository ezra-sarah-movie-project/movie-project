import {keys} from './keys.js'

export const getMovies = async()=>{
    try{
        let response = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=${keys.MOVIES_APPID}`)
        let data = await response.json();
        return data;
    }catch(error){
        console.log(error);
    }
}