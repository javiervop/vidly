import http from "./httpService";
import { apiUrl } from "../config.json";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export async function getGenres() {
  /*
  await axios.get(apiUrl + "/genres", { headers }).then((res) => {
    const genres = [{ _id: "", name: "All Genres" }, ...res["data"]];
    console.log(genres);
    return genres;
  });
  */
  let genres = [{ _id: "", name: "All Genres" }];
  await axios.get(apiUrl + "/genres", { headers }).then((res) => {
    genres = [{ _id: "", name: "All Genres" }, ...res["data"]];
  });
  return genres;
}

export async function getGenre(id) {
  let genre = {};
  await axios.get(apiUrl + "/genres/" + id, { headers }).then((res) => {
    genre = res["data"];
  });
  return genre ? genre : {};
}
