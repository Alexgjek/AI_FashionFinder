<<<<<<< HEAD
'use client';
import { useState, useRef, useEffect } from 'react';
import SendChatButton from '@/components/buttons/SendChatButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const conversationContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0); // Initialize with 0 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const clearInput = () => {
    setInputValue('');
  };

  const handleNewChat = () => {
    setConversation([]);
    setIsSubmitted(false);
    setIsMenuOpen(false); 
  };

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(inputValue);

    setIsSubmitted(true);
    const newMessage = {
      sender: "You",
      message: `${inputValue}`,
      link: false
    };
    setConversation(prevConversation => [...prevConversation, newMessage]);
    clearInput();

    try {
      const response = await axios.post('http://localhost:8000/getAIResponse', {
        prompt: inputValue,
      });
      const respJson = response.data;

      const fashionFinderMessage = {
        sender: "FashionFinder",
        message: respJson.ai_response,
        link: false
      };

      setConversation(prevConversation => [...prevConversation, fashionFinderMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }
  useEffect(() => {
    // Close menu automatically when window width exceeds 
    if (windowWidth > 768) {
      setIsMenuOpen(false);
    }
  }, [windowWidth]);
  return (
    <div className='m-0 w-full h-screen grid grid-cols-7 relative' style={{ height: 'calc(100vh - 60px)' }}>
      {windowWidth > 768 || isMenuOpen ? (
        <div className='bg-gray-200 col-span-1 left-0 p-1 relative'>
          <button
            className='w-full rounded-lg p-2 hover:bg-gray-100 flex justify-between items-center'
            onClick={handleNewChat}
          >
            <span className='font-semibold text-sm'>New Chat</span>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
      ) : (
        <div className='p-1'>
          <button
            className='rounded-lg p-2 hover:bg-gray-100'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      )}
      <div className='col-span-6 flex flex-col items-center justify-center'>
        {isSubmitted ? (
          <div
            ref={conversationContainerRef}
            className='absolute top-20 w-5/6 p-2'
            style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
          >
            {conversation.map((conv, index) => (
              <div key={index} className='p-2'>
                <>
                  <p className='font-bold'>{conv.sender}</p>
                  <div className='font-md'>{conv.message.split("\n").map((part, idx) => conv.link ? (<a key={idx} href={part} target="_blank" style={{ display: "block", color: "blue", textDecoration: "underline" }}>{part}</a>) : (<p key={idx}>{part}</p>))}</div>
                  <hr className='bg-black' />
                </>
              </div>
            ))}
          </div>
        ) : (
          <div className='mx-auto'>
            <img src="/FFlogo.png" alt="FashionFinder Logo" />
            <h1 className='text-4xl mx-auto font-semibold text-center'>
              Tell us what you're looking for
            </h1>
            <h2 className='font-semibold text-xl text-center p-2 mb-20'>
              We'll find it for you
            </h2>
          </div>
        )}
        {isMenuOpen && (
          <div className="absolute top-0 left-1/4 transform -translate-x-2/4">
            <FontAwesomeIcon icon={faTimes} className='text-2xl' onClick={() => setIsMenuOpen(false)} /> {/* Close menu when 'x' is clicked */}
          </div>
        )}
        <div className="absolute bottom-5 w-5/6 flex justify-center h-16">
          <input
            type="text"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={e => setInputValue(e.target.value)}
            className="w-2/4 p-4 border rounded-xl outline-none z-10"
            placeholder="Message FashionFinder..."
          />
          <SendChatButton inputValue={inputValue} clearInput={clearInput} handleClick={handleSubmit} />
=======
"use client";
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
        <div className="col-span-3 bg-gray-300">
          <p className="text-black p-1 font-bold inline-flex gap-2 text-2xl items-center absolute left-5 top-5">
            FashionFinder
            {/* <FontAwesomeIcon icon={faCircle} className="w-5" /> */}
          </p>
          <div className="h-full flex items-center">
            <p
              className={`text-black text-4xl font-semibold text-left ml-4 mr-5 ${
                fadeIn ? "fade-in" : "fade-out"
              } max-w-[2/3`}
              key={phraseIndex}
            >
              {userSearchExamples[phraseIndex]}
            </p>
          </div>
        </div>
        <div className="col-span-2 bg-zinc-700 flex flex-col items-center justify-center">
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
          </div>
>>>>>>> develop
        </div>
      </div>
    </main>
  );
}
