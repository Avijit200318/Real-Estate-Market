import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserSuccess, deleteUserStart, signInFailure, signInStart, signInSuccess, signOutStart } from "../redux/user/userSlice";
import { Link } from "react-router-dom";


const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSucess, setUpdateSucess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  // console.log(file);
  // console.log(filePer)
  console.log(formData);
  // console.log(fileUploadError);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          });
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' />
        <img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="ProfilePic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload(image must be less than 2MB)</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePer}%`}
            </span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Image Successfull Uploaded</span>
          ) : (
            ''
          )
          }
        </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className="bg-[#C499F3] rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'loading...' : 'Update'}</button>

        <Link to='/create-listing' className='bg-[#1D24CA] text-white rounded-lg p-3 uppercase text-center hover:opacity-95' >Create Listing</Link>

      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-500'>{updateSucess ? "User is updated successfully" : ''}</p>
      <button onClick={handleShowListing} className="w-full text-green-700">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError ? 'Error showing Listing' : ''}</p>

      {userListing && userListing.length > 0 && <div className="flex flex-col gap-4">
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {
          userListing.map((listings) => <div key={listings._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link to={`/listing/${listings._id}`}>
              <img src={listings.imageUrls[0]} alt="" className="h-16 w-16 object-contain rounded-lg" />
            </Link>
            <Link to={`/listing/${listings._id}`} className="text-slate-700 font-semibold flex-1 hover:underline truncate">
              <p>{listings.name}</p>
            </Link>

            <div className="flex flex-col items-center">
              <button onClick={() => handleListingDelete(listings._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listings._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>)}
      </div>
      }
    </div>
  )
}

export default Profile
