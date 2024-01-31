// api.js
const api = (function() {
    const API_KEY = "75255e19"; // Replace with your actual OMDB API key
    const API_URL = "https://www.omdbapi.com/?apikey=" + API_KEY;

    function searchMovies(query) {
        return fetch(`${API_URL}&s=${encodeURIComponent(query)}`)
            .then(response => response.json());
    }

    function fetchMovieDetails(movieId) {
        return fetch(`${API_URL}&i=${encodeURIComponent(movieId)}`)
            .then(response => response.json());
    }

    return {
        searchMovies,
        fetchMovieDetails
    };
})();
