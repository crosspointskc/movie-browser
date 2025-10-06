// Movie Browser App JavaScript
class MovieBrowser {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.tmdbApiKey = window.TMDB_API_KEY || 'abfe4d2f4da0c7ad40bfbc61fcec05a2';
        this.tmdbReadToken = window.TMDB_READ_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYmZlNGQyZjRkYTBjN2FkNDBiZmJjNjFmY2VjMDVhMiIsIm5iZiI6MTc1OTI4OTAwMi4yOSwic3ViIjoiNjhkYzllYWFiZDY2MjAwZmZkMzhjZjUxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.1tRMcEy_hWof8W_si_5MLCx5tFs-VqYuAsUtsjA0GEs';
        this.tmdbBaseUrl = 'https://api.themoviedb.org/3';
        this.tmdbImageUrl = 'https://image.tmdb.org/t/p/w500';
        
        console.log('MovieBrowser initialized with TMDB credentials:', {
            hasApiKey: !!this.tmdbApiKey,
            hasReadToken: !!this.tmdbReadToken
        });
        
        this.init();
    }

    async init() {
        console.log('Initializing MovieBrowser...');
        
        await this.loadMoviesFromCSV();
        console.log(`After loadMoviesFromCSV: ${this.movies.length} movies loaded`);
        
        if (this.movies.length === 0) {
            console.error('No movies loaded! Using sample data.');
            this.movies = this.getSampleMovies();
        }
        
        this.populateFilters();
        
        // Make sure all movies are visible initially
        this.filteredMovies = [...this.movies];
        console.log(`Initialized with ${this.movies.length} movies, displaying ${this.filteredMovies.length}`);
        
        this.displayMovies();
        
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
    }

    async loadMoviesFromCSV() {
        try {
            // Check for embedded movie data (should be available immediately)
            if (!window.MOVIE_DATA || window.MOVIE_DATA.length === 0) {
                console.error('No embedded movie data found!');
                this.movies = this.getSampleMovies();
                this.filteredMovies = [...this.movies];
                return;
            }

            console.log(`Loading ${window.MOVIE_DATA.length} movies from embedded data...`);

            this.movies = window.MOVIE_DATA.map((movie, index) => ({
                id: index + 1,
                title: movie.title,
                year: movie.year,
                quality: movie.quality || '',
                genre: movie.genre || 'Unknown',
                poster: null,
                overview: '',
                tmdbId: null,
                runtime: null,
                rating: null,
                watched: this.watchHistory.includes(index + 1),
                favorite: this.favorites.includes(index + 1)
            }));

            console.log(`Successfully loaded ${this.movies.length} movies from embedded data`);
        } catch (error) {
            console.error('Error loading movies:', error);
            this.movies = this.getSampleMovies();
        }

        this.filteredMovies = [...this.movies];
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const movies = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 4 && values[0].trim()) {
                movies.push({
                    id: i,
                    title: values[0].trim(),
                    year: values[1] ? parseInt(values[1].trim()) : null,
                    quality: values[2] ? values[2].trim() : '',
                    genre: values[3] ? values[3].trim() : 'Unknown',
                    poster: null,
                    overview: '',
                    tmdbId: null,
                    runtime: null,
                    rating: null,
                    watched: this.watchHistory.includes(i),
                    favorite: this.favorites.includes(i)
                });
            }
        }

        return movies;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    getSampleMovies() {
        // Fallback sample data for testing
        return [
            { id: 1, title: "The Shawshank Redemption", year: 1994, quality: "", genre: "Drama", poster: null, overview: "", tmdbId: null, runtime: null, rating: null, watched: false, favorite: false },
            { id: 2, title: "The Godfather", year: 1972, quality: "", genre: "Crime", poster: null, overview: "", tmdbId: null, runtime: null, rating: null, watched: false, favorite: false },
            { id: 3, title: "Pulp Fiction", year: 1994, quality: "", genre: "Crime", poster: null, overview: "", tmdbId: null, runtime: null, rating: null, watched: false, favorite: false }
        ];
    }

    populateFilters() {
        const genres = [...new Set(this.movies.map(movie => movie.genre))].sort();
        const years = [...new Set(this.movies.map(movie => movie.year).filter(year => year))].sort((a, b) => b - a);

        const genreFilter = document.getElementById('genreFilter');
        const yearFilter = document.getElementById('yearFilter');

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    displayMovies() {
        const grid = document.getElementById('moviesGrid');
        if (!grid) {
            console.error('CRITICAL: moviesGrid element not found!');
            return;
        }

        console.log(`Displaying ${this.filteredMovies.length} movies...`);
        grid.innerHTML = '';

        this.filteredMovies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            grid.appendChild(movieCard);
        });

        console.log(`✅ Successfully displayed ${this.filteredMovies.length} movie cards`);

        // Load posters for visible movies automatically
        setTimeout(() => {
            this.loadPostersForVisibleMovies();
        }, 500);
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => this.showMovieDetail(movie);

        card.innerHTML = `
            <div class="movie-poster" id="poster-${movie.id}">
                🎬
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.year || 'Unknown'}</span>
                    <span>${movie.quality || ''}</span>
                </div>
                <div class="movie-genre">${movie.genre}</div>
            </div>
        `;

        return card;
    }

    async loadPostersForVisibleMovies() {
        // Force refresh credentials from global window
        this.tmdbApiKey = window.TMDB_API_KEY || this.tmdbApiKey;
        this.tmdbReadToken = window.TMDB_READ_TOKEN || this.tmdbReadToken;

        console.log('Checking API credentials:', {
            hasApiKey: !!this.tmdbApiKey,
            hasReadToken: !!this.tmdbReadToken,
            apiKey: this.tmdbApiKey ? this.tmdbApiKey.substring(0, 8) + '...' : 'none',
            readToken: this.tmdbReadToken ? 'present' : 'none',
            windowApiKey: !!window.TMDB_API_KEY,
            windowReadToken: !!window.TMDB_READ_TOKEN
        });

        if (!this.tmdbApiKey && !this.tmdbReadToken) {
            console.log('TMDB API key not set. Using placeholder posters.');
            return;
        }

        console.log('Loading posters for visible movies...');

        // Load posters for first 20 visible movies to avoid API rate limits
        const visibleMovies = this.filteredMovies.slice(0, 20);

        for (const movie of visibleMovies) {
            if (!movie.poster && !movie.tmdbId) {
                console.log(`Fetching data for: ${movie.title}`);
                await this.fetchMovieDataFromTMDB(movie);
                // Add small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 250));
            }
            this.updateMoviePoster(movie);
        }
    }

    async fetchMovieDataFromTMDB(movie) {
        if (!this.tmdbApiKey && !this.tmdbReadToken) return;

        console.log(`Fetching TMDB data for: ${movie.title} (${movie.year})`);

        try {
            let searchUrl, headers = {};

            if (this.tmdbReadToken) {
                // Use Bearer token (v4 API style)
                searchUrl = `${this.tmdbBaseUrl}/search/movie?query=${encodeURIComponent(movie.title)}&year=${movie.year || ''}`;
                headers = {
                    'Authorization': `Bearer ${this.tmdbReadToken}`,
                    'accept': 'application/json'
                };
            } else {
                // Use API key (v3 API style)
                searchUrl = `${this.tmdbBaseUrl}/search/movie?api_key=${this.tmdbApiKey}&query=${encodeURIComponent(movie.title)}&year=${movie.year || ''}`;
            }

            const response = await fetch(searchUrl, { headers });

            if (!response.ok) {
                console.error(`TMDB API error: ${response.status} ${response.statusText}`);
                return;
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const tmdbMovie = data.results[0];
                movie.tmdbId = tmdbMovie.id;
                movie.poster = tmdbMovie.poster_path ? `${this.tmdbImageUrl}${tmdbMovie.poster_path}` : null;
                movie.overview = tmdbMovie.overview;
                movie.rating = tmdbMovie.vote_average;

                // Get additional details
                try {
                    let detailUrl;
                    if (this.tmdbReadToken) {
                        detailUrl = `${this.tmdbBaseUrl}/movie/${tmdbMovie.id}`;
                    } else {
                        detailUrl = `${this.tmdbBaseUrl}/movie/${tmdbMovie.id}?api_key=${this.tmdbApiKey}`;
                    }
                    const detailResponse = await fetch(detailUrl, { headers });
                    if (detailResponse.ok) {
                        const detailData = await detailResponse.json();
                        movie.runtime = detailData.runtime;
                    }
                } catch (detailError) {
                    console.warn(`Could not fetch details for ${movie.title}:`, detailError);
                }

                // Update localStorage
                this.saveMoviesToStorage();

                console.log(`Successfully updated ${movie.title} with poster: ${movie.poster ? 'yes' : 'no'}`);
            } else {
                console.log(`No TMDB results found for: ${movie.title}`);
            }
        } catch (error) {
            console.error(`Error fetching TMDB data for ${movie.title}:`, error);
        }
    }

    updateMoviePoster(movie) {
        const posterElement = document.getElementById(`poster-${movie.id}`);
        if (posterElement && movie.poster) {
            posterElement.innerHTML = `<img src="${movie.poster}" alt="${movie.title}" loading="lazy">`;
        }
    }

    filterMovies() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const genreFilter = document.getElementById('genreFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;

        this.filteredMovies = this.movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
            const matchesGenre = !genreFilter || movie.genre === genreFilter;
            const matchesYear = !yearFilter || movie.year == yearFilter;

            return matchesSearch && matchesGenre && matchesYear;
        });

        this.displayMovies();
    }

    // Mood-based recommendation system
    recommendByMood(mood) {
        let recommendations = [];

        switch (mood) {
            case 'action':
                recommendations = this.movies.filter(movie => 
                    ['Action', 'Adventure', 'Thriller'].includes(movie.genre)
                );
                break;
            case 'relaxing':
                recommendations = this.movies.filter(movie => 
                    ['Comedy', 'Romance', 'Family', 'Musical'].includes(movie.genre)
                );
                break;
            case 'thoughtful':
                recommendations = this.movies.filter(movie => 
                    ['Drama', 'Biography', 'Historical'].includes(movie.genre)
                );
                break;
            case 'escapist':
                recommendations = this.movies.filter(movie => 
                    ['Sci-Fi', 'Fantasy', 'Animation'].includes(movie.genre)
                );
                break;
            case 'suspenseful':
                recommendations = this.movies.filter(movie => 
                    ['Thriller', 'Crime'].includes(movie.genre)
                );
                break;
            case 'classic':
                recommendations = this.movies.filter(movie => 
                    movie.year && movie.year < 1980
                );
                break;
            case 'short':
                recommendations = this.movies.filter(movie => 
                    movie.runtime && movie.runtime < 120
                );
                if (recommendations.length === 0) {
                    // Fallback: exclude TV series and documentaries
                    recommendations = this.movies.filter(movie => 
                        !['TV Series', 'Documentary'].includes(movie.genre)
                    );
                }
                break;
            case 'surprise':
                recommendations = [...this.movies];
                break;
        }

        // Filter out recently watched movies
        const recentlyWatched = this.getRecentlyWatched();
        recommendations = recommendations.filter(movie => 
            !recentlyWatched.includes(movie.id)
        );

        if (recommendations.length === 0) {
            recommendations = [...this.movies];
        }

        // Pick random recommendation
        const randomMovie = recommendations[Math.floor(Math.random() * recommendations.length)];
        
        this.closeMoodSelector();
        this.showMovieDetail(randomMovie, true);
    }

    getRecentlyWatched() {
        const recent = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
        return recent.slice(-10); // Last 10 watched movies
    }

    showMovieDetail(movie, isRecommendation = false) {
        const modal = document.getElementById('movieModal');
        const content = document.getElementById('movieDetailContent');

        const posterSrc = movie.poster || '';
        const posterElement = posterSrc ? 
            `<img src="${posterSrc}" alt="${movie.title}">` : 
            '🎬';

        content.innerHTML = `
            <div class="movie-detail-content">
                <div class="movie-detail-poster">
                    ${posterElement}
                </div>
                <div class="movie-detail-info">
                    <h2>${movie.title}</h2>
                    ${isRecommendation ? '<p style="color: #4ecdc4; font-weight: bold;">🎯 Recommended for your mood!</p>' : ''}
                    <div class="movie-detail-meta">
                        <span>📅 ${movie.year || 'Unknown'}</span>
                        <span>🎭 ${movie.genre}</span>
                        ${movie.quality ? `<span>📺 ${movie.quality}</span>` : ''}
                        ${movie.runtime ? `<span>⏱️ ${movie.runtime} min</span>` : ''}
                        ${movie.rating ? `<span>⭐ ${movie.rating.toFixed(1)}/10</span>` : ''}
                    </div>
                    <div class="movie-overview">
                        <p>${movie.overview || 'No description available.'}</p>
                    </div>
                    <div class="movie-actions">
                        <button onclick="movieBrowser.toggleWatched(${movie.id})" 
                                style="background: ${movie.watched ? '#ff6b6b' : '#4ecdc4'}; color: white; border: none; padding: 10px 20px; border-radius: 10px; margin-right: 10px; cursor: pointer;">
                            ${movie.watched ? '✓ Watched' : 'Mark as Watched'}
                        </button>
                        <button onclick="movieBrowser.toggleFavorite(${movie.id})" 
                                style="background: ${movie.favorite ? '#ff6b6b' : '#667eea'}; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;">
                            ${movie.favorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';

        // Fetch additional data if not available
        if (!movie.overview && this.tmdbApiKey) {
            this.fetchMovieDataFromTMDB(movie).then(() => {
                if (modal.style.display === 'block') {
                    this.showMovieDetail(movie, isRecommendation);
                }
            });
        }
    }

    toggleWatched(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            movie.watched = !movie.watched;
            
            if (movie.watched) {
                if (!this.watchHistory.includes(movieId)) {
                    this.watchHistory.push(movieId);
                }
                // Add to recently watched
                const recentlyWatched = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
                recentlyWatched.push(movieId);
                localStorage.setItem('recentlyWatched', JSON.stringify(recentlyWatched.slice(-20)));
            } else {
                this.watchHistory = this.watchHistory.filter(id => id !== movieId);
            }
            
            localStorage.setItem('watchHistory', JSON.stringify(this.watchHistory));
            this.saveMoviesToStorage();
            this.showMovieDetail(movie);
        }
    }

    toggleFavorite(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            movie.favorite = !movie.favorite;
            
            if (movie.favorite) {
                if (!this.favorites.includes(movieId)) {
                    this.favorites.push(movieId);
                }
            } else {
                this.favorites = this.favorites.filter(id => id !== movieId);
            }
            
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.saveMoviesToStorage();
            this.showMovieDetail(movie);
        }
    }

    saveMoviesToStorage() {
        localStorage.setItem('movieCollection', JSON.stringify(this.movies));
    }

    // Add new movie functionality
    async searchTMDB() {
        const title = document.getElementById('movieTitle').value;
        const year = document.getElementById('movieYear').value;
        
        if (!title) {
            alert('Please enter a movie title');
            return;
        }

        if (!this.tmdbApiKey && !this.tmdbReadToken) {
            alert('TMDB API key not configured. Please add movie manually.');
            return;
        }

        try {
            let searchUrl, headers = {};
            
            if (this.tmdbReadToken) {
                searchUrl = `${this.tmdbBaseUrl}/search/movie?query=${encodeURIComponent(title)}&year=${year}`;
                headers = {
                    'Authorization': `Bearer ${this.tmdbReadToken}`,
                    'accept': 'application/json'
                };
            } else {
                searchUrl = `${this.tmdbBaseUrl}/search/movie?api_key=${this.tmdbApiKey}&query=${encodeURIComponent(title)}&year=${year}`;
            }
            
            const response = await fetch(searchUrl, { headers });
            const data = await response.json();

            this.displayTMDBResults(data.results || []);
        } catch (error) {
            console.error('Error searching TMDB:', error);
            alert('Error searching for movie. Please try again.');
        }
    }

    displayTMDBResults(results) {
        const resultsContainer = document.getElementById('tmdbResults');
        resultsContainer.innerHTML = '<h3>Search Results:</h3>';

        if (results.length === 0) {
            resultsContainer.innerHTML += '<p>No movies found. Try adjusting your search.</p>';
            return;
        }

        results.slice(0, 5).forEach(movie => {
            const resultDiv = document.createElement('div');
            resultDiv.style.cssText = 'border: 1px solid rgba(255,255,255,0.2); padding: 15px; margin: 10px 0; border-radius: 10px; cursor: pointer;';
            resultDiv.innerHTML = `
                <strong>${movie.title}</strong> (${movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'})
                <br><small>${movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description'}</small>
            `;
            resultDiv.onclick = () => this.addMovieFromTMDB(movie);
            resultsContainer.appendChild(resultDiv);
        });
    }

    addMovieFromTMDB(tmdbMovie) {
        const genre = document.getElementById('movieGenre').value || 'Unknown';
        const quality = document.getElementById('movieQuality').value || '';

        const newMovie = {
            id: Math.max(...this.movies.map(m => m.id), 0) + 1,
            title: tmdbMovie.title,
            year: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.split('-')[0]) : null,
            quality: quality,
            genre: genre,
            poster: tmdbMovie.poster_path ? `${this.tmdbImageUrl}${tmdbMovie.poster_path}` : null,
            overview: tmdbMovie.overview,
            tmdbId: tmdbMovie.id,
            runtime: null,
            rating: tmdbMovie.vote_average,
            watched: false,
            favorite: false
        };

        this.movies.push(newMovie);
        this.filteredMovies = [...this.movies];
        this.saveMoviesToStorage();
        this.populateFilters();
        this.displayMovies();
        this.closeAddMovie();

        alert(`"${newMovie.title}" has been added to your collection!`);
    }

    addMovieManually() {
        const title = document.getElementById('movieTitle').value;
        const year = document.getElementById('movieYear').value;
        const genre = document.getElementById('movieGenre').value;
        const quality = document.getElementById('movieQuality').value;

        if (!title) {
            alert('Please enter a movie title');
            return;
        }

        const newMovie = {
            id: Math.max(...this.movies.map(m => m.id), 0) + 1,
            title: title,
            year: year ? parseInt(year) : null,
            quality: quality || '',
            genre: genre || 'Unknown',
            poster: null,
            overview: '',
            tmdbId: null,
            runtime: null,
            rating: null,
            watched: false,
            favorite: false
        };

        this.movies.push(newMovie);
        this.filteredMovies = [...this.movies];
        this.saveMoviesToStorage();
        this.populateFilters();
        this.displayMovies();
        this.closeAddMovie();

        alert(`"${newMovie.title}" has been added to your collection!`);
    }
}

// Modal functions
function showMoodSelector() {
    document.getElementById('moodModal').style.display = 'block';
}

function closeMoodSelector() {
    document.getElementById('moodModal').style.display = 'none';
}

function showAddMovie() {
    document.getElementById('addMovieModal').style.display = 'block';
    // Clear form
    document.getElementById('movieTitle').value = '';
    document.getElementById('movieYear').value = '';
    document.getElementById('movieGenre').value = '';
    document.getElementById('movieQuality').value = '';
    document.getElementById('tmdbResults').innerHTML = '';
}

function closeAddMovie() {
    document.getElementById('addMovieModal').style.display = 'none';
}

function closeMovieDetail() {
    document.getElementById('movieModal').style.display = 'none';
}

function recommendByMood(mood) {
    movieBrowser.recommendByMood(mood);
}

function filterMovies() {
    movieBrowser.filterMovies();
}

function searchTMDB() {
    movieBrowser.searchTMDB();
}

function addMovieManually() {
    movieBrowser.addMovieManually();
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize the app
let movieBrowser;
document.addEventListener('DOMContentLoaded', () => {
    movieBrowser = new MovieBrowser();
    window.movieBrowser = movieBrowser; // Make globally accessible
    console.log('MovieBrowser initialized and made global');
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}