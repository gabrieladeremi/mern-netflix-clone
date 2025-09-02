import { fetchMovies } from '../services/tmdb.service.js';

export const getTrendingTv = async (req, res) => {
    try {
        const tvShows = await fetchMovies('https://api.themoviedb.org/3/trending/tv/day?language=en-US');

        const randomTvShow = tvShows.results[Math.floor(Math.random() * tvShows.results?.length)];

        res.status(200).json({ success: true, content: randomTvShow });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const tvTrailer = async (req, res) => { 
    const { tvId } = req.params;    

    try {
        const response = await fetchMovies(`https://api.themoviedb.org/3/tv/${tvId}/videos?language=en-US`);

        const trailer = response.results;

        res.status(200).json({ success: true, trailers: trailer });

    } catch (error) {
        if(error.message.includes("404")) {
            return res.status(404).json({ success: false, message: "Tv not found" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getTvDetails = async (req, res) => {
    const { tvId } = req.params;

    try {
        const tvShow = await fetchMovies(`https://api.themoviedb.org/3/tv/${tvId}?language=en-US`);

        res.status(200).json({ success: true, content: tvShow });

    } catch (error) {
        if(error.message.includes("404")) {
            return res.status(404).json({ success: false, message: "Tv not found" });
        }

        res.status(500).json({ success: false, message: error.message });
    }
}

export const getSimilarTv = async (req, res) => {
    const { tvId } = req.params;

    try {
        const similarTvShows = await fetchMovies(`https://api.themoviedb.org/3/tv/${tvId}/similar?language=en-US&page=1`);

        res.status(200).json({ success: true, similar: similarTvShows.results });

    } catch (error) {
        if(error.message.includes("404")) {
            return res.status(404).json({ success: false, message: "Tv not found" });
        }

        res.status(500).json({ success: false, message: error.message });
    }
}

export const getTvByCategory = async (req, res) => { 
    const { category } = req.params;

    const transformedCategory = category.toLowerCase();

    const supportedCategory = [ 'airing_today', 'popular', 'top_rated', 'on_the_air'];

    if (!supportedCategory.includes(transformedCategory)) {
        return res.status(400).json({ success: false, message: "Unsupported category" });
    }

    try {
        const tvShows = await fetchMovies(`https://api.themoviedb.org/3/tv/${transformedCategory}?language=en-US&page=1`);

        res.status(200).json({ success: true, content: tvShows.results });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
