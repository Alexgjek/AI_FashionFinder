"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterButton from "@/components/buttons/RegisterButton";
import axios from "axios";

const PasswordStrengthBar = ({ password }) => {
  const calculateStrength = (password) => {
    const minLength = 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    let strength = 0;
    if (password.length >= minLength) {
      strength++;
    }
    if (hasCapitalLetter) {
      strength++;
    }
    if (hasNumber) {
      strength++;
    }

    return strength;
  };

  const strength = calculateStrength(password);
  const isWeak = strength <= 2;

  return (
    <div className="flex items-center w-full">
      <div className="relative flex items-center w-1/2 mr-4">
        <div className="w-20 h-3 bg-gray-200 rounded-full">
          <div
            className={`h-3 rounded-full ${
              isWeak ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${(strength / 3) * 100}%` }}
          ></div>
        </div>
        <p
          className={`ml-2 text-sm font-medium ${
            isWeak ? "text-red-500" : "text-green-500"
          }`}
        >
          {isWeak ? "Weak" : "Strong"}
        </p>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showStrengthBar, setShowStrengthBar] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [verificationSent, setVerificationSent] = useState(false);

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (e) => {
    setUser({ ...user, password: e.target.value });
    setShowStrengthBar(e.target.value !== "");
  };

  const sendVerificationEmail = async (email) => {
    try {
      const response = await axios.post("/api/users/email", { email });
      setVerificationSent(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const handleNameChange = (field, value) => {
    const sanitizedValue = value.replace(/[^A-Za-z]/g, "");
    setUser({
      ...user,
      [field]: sanitizedValue,
    });
  };

  const onSignup = async () => {
    try {
      setErrors({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        setErrors({ email: "Invalid email format" });
        return;
      }

      setLoading(true);
      const response = await axios.post("/api/users/register", {
        ...user,
        confirmPassword,
      });
      console.log("Signup success", response.data);
      setLoading(false);
      sendVerificationEmail(user.email);
    } catch (error) {
      console.log("signup failed", error.message);
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setErrors({ email: "Account with that email already exists" });
      } else if (error.response && error.response.status === 505) {
        setErrors({ email: "All fields are required" });
      } else if (error.response && error.response.status === 402) {
        setErrors({ confirmPassword: "Passwords must match" });
      } else if (error.response && error.response.status === 403) {
        setErrors({ password: "Password must meet requirements" });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-xl font-bold mb-5">Create your personal account</h1>
      {verificationSent && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md mb-4">
          Check your email, a verification code has been sent!
        </div>
      )}
      <div className="text-left text-sm">
        <span>Mandatory fields*</span>
      </div>
      <hr />
      <div className="flex flex-col">
        <input
          className="border border-black p-3 outline-none mb-4"
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
            setErrors({ email: "" });
          }}
          placeholder="E-mail address*"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}
        <div className="flex gap-2">
          <input
            className="border border-black p-3 outline-none mb-4"
            id="firstName"
            type="text"
            value={user.firstName}
            onChange={(e) => {
              handleNameChange("firstName", e.target.value);
              setErrors({ firstName: "" });
            }}
            placeholder="First Name*"
          />

          <input
            className="border border-black p-3 outline-none mb-4"
            id="lastName"
            type="text"
            value={user.lastName}
            onChange={(e) => {
              handleNameChange("lastName", e.target.value);
              setErrors({ lastName: "" });
            }}
            placeholder="Last Name*"
          />
        </div>
        {errors.firstName && (
          <p className="text-red-500 text-sm mb-2">{errors.firstName}</p>
        )}
        {errors.lastName && (
          <p className="text-red-500 text-sm mb-2">{errors.lastName}</p>
        )}
        {showStrengthBar && <PasswordStrengthBar password={user.password} />}
        <div className="relative mb-4">
          <input
            className="border border-black py-4 px-3 outline-none w-full"
            type={passwordVisible ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={user.password}
            onChange={handlePasswordChange}
          />
          <img
            src={passwordVisible ? "/eye.png" : "/eyeslash.png"}
            width="24px"
            height="24px"
            style={{
              display: "inline",
              marginLeft: "-30px",
              cursor: "pointer",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={handlePasswordVisibilityToggle}
          />
        </div>
        <input
          className="border border-black py-4 px-3 outline-none w-full"
          type={passwordVisible ? "text" : "password"}
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors({ confirmPassword: "" });
          }}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}
        <label>
          <div>
            <span className="text-sm">
              <>
                Password must meet requirements: <br />
                Minimum 8 characters
                <br />
                Contain at least 1 capital letter
                <br />
                Contain at least 1 number
                <br />
                <br />
              </>
            </span>
          </div>
        </label>
        <RegisterButton onSignup={onSignup} />
      </div>
      <div className="flex gap-1 p-2 text-sm">
        <span>Already have an account?</span>
        <Link href="/login" className="hover:underline hover:text-purple-800">
          Sign in
        </Link>
      </div>
    </div>
  );
}