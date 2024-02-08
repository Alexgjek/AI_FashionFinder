'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShirt, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import NextButton from '@/components/buttons/SignInPageButton';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState("");

  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  //const [loading, setLoading] = React.useState(false);


  const onLogin = async () => {
    try {
      //setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      router.push("/profile");
    } catch (error){
      console.log('singup failed', error.message);
      if (error.response && error.response.status === 400){
        setError("User does not exist");
      } else if (error.response && error.response.status === 300){
        setError("Invalid email format");
      }
      else if (error.response && error.response.status === 500){
        setError("Invalid login credentials");
      }
    }
  }

  /*
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0){
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
*/
useEffect(() => {
  const passwordInput = document.getElementById('password');
  const observer = new MutationObserver(() => {
    if (passwordInput.type === 'text') {
      passwordInput.type = 'password';
    }
  });

  observer.observe(passwordInput, { attributes: true });

  return () => {
    observer.disconnect();
  };
}, []);
  return (
    <main>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mt-10 mb-5">Enter your email</h1>
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
        <input
          className="border border-black py-4 px-3 outline-none w-full mb-2"
          type="text"
          id="email"
          placeholder="E-mail address"
          onChange={(e) => {
            setUser({ ...user, email: e.target.value.toLowerCase()});
            setError("");
          }}
        />
        <input
          className="border border-black py-4 px-3 outline-none w-full"
          type="password"
          id="password"
          placeholder="password"
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            setError("");
          }}
        />
        <NextButton onLogin={onLogin} />
        <div className='flex gap-1 text-sm py-2'>
          <span>Don't have an account?</span>
          <Link href={'/register'} className='hover:underline hover:text-purple-800'>Create account</Link>
        </div>
        <hr className='border-gray-300 mt-4 mb-4'/>
        <span className="text-sm">Make your experience even more fun when signing in</span>

        <div className="p-5 text-xs space-y-3">
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
            <p>Save outfits to albums you create</p>
          </div>
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faShirt} className="w-5 h-5" />
            <p>Set your brand preferences</p>
          </div>
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faSackDollar} className="w-5 h-5" />
            <p>Set your budget</p>
          </div>
        </div>
      </div>
    </main>
  );
}
