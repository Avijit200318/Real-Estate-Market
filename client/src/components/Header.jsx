import React, { useState, useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm , setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(()=> {
        const urlParams  = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search]);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 xl:max-w-[85rem]">
                <Link to='/'>
                    <h1 className='font-bold text-base sm:text-xl flex flex-wrap'>
                        <span className="text-[#C499F3]">Estate</span>
                        <span className="text-[#1D24CA]">Ease</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 px-3 py-2 sm:p-3  rounded-lg flex items-center'>
                    <input type="text" placeholder='Search...' className='bg-transparent outline-none w-28 sm:w-64 lg:w-80' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} />
                    <button>
                    <FaSearch className='text-salte-500' />
                    </button>
                </form>
                <ul className='flex gap-4 items-center'>
                    <Link to='/' className='hidden sm:block'>
                        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer xl:text-lg'>Home</li>
                    </Link>
                    <Link to='/about' className='hidden sm:block'>
                        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer xl:text-lg'>About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img src={currentUser.avatar} alt="profile" className='w-10 h-10 rounded-full border-2 border-black object-cover ml-2' />
                        ) : (
                            <li className='sm:inline text-slate-700 hover:underline cursor-pointer xl:text-lg'>Login</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header
