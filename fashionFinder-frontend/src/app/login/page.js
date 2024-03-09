'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShirt, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import NextButton from '@/components/buttons/SignInPageButton';
import { useAuth } from '@/app/authContext';
import ShortHeader from '@/components/ShortHeader';

export default function LoginPage() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const {showModal, setShowModal} = useAuth(); 
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('rememberedUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const onLogin = async () => {
    try {
      const response = await axios.post("/api/users/login", user);
      setIsLoggedIn(true);
      setShowModal(false);

      await axios.get('/api/users/grabUserEmail');
      console.log("Login success", response.data);
      
      if (user.rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      router.push("/chat");
    } catch (error) {
      console.log('login failed', error.message);
      if (error.response && error.response.status === 400){
        setError("User does not exist");
      } else if (error.response && error.response.status === 300){
        setError("Invalid email format");
      } else if (error.response && error.response.status === 401){
        setError("Account not activated");
      } else if (error.response && error.response.status === 500){
        setError("Invalid login credentials");
      }
    }
  };

  return (
    <main>
      <ShortHeader />
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mt-10 mb-5">Enter your email</h1>
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
        <input
          className="border border-black py-4 px-3 outline-none w-full mb-2"
          type="text"
          id="email"
          placeholder="E-mail address"
          value={user.email}
          onChange={(e) => {
            setUser({ ...user, email: e.target.value.toLowerCase()});
            setError("");
          }}
        />
        <div className="relative">
          <input
            className="border border-black py-4 px-3 outline-none w-full"
            type={passwordVisible ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
              setError("");
            }}
          />
          <img
            src={passwordVisible ? "/eye.png" : "/eyeslash.png"}
            width="24px"
            height="24px"
            style={{ display: 'inline', marginLeft: '-30px', cursor: 'pointer', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={user.rememberMe}
              onChange={(e) => setUser({ ...user, rememberMe: e.target.checked })}
            />
            <label htmlFor="rememberMe" className="ml-2">Remember me</label>
          </div>
          <div>
            <Link href={'/forgot'} className='hover:underline hover:text-purple-800'>Forgot Password?</Link>
          </div>
        </div>
        <NextButton onLogin={onLogin}/>
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