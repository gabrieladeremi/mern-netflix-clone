import User from '../models/user.js';
import {fetchMovies} from "../services/tmdb.service.js";

export const search = async (req, res) => {
    const { searchType, query } = req.params;

    if(!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
    }

    const supportedSearchTypes = ["movie", "person", "tv"];

    const transformedSearchType = searchType.toLowerCase();

    if (!supportedSearchTypes.includes(transformedSearchType)) {
        return res.status(400).json({ success: false, message: "Invalid search type" });
    }

    try {
        const response = await fetchMovies(`https://api.themoviedb.org/3/search/${transformedSearchType}?query=${query}&include_adult=false&language=en-US&page=1`);

        const data = response.results;

        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "No results found" });
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: data[0].id,
                    image: data[0].poster_path || data[0].profile_path,
                    title: data[0].name,
                    type: transformedSearchType,
                    createdAt: new Date()
                }
            }
        });

        return res.status(200).json({ success: true, content: data });
    } catch (error) {
        console.error("Error occurred while searching:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getSearchHistory = async (req, res) => { 
    try {
        return res.status(200).json({ success: true, content: req.user.searchHistory });
    } catch (error) {
        console.error("Error occurred while fetching search history:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteSearchHistory = async (req, res) => { 
    const { id } = req.params;

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory: { id: parseInt(id) }
            }
        });

        return res.status(200).json({ success: true, message: "Search history item deleted successfully" });

    } catch (error) {
        console.error("Error occurred while deleting search history:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}