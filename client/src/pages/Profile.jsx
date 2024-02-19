import React, {useRef, useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from '../firebase';


const Profile = () => {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(file);
  // console.log(filePer)
  // console.log(formData);
  // console.log(fileUploadError);

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) =>{
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
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    },
    );
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className='flex flex-col gap-4'>
        <input hidden type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} accept='image/*' />
        <img src={ formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt="ProfilePic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload(image must be less than 2MB</span>
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
