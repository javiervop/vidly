import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: 0,
      dailyRentalRate: 0,
    },
    genres: [],
    errors: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    movieId: "",
  };

  schema = {
    title: Joi.string().required().label("Tile"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .label("Number in Stock")
      .required(),
    dailyRentalRate: Joi.number().min(0).max(10).label("Rate").required(),
  };

  async populateGenres() {
    const genres = await getGenres();
    this.setState({ genres });
  }

  async populateMovies() {
    try {
      // console.log(this.props.match.params);
      const movieId = this.props.match.params._id;
      this.setState({ movieId: movieId });
      if (movieId === "new") return;

      const movie = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/no-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovies();
  }

  mapToViewModel(movie) {
    return {
      // _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  doSubmit = async (history) => {
    // console.log("doSubmit", this.state);
    await saveMovie(this.state.data, this.state.movieId);
    this.props.history.push("/movies");
  };

  render() {
    const { match } = this.props;
    // console.log(this.state.genres);

    return (
      <div>
        <h1>Movie {match.params._id} </h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title", "Moview Title is required.")}
          {this.renderSelect(
            "genreId",
            "Genre",
            "Genre is required.",
            this.state.genres
          )}
          {this.renderInput(
            "numberInStock",
            "Number In Stock",
            "Invalid value."
          )}
          {this.renderInput("dailyRentalRate", "Rate", "Invalid value.")}
          {this.renderBotton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
