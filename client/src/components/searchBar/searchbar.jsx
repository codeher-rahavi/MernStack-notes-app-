import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({value,onChange,handleSearh,OnclearSearch}) =>{
    return (
        <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
            <input
                type="text"
                placeholder="Search notes"
                className="w-full text-sm bg-transparent py-[11px] outline-0"
                value={value}
                onChange={onChange}
            />

            {value && <IoMdClose className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3 " onClick={OnclearSearch}/>}
            <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" onClick={handleSearh}/>
        </div>
    )
}

export default SearchBar;