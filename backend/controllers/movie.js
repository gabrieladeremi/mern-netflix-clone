import { fetchMovies } from '../services/tmdb.service.js';

export const getTrendingMovie = async (req, res) => {
    try {
        const movies = await fetchMovies('https://api.themoviedb.org/3/trending/all/day?language=en-US');   

        const randomMovie = movies.results[Math.floor(Math.random() * movies.results?.length)];

        res.status(200).json({ success: true, content: randomMovie });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const movieTrailer = async (req, res) => { 
    const { movieId } = req.params;    

    try {
        const response = await fetchMovies(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`);

        const trailer = response.results;

        res.status(200).json({ success: true, trailers: trailer });

    } catch (error) {
        if(error.message.includes("404")) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getMovieDetails = async (req, res) => {
    const { movieId } = req.params;

    try {
        const movie = await fetchMovies(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

        res.status(200).json({ success: true, content: movie });

    } catch (error) {
        if(error.message.includes("404")) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        res.status(500).json({ success: false, message: error.message });
    }
}

export const getSimilarMovies = async (req, res) => {
    const { movieId } = req.params;

    try {
        const similarMovies = await fetchMovies(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`);

        res.status(200).json({ success: true, similar: similarMovies.results });

    } catch (error) {
        if(error.message.includes("404")) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        res.status(500).json({ success: false, message: error.message });
    }
}

export const getMovieByCategory = async (req, res) => { 
    const { category } = req.params;

    const transformedCategory = category.toLowerCase();

    const supportedCategory = [ 'now_playing', 'popular', 'top_rated', 'upcoming'];

    if (!supportedCategory.includes(transformedCategory)) {
        return res.status(400).json({ success: false, message: "Unsupported category" });
    }

    try {
        const movies = await fetchMovies(`https://api.themoviedb.org/3/movie/${transformedCategory}?language=en-US&page=1`);

        res.status(200).json({ success: true, content: movies.results });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
