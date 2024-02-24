import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NavigationBar = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-200 p-4">
      <div>
        <Link href="/" passHref legacyBehavior>
          <a className="mr-4">Home</a>
        </Link>
        <Link href="/profile" passHref legacyBehavior>
          <a className="mr-4">Profile</a>
        </Link>
      </div>
      <div>
        <button className="bg-black text-white p-2 rounded" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;