import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';


import { useContentStore } from '../store/content';
import NavBar from '../components/NavBar';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const SearchPage = () => {
    const [activeTab, setActiveTab] = React.useState("movie");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);

    const { setContentType } = useContentStore();

    const handleTabClick = (tab) => {
        setActiveTab(tab);

        tab === "movie" ? setContentType("movie") : setContentType("tv");

        setSearchResults([]);
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);

            setSearchResults(response.data.content);
            
        } catch (error) {
            if (error.response.status === 404) {
                
                toast.error("No result found for the search category");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    }
    

    return (
        <div className="bg-black min-h-screen text-white">
          <NavBar />
          
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center gap-3 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "movie" ? "bg-red-600" : "bg-gray-800 hover:bg-red-700"}`}
                        onClick={() => handleTabClick('movie')}
                    >Movies
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "tv" ? "bg-red-600" : "bg-gray-800 hover:bg-red-700"}`}
                        onClick={() => handleTabClick('tv')}
                    >TV Shows
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "person" ? "bg-red-600" : "bg-gray-800 hover:bg-red-700"}`}
                        onClick={() => handleTabClick('person')}
                    >Person
                    </button>
                </div>

                <form className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        placeholder={`Search for a movie ${activeTab}`}
                    />

                    <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <Search className="size-6" />
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((result) => {
                        if (!result.poster_path && !result.profile_path) return null;
                        
                        return (
                            <div className="bg-gray-800 rounded p-4" key={result.id}>
                                {activeTab === "person" ? (
                                    // TODO: Implement person search result rendering to={"/actor/" + result.name} 
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                                            alt={result.name}
                                            className={"max-h-96 rounded mx-auto"}
                                        />
                                        <h2 className="mt-2 text-xl font-bold">{result.name}</h2>
                                    </div>
                                ) : (
                                        <Link to={"/watch/" + result.id} onClick={() => {setContentType(activeTab)}}>
                                            <img
                                                src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                                                alt={result.name}
                                                className={"max-h-96 rounded mx-auto"}
                                            />
                                            <h2 className="mt-2 text-xl font-bold">{result.name || result.title}</h2>
                                        </Link>   
                                    )
                                }
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default SearchPage