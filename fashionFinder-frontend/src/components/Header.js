'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.post('/api/users/check-auth', { token });
          setIsLoggedIn(response.data.isValid);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      router.push('/');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className='bg-white border-b flex justify-between p-4'>
      <div className="flex items-center gap-6">
        <Link href={'/'}>FashionFinder</Link>
        <nav className='flex gap-4'>
          <Link href={'/about'}>About</Link>
          <Link href={'/contact'}>Contact</Link>
          <Link href={'/albums'}>Albums</Link>
        </nav>
      </div>
      <nav className='flex items-center gap-4'>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link href={'/login'}>Sign In</Link>
            <Link href={'/register'}>Create Account</Link>
          </>
        )}
      </nav>
    </header>
  )
}
// export default function Header() {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);

//   useEffect(() => {
//     checkLoggedInStatus();
//   }, []);

//   const checkLoggedInStatus = async () => {
//     try {
//       const response = await axios.get("/api/users/login");
//     if (response) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//     } catch (error) {
//       console.error("Error checking login status", error);
//       // Handle error, set isLoggedIn to false or show error message to the user
//     }
//   };
//   const router = useRouter()
//   const logout = async () => {
    
//         // localStorage.removeItem('rememberedUser');
//        setIsLoggedIn(true);
//         await axios.get('/api/users/logout');
//         router.push('/');
      
//     }

//   return (
//     <header className='bg-white border-b flex justify-between p-4'>
//       <div className="flex items-center gap-6">
//         <Link href={'/'}>FashionFinder </Link>
//         <nav className='flex gap-4'>
//           <Link href={'/about'}>About</Link>
//           <Link href={'/contact'}>Contact Us</Link>
//           <Link href={'/albums'}>Albums</Link>
//         </nav>
//       </div>
//       <nav className='flex items-center gap-4'>
//         {isLoggedIn? (
//           <button 
//             onClick={logout}
//             style={{ backgroundColor: 'black', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}
//           >
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link href={'/login'}>Sign In</Link>
//             <Link href={'/register'}>Create Account</Link>
//           </>
//         )}
//       </nav>
//     </header>
//   );
// }