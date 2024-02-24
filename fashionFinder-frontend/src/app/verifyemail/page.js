'use client';

import axios from 'axios';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";



export default function VerifyEmailPage() {

  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // New state for controlling notification visibility

  const verifyUserEmail = async () => {
    try {
      const response = axios.post('/api/users/verifyEmail', {token})

      if (response.status === 200) {
        setError('');
        setSuccess(true); // Set success state to true
        setShowNotification(true); // Show notification box
        setLoading(false);
      } else if (response.status === 400) {
        setError('This email is not registered.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    }
    setLoading(true);
  };
  
  
  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || '');
  }, [])

  useEffect(() => {
    if (token.length > 0){
      verifyUserEmail();
    }
  }, [token])

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl'>
        Verify Email
      </h1>
      <h2 className='p-2 bg-slate-400 text-black'>
        {token ? `${token}` : "no token"}
      </h2>
      {verified && (
        <div>
          <h2>Email verified</h2>
          <Link href={'/login'} className='text-xl'>
            Login
          </Link>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
        </div>
      )}
    </div>
  );
}