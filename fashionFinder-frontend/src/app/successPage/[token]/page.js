'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function EmailVerificationSuccess({ params }) {
  const router = useRouter();

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/users/verify-email', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params.token,
          }),
        });

        if (response.status === 400) {
          setError('Invalid Token or has expired');
        } else if (response.status === 200) {
          setError('');
          setVerified(true);
        }
      } catch (error) {
        setError('Error, try again later.');
        console.log(error)
      }
    };
    verifyToken();
  }, [params.token]);

  // Function to handle navigation back to the login page
  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      {!verified && error && (
        <div className="bg-red-200 text-red-800 px-4 py-2 rounded-md mb-4 border border-red-600">
          Invalid token or token has expired.
        </div>
      )}
      {verified && (
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4 border border-green-600">
          Your email has been verified successfully, proceed to the login page!
        </div>
      )}
      {verified && !error && (
        <button
          onClick={navigateToLogin}
          className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      )}
    </div>
  );
};