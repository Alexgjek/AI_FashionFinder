'use client';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setPhraseIndex(
          (prevIndex) => (prevIndex + 1) % userSearchExamples.length
        );
        setFadeIn(true);
      }, 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, [phraseIndex]);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const userSearchExamples = [
    "Find me an outfit for a night out",
    "What would go well with a grey hoodie?",
    "Help me find a dress for a wedding",
    "I need a casual outfit for a date",
    "What should I wear to a job interview?",
    "Help me find an outfit for a vacation",
    "Help me find a new outfit for work",
    "I need to an outfit for a concert",
    "What should I wear to a fancy dinner?",
    "What would match with a red skirt?",
    "What should I wear to a baby shower?",
  ];

  return (
    <main>
      <div className="w-full h-screen grid grid-cols-5">
        <div className="col-span-3 bg-gray-300 relative hidden sm:block">
          <p className="text-black p-1 font-bold inline-flex gap-2 text-2xl items-center absolute left-5 top-5">
            FashionFinder
          </p>
          <div className="h-full flex items-center">
            <p
              className={`text-black text-4xl font-semibold text-left ml-4 mr-5 ${
                fadeIn ? "fade-in" : "fade-out"
              } max-w-[2/3]`}
              key={phraseIndex}
            >
              {userSearchExamples[phraseIndex]}
            </p>
          </div>
        </div>
        
        <div className="col-span-5 sm:col-span-2 bg-zinc-700 flex flex-col items-center justify-center">
         <p className="text-white p-1 font-bold inline-flex gap-2 text-2xl items-center absolute left-5 top-5 sm:hidden">
            FashionFinder
            </p>
          <p className="text-3xl font-bold text-white">Welcome</p>
          <div className="flex gap-4 w-full p-6">
            <button
              className="p-4 bg-gray-500 font-bold w-full rounded-lg shadow-xl text-white hover:bg-opacity-70"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button
              className="p-4 bg-gray-500 font-bold w-full rounded-lg shadow-xl text-white hover:bg-opacity-70"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </div>
          <div className="inline-flex absolute bottom-10 gap-1">
            <p className="text-gray-300">
              <FontAwesomeIcon icon={faGlobe} className="h-4" />
            </p>
            <p className="text-gray-300">MAGK</p>
            </div>        </div>
      </div>
    </main>
  );
}
