import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';


import NavBar from '../components/NavBar';
import { SMALL_IMG_BASE_URL } from '../utils/constants';
import { formatDate } from '../utils/dateFormatter';

const SearchHistoryPage = () => {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
                const response = await axios.get('/api/v1/search/history');

                setSearchHistory(response.data.content);
            } catch (error) {
                console.error("Error fetching search history:", error);
                setSearchHistory([]);
            }
        }

        getSearchHistory()
    }, []);      
    
    const handleDelete = async (history) => {
        try {
            await axios.delete(`/api/v1/search/history/${history.id}`);
            setSearchHistory(searchHistory.filter((item) => item.id !== history.id));
            toast.success("History item deleted");
        } catch (error) {
            console.error("Error deleting history:", error);
            toast.error("Failed to delete history item");
        }
    }

    if (searchHistory?.length === 0) {
        return (
            <div className="bg-black min-h-screen text-white">
                <NavBar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8"> Search History</h1>
                    <div className="flex justify-center items-center h-96">
                        <p className="text-xl">No search history available</p>
                    </div>
                </div>
            </div>
        )
    }
    

    return(
        <div className="bg-black text-white min-h-screen">
            <NavBar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8"> Search History</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchHistory?.map((item) => {
                        // Line 67 prevents rendering of items without images affecting the amount of rendered items
                        // if (!item.image) return null;

                        return (
                            <div key={item.id} className="bg-gray-800 p-4 rounded flex items-start">
                                <img
                                    src={SMALL_IMG_BASE_URL + item.image}
                                    alt="History image"
                                    className="size-16 rounded-full object-cover mr-4"
                                />
                                <div className="flex flex-col">
                                    <span className="text-white text-lg">{item.title}</span>
                                    <span className="text-gray-400 text-sm">{formatDate(item.createdAt)}</span>
                                </div>

                                <span className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ml-auto ${item.type === "movie"
                                        ? "bg-red-600"
                                        : item.type === "tv"
                                            ? "bg-blue-600"
                                            : "bg-green-600"
                                    }`}>
                                    {item.type[0].toUpperCase() + item.type.slice(1)}
                                </span>

                                <Trash
                                    className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600"
                                    onClick={() => handleDelete(item)}
                                />
                            </div>
                        ) 
                    })}
                </div>

            </div>
        </div>
    )
}

export default SearchHistoryPage