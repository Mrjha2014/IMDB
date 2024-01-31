document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("searchBox");
  const searchResults = document.getElementById("searchResults");
  const favoritesList = document.getElementById("favoritesList");

  // Initialize event listeners and functionalities
  if (searchBox) {
    initializeSearch();
  }

  if (favoritesList) {
    displayFavorites();
  }

  const movieId = getMovieIdFromURL();
  if (movieId) {
    displayMovieDetails(movieId);
  }

  // Function for initializing search functionality
  function initializeSearch() {
    searchBox.addEventListener("input", function () {
      const query = searchBox.value.trim();
      if (query) {
        api.searchMovies(query).then((data) => {
          if (data.Response === "True") {
            displaySearchResults(data.Search);
          } else {
            searchResults.innerHTML =
              '<p class="text-center">No movies found.</p>';
          }
        });
      } else {
        searchResults.innerHTML = ""; // Clear search results if query is emptied
      }
    });
  }

  function displaySearchResults(movies) {
    searchResults.innerHTML = ""; // Clear previous results
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-card", "mb-3", "col-3"); // Use Bootstrap's grid
      movieElement.innerHTML = `
            <div class="card "> 
                <a href="movie.html?id=${movie.imdbID}" class="text-decoration-none text-dark"> <!-- Remove underline and inherit text color -->
                    <img src="${movie.Poster}" alt="${movie.Title}" class="card-img-top"> <!-- Bootstrap's card image class -->
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                    </div>
                </a>
                <div class="card-footer bg-transparent border-top-0"> 
                    <button class="btn btn-primary add-favorite w-100" data-movieid="${movie.imdbID}">Add to Favorites</button>
                </div>
            </div>
        `;
      searchResults.appendChild(movieElement);
    });
    attachAddToFavoritesEventListeners();
  }

  function attachAddToFavoritesEventListeners() {
    const buttons = document.querySelectorAll(".add-favorite");
    buttons.forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const movieId = this.getAttribute("data-movieid");
        storage.addFavorite(movieId);
        this.innerText = "Added";
        this.disabled = true;
        displayFavorites(); // Update the favorites list immediately
      });
    });
  }

  function displayFavorites() {
    const favorites = storage.getFavorites();
    if (!favoritesList) {
      // Element not found, exit the function
      return;
    }
    favoritesList.innerHTML = ""; // Clear current list

    // Fetch details for all favorites and then process them
    const fetchPromises = favorites.map((movieId) =>
      api.fetchMovieDetails(movieId)
    );

    Promise.all(fetchPromises).then((movies) => {
      movies.forEach((movie) => {
        if (movie.Response === "True") {
          const movieElement = document.createElement("div");
          movieElement.classList.add("movie-card", "mb-3","col-3");
          movieElement.innerHTML = `
           <div class="card "> 
                <a href="movie.html?id=${movie.imdbID}" class="text-decoration-none text-dark"> <!-- Remove underline and inherit text color -->
                    <img src="${movie.Poster}" alt="${movie.Title}" class="card-img-top"> <!-- Bootstrap's card image class -->
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                    </div>
                </a>
                <div class="card-footer bg-transparent border-top-0">
              <button class="btn btn-danger remove-favorite" data-movieid="${movie.imdbID}">Remove from Favorites</button>
            </div>
          </div>
        `;
          favoritesList.appendChild(movieElement);
        }
      });
      // Attach event listeners after all favorites have been processed and added to the DOM
      attachRemoveFromFavoritesEventListeners();
    });
  }

  function attachRemoveFromFavoritesEventListeners() {
    const buttons = document.querySelectorAll(".remove-favorite");
    buttons.forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();

        const movieId = this.getAttribute("data-movieid");
        storage.removeFavorite(movieId);
        displayFavorites(); // Refresh the favorites list immediately
      });
    });
  }

  function getMovieIdFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("id");
  }
  function displayMovieDetails(movieId) {
    api
      .fetchMovieDetails(movieId)
      .then((movie) => {
        if (movie.Response === "True") {
          const movieDetailsElement = document.getElementById("movieDetails");
          movieDetailsElement.innerHTML = `
                <div class="container mt-4">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${movie.Poster}" alt="${movie.Title}" class="img-fluid">
                        </div>
                        <div class="col-md-8">
                            <h2>${movie.Title}</h2>
                            <p><strong>Year:</strong> ${movie.Year}</p>
                            <p><strong>Rated:</strong> ${movie.Rated}</p>
                            <p><strong>Released:</strong> ${movie.Released}</p>
                            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                            <p><strong>Genre:</strong> ${movie.Genre}</p>
                            <p><strong>Director:</strong> ${movie.Director}</p>
                            <p><strong>Writer:</strong> ${movie.Writer}</p>
                            <p><strong>Actors:</strong> ${movie.Actors}</p>
                            <p><strong>Plot:</strong> ${movie.Plot}</p>
                            <p><strong>Language:</strong> ${movie.Language}</p>
                            <p><strong>Country:</strong> ${movie.Country}</p>
                            <p><strong>Awards:</strong> ${movie.Awards}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
          document.getElementById("movieDetails").innerHTML =
            "Movie details not found.";
        }
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        document.getElementById("movieDetails").innerHTML =
          "Error loading movie details.";
      });
  }
});
