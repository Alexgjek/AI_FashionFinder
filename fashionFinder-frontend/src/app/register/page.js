'use client';

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import RegisterButton from "@/components/buttons/RegisterButton";

export default function RegisterPage() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const onSignup = async () => {
    try {
      const response = await axios.post("/api/users/register", {...user, confirmPassword});
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error){
      console.log('singup failed', error.message);
      if (error.response && error.response.status === 400){
        setError("Account with that email already exists");
      } else if (error.response && error.response.status === 505){
        setError("All fields are required");
      }
      else if (error.response && error.response.status === 300){
        setError("Invalid email format")
      }
      else if (error.response && error.response.status === 402){
        setError("Passwords do not match")
      }
      else if (error.response && error.response.status === 403){
        setError(<>Password must meet requirements: <br />Minimum 8 characters<br />Contain at least 1 capital etter<br />Contain at least 1 number</>);
      }
    }
  };

  //const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const [error, setError] = React.useState("");

  /*
  useEffect (() => {
    if (user.email.length > 0 && user.password.length > 0 && user.firstName.length > 0 && user.lastName.length > 0){
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
*/

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-xl font-bold mb-5">
        Create your personal account
      </h1>
      <hr />
      <div className='flex flex-col'>
      {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
        <input
          className="border border-black p-3 outline-none mb-4"
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
            setError("");
          }}
          placeholder="E-mail address"
        />
        <div className="flex gap-2">
          <input
            className="border border-black p-3 outline-none mb-4"
            id="firstName"
            type="text"
            value={user.firstName}
            onChange={(e) => {
              setUser({ ...user, firstName: e.target.value });
              setError("");
            }}
            placeholder="First Name"
          />
          <input
            className="border border-black p-3 outline-none mb-4"
            id="lastName"
            type="text"
            value={user.lastName}
            onChange={(e) => {
              setUser({ ...user, lastName: e.target.value });
              setError("");
            }}
            placeholder="Last Name"
          />
        </div>
        <input
          className="border border-black p-3 outline-none mb-4"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
          placeholder="Password"
        />
        <input
          className="border border-black p-3 outline-none mb-4"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
          placeholder="Confirm Password"
        />
        <RegisterButton onSignup={onSignup} />
      </div>
      <div className="flex gap-1 p-2 text-sm">
        <span>Already have an account?</span>
        <Link href="/login" className="hover:underline hover:text-purple-800">Sign in</Link>
      </div>
    </div>
  );
}