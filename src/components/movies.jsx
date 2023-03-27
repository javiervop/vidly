import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./common/searchBox";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    // const headers = {
    //   "Content-Type": "application/json",
    // };
    // await axios
    //  .get("http://127.0.0.1:8080/api/genres", { headers })
    //  .then((res) => {
    //    const genres = [{ _id: "", name: "All Genres" }, ...res["data"]];
    //    this.setState({ genres });
    //  });
    // const genres = getGenres();
    // console.log(genres);
    await getGenres().then((genres) => {
      this.setState({ genres });
    });
    // const genres = [{ _id: "", name: "All Genres" }, ...resp["data"]];

    await getMovies().then((movies) => {
      this.setState({ movies });
    });
    // console.log(movies);
    // this.setState({ movies });

    // await axios
    //  .get("http://127.0.0.1:8080/api/movies", { headers })
    //  .then((res) => {
    //    this.setState({ movies: res["data"] });
    //  });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
      // await axios
      //  .delete("http://127.0.0.1:8080/api/movies/" + movie._id)
      //  .then((res) => {
      //
      //  });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");
      else {
        console.log("Logging the error:", ex);
        alert("An unexpected error occurred while deleting a post!");
      }
      this.setState({ movies: originalMovies });
    }
  };

  handleInsert = (movie) => {
    let movies = [...this.state.movies];
    movies.push(movie);
    this.setState({ movies });
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies,
    } = this.state;

    let filteredMovies = allMovies;
    if (searchQuery)
      filteredMovies = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filteredMovies = allMovies.filter(
        (m) => m.genre._id === selectedGenre._id
      );

    const sortedMovies = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );
    const movies = paginate(sortedMovies, currentPage, pageSize);

    return { totalCount: filteredMovies.length, data: movies };
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: null,
      currentPage: 1,
    });
  };

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0)
      return (
        <div>
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ margingButtom: 20 }}
          >
            New Movie
          </Link>

          <p>There are no movies in the database.</p>
        </div>
      );

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ margingButtom: 20 }}
          >
            New Movie
          </Link>
          <p>There are {totalCount} movies in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            user={user}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
