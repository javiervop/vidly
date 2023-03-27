// import * as genresAPI from "./genreService";
import { getGenre } from "./genreService";
import { apiUrl } from "../config.json";
import axios from "axios";

const movies = [];
const apiEndpoint =
  (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : apiUrl) +
  "/movies";
const headers = {
  "Content-Type": "application/json",
};

function MovieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getMovies() {
  let movies = {};
  await axios.get(apiEndpoint, { headers }).then((res) => {
    movies = res["data"];
  });
  return movies;
}

export async function getMovie(id) {
  let movie = {};
  await axios.get(MovieUrl(id), { headers }).then((res) => {
    movie = res["data"];
  });
  return movie ? movie : {};
}

export async function saveMovie(movie, movieId) {
  // let movieInDb = movies.find((m) => m._id === movie._id) || {};
  let movieInDb = movie;
  if (movieId === "new") {
  } else {
    await getMovie(movieId).then((mv) => {
      movieInDb = mv;
    });
  }
  // console.log("movieInDb", movieInDb, movieId);
  movieInDb.title = movie.title;
  await getGenre(movie.genreId).then((genre) => {
    movieInDb.genre = genre;
  });
  // const genres = getGenres();
  // console.log(genres);
  // movieInDb.genre = genres[data].find((g) => g._id === movie.genreId);
  movieInDb.numberInStock = movie.numberInStock;
  movieInDb.dailyRentalRate = movie.dailyRentalRate;
  if (!movieInDb["_id"]) {
    // delete movieInDb["_id"];
    // console.log("newMovie", movieInDb);
    await axios.post(apiEndpoint, movieInDb, { headers }).then((res) => {
      movieInDb = res["data"];
    });
    // const movieInDb = http.post(apiEndpoint, movie);
    // movieInDb._id = Date.now().toString();
    movies.push(movieInDb);
  } else {
    delete movieInDb["_id"];
    await axios.put(MovieUrl(movieId), movieInDb, { headers }).then((res) => {
      movieInDb = res["data"];
    });
  }
  return movieInDb;
}

export async function deleteMovie(id) {
  let restdel = {};
  await axios.delete(MovieUrl(id)).then((res) => {
    restdel = res;
  });
  return restdel;
  // let movieInDb = movies.find((m) => m._id === id);
  // movies.splice(movies.indexOf(movieInDb), 1);
  // return movieInDb;
}
