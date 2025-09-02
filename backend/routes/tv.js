import express from 'express';

import {
    getTvByCategory,
    getTvDetails,
    getSimilarTv,
    getTrendingTv,
    tvTrailer
} from '../controllers/tv.js';

const router = express.Router();

router.get("/trending", getTrendingTv);

router.get("/:tvId/trailers", tvTrailer);

router.get("/:tvId/details", getTvDetails);

router.get("/:tvId/similar", getSimilarTv);

router.get("/category/:category", getTvByCategory);

export default router;