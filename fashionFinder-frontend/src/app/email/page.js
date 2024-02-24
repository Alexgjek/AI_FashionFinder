'use client'
import React, { useState } from "react";
import axios from "axios";

const VerifyEmailPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const sendVerificationEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/email", { email });
      setMessage(response.data);
      setEmail("");
    } catch (error) {
      setError(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      {message ? (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md mb-4">
          {message}
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-md py-2 px-3 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendVerificationEmail}
            disabled={loading}
            className={`bg-black text-white py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:bg-black ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;