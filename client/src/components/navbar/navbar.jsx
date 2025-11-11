import React, { Fragment, useState } from "react"
import ProfileInfo from "../cards/profileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/searchbar";


const Navbar = ({ userInfo,onSearchNote ,handleClearSearch}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate('/Login');
    }

    const handleSearh = () => {
        if(searchQuery){
            onSearchNote(searchQuery);
        }
    }

    const OnclearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    }
    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow ">
            <h2 className="text-2xl font-medium text-black py-2">Notes App</h2>
            <SearchBar
                value={searchQuery}
                onChange={({ target }) => {
                    setSearchQuery(target.value)
                }}
                OnclearSearch={OnclearSearch}
                handleSearh={handleSearh}

            />

            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>



    )
}

export default Navbar;