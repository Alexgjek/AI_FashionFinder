'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // New state for controlling notification visibility

  const handleResetRequest = async () => {
    setLoading(true);
    try {
      // Check email format before making the request
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/users/forgot', { email });

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
    setLoading(false);
  };

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Forgot/Change Password</h1>
      {success ? (
        <>
          {showNotification && ( // Conditionally render the notification box
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">An email with instructions to reset your password has been sent.</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"></svg>
              </span>
            </div>
          )}
          <button onClick={() => router.push('/login')} className="bg-black text-white py-2 px-4 rounded-md mt-4 hover:bg-black focus:outline-none focus:bg-black">Back to Login</button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-md py-2 px-3 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button onClick={handleResetRequest} disabled={loading} className={`bg-black text-white py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:bg-black ${loading && 'opacity-50 cursor-not-allowed'}`}>
            {loading ? 'Loading...' : 'Reset Password'}
          </button>
        </>
      )}
    </div>
  );
}