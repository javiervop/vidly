import { apiUrl } from "../config.json";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const apiEndpoint =
  (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : apiUrl) +
  "/genres";

export async function getGenres() {
  let genres = [{ _id: "", name: "All Genres" }];
  await axios.get(apiEndpoint, { headers }).then((res) => {
    genres = [{ _id: "", name: "All Genres" }, ...res["data"]];
  });
  return genres;
}

export async function getGenre(id) {
  let genre = {};
  await axios.get(apiEndpoint + "/" + id, { headers }).then((res) => {
    genre = res["data"];
  });
  return genre ? genre : {};
}
