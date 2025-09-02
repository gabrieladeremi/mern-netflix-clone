import express from 'express';

import { deleteSearchHistory, getSearchHistory, search } from '../controllers/search.js';

const router = express.Router();

router.get("/:searchType/:query", search);

router.get("/history", getSearchHistory);

router.delete("/history/:id", deleteSearchHistory);

export default router;