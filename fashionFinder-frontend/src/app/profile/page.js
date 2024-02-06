'use client'
import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
export default function ProfilePage() {

  const router = useRouter()
  const logout = async () => {
    try {
      await axios.get('/api/users/logout')
      router.push('/')
    } catch (error) {
      console.log(error.message);

    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>
        Profile
      </h1>
      <hr />
      <p>Profile Page</p>
      <button
      className="bg-black text-white p-4 w-40 mt-4"
      onClick={logout}>
        Logout
      </button>
    </div>
  );

}