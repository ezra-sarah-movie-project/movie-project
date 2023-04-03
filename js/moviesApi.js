import {keys} from './keys.js'

export const getMovies =async()=>{
    try{
        let response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${keys.MOVIES_APPID}`)
        let data = await response.json();
        return data;
    }catch(error){
        console.log(error);
    }
}