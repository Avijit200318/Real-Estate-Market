import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="ProfilePic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' />
        <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
