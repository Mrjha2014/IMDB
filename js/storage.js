// In storage.js
const storage = (function() {
    const FAVORITES_KEY = 'favorites';

    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    }

    function addFavorite(movieId) {
        let favorites = getFavorites();
        if (!favorites.includes(movieId)) {
            favorites.push(movieId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    }

    function removeFavorite(movieId) {
        let favorites = getFavorites();
        favorites = favorites.filter(id => id !== movieId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    return {
        getFavorites,
        addFavorite,
        removeFavorite
    };
})();
