"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/api/users/changePass");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  const handleResetRequest = async () => {
    setLoading(true);
    try {
      // Check if userInfo.email is available and valid
      if (userInfo.email && !validateEmail(userInfo.email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      // If userInfo.email is not valid, use the email entered in the input field
      const userEmail = userInfo.email ? userInfo.email : email;

      // Continue with the reset request using userEmail
      const response = await axios.post("/api/users/forgot", {
        email: userEmail,
      });

      if (response.status === 200) {
        setError("");
        setSuccess(true);
        setShowNotification(true);
      } else if (response.status === 400) {
        setError("This email is not registered.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
    setLoading(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Forgot/Change Password</h1>
      {success ? (
        <>
          {showNotification && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">
                An email with instructions to reset your password has been sent.
              </span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                ></svg>
              </span>
            </div>
          )}
          <button
            onClick={() => router.push("/login")}
            className="bg-black text-white py-2 px-4 rounded-md mt-4 hover:bg-black focus:outline-none focus:bg-black"
          >
            Back to Profile
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-md py-2 px-3 mb-3"
            value={userInfo.email || email}
            disabled={!userInfo || !!userInfo.email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button
            onClick={handleResetRequest}
            disabled={loading}
            className={`bg-black text-white py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:bg-black ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
}
