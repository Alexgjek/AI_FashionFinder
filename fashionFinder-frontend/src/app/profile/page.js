'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  //const [isChangingPassword, setIsChangingPassword] = useState(false);
  //const [oldPassword, setOldPassword] = useState('');
  //const [newPassword, setNewPassword] = useState('');
  //const [email, setEmail] = useState(''); 

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/');
    } catch (error) {
      console.log(error.message);
    }
  };
/*
  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/changePassword', {
        email, // use the email state variable
        oldPassword,
        newPassword,
      });
      console.log('Password changed successfully');
      setIsChangingPassword(false);
    } catch (error) {
      console.log(error.message);
    }
  };
*/
  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <h1 className='text-3xl font-bold p-3'>
          Personal Information
        </h1>
        <div className='flex flex-col items-start'>
          <h2 className='text-gray-600'>Manage your personal details, brand preferences, and budget preferences
          </h2>
          <div className='w-full font-semibold mt-4'>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h3 className='mb-6'>
              NAME
            </h3>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h4 className='mb-6'> 
              EMAIL
            </h4>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h5 className='mb-6'>
              PASSWORD
            </h5>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h6 className='mb-6'>
              BRAND
            </h6>
            <hr className='border border-gray-300 mt-2 mb-2'/>
            <h7 className='mb-6'>
              BUDGET
            </h7>
          </div>
        </div>
        <button
            className="bg-black text-white p-4 w-40 mt-4"
            onClick={logout}>
            Logout
          </button>
      </div>
    </main>
  );
}