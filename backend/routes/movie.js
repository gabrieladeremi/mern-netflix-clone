import express from 'express';

import {
    getMovieByCategory,
    getMovieDetails,
    getSimilarMovies,
    getTrendingMovie,
    movieTrailer
} from '../controllers/movie.js';

const router = express.Router();

router.get("/trending", getTrendingMovie);

router.get("/:movieId/trailers", movieTrailer);

router.get("/:movieId/details", getMovieDetails);

router.get("/:movieId/similar", getSimilarMovies);

router.get("/category/:category", getMovieByCategory);


export default router;