document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = "75255e19";
    const API_URL = 'https://www.omdbapi.com/?apikey=' + API_KEY;
    const movieDetails = document.getElementById('movieDetails');

    // Function to extract IMDb ID from URL
    function getMovieIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Function to fetch and display movie details
    function displayMovieDetails(movieId) {
        fetch(`${API_URL}&i=${movieId}`)
            .then(response => response.json())
            .then(movie => {
                if (movie.Response === "True") {
                    movieDetails.innerHTML = `
                        <div class="card mb-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="${movie.Poster}" alt="${movie.Title}" class="img-fluid rounded-start">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${movie.Title}</h5>
                                        <p class="card-text"><strong>Genre:</strong> ${movie.Genre}</p>
                                        <p class="card-text"><strong>Released:</strong> ${movie.Released}</p>
                                        <p class="card-text"><strong>Rated:</strong> ${movie.Rated}</p>
                                        <p class="card-text"><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
                                        <p class="card-text"><strong>Director:</strong> ${movie.Director}</p>
                                        <p class="card-text"><strong>Writer:</strong> ${movie.Writer}</p>
                                        <p class="card-text"><strong>Actors:</strong> ${movie.Actors}</p>
                                        <p class="card-text"><strong>Plot:</strong> ${movie.Plot}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    movieDetails.innerHTML = '<p class="text-center">Movie details not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                movieDetails.innerHTML = '<p class="text-center">Error loading movie details.</p>';
            });
    }

    // Fetch and display movie details
    const movieId = getMovieIdFromURL();
    if (movieId) {
        displayMovieDetails(movieId);
    } else {
        movieDetails.innerHTML = '<p class="text-center">No movie ID provided.</p>';
    }
});
