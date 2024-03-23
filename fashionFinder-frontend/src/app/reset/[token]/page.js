"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/users/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params.token,
          }),
        });

        if (response.status === 400) {
          setError("Invalid Token or has expired");
          setVerified(true);
        }
        if (response.status === 200) {
          setError("");
          setVerified(true);
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        setError("Error, try again later.");
        console.log(error);
      }
    };
    verifyToken();
  }, [params.token]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/Dashboard");
    }
  }, [sessionStatus, router]);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    const newPassword = e.target[0].value;

    if (!validatePassword(newPassword)) {
      setError("Password must meet requirements, try again.");
      return;
    }

    try {
      if (user && user.password) {
        if (newPassword.length === user.password.length) {
          let different = false;
          for (let i = 0; i < newPassword.length; i++) {
            if (newPassword[i] !== user.password[i]) {
              different = true;
              break;
            }
          }
          if (!different) {
            setError("New password must be different from the old one.");
            return;
          }
        }
      }

      const res = await axios.post("/api/users/reset", {
        password: newPassword,
        email: user?.email,
      });
      if (res.status === 200) {
        setError("");
        setPassword("");
        setSuccess(true);
      }
    } catch (error) {
      setError("Must be a new password.");
      console.log(error);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasCapitalLetter && hasNumber;
  };

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-4xl text-center font-semibold mb-8">
          Reset Password
        </h1>
        {success && (
          <>
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              Password successfully changed
            </div>
            <button
              onClick={() => router.push("/login")}
              className="bg-black text-white py-2 px-4 rounded-md mt-4 hover:bg-black focus:outline-none focus:bg-black"
            >
              Back to Profile
            </button>
          </>
        )}
        {!success && (
          <form onSubmit={handleResetRequest}>
            <div className="relative mb-4">
              <input
                type={passwordVisible ? "text" : "password"}
                className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={passwordVisible ? "/eye.png" : "/eyeslash.png"}
                width="24px"
                height="24px"
                className="absolute right-4 top-4 cursor-pointer"
                onClick={handlePasswordVisibilityToggle}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
            >
              Reset Password
            </button>
            {error && (
              <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
            )}
            <div>
              <span className="text-sm">
                Password must meet requirements: <br />
                Minimum 8 characters
                <br />
                Contain at least 1 capital letter
                <br />
                Contain at least 1 number
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
