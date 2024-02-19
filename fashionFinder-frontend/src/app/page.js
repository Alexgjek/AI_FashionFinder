'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import SendChatButton from '@/components/buttons/SendChatButton';

export default function Home() {
  const [isInputFocused, setInputFocused] = useState(false);
  const [isFormFixed, setFormFixed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const clearInput = () => setInputValue('');
  
  return (
    <main>
      <section className='p-4 pt-32'>
        <div className={`transition ease-linear duration-800 ${isInputFocused ? 'fixed top-16 left-0 text-xl' : 'static top-0 left-0 text-6xl'}`}>
          <h1 className='font-bold'>
            Your very own<br /> personal designer
          </h1>
          <h2 className={`text-xl mt-6 ${isInputFocused ? 'hidden' : ''}`}>Makes finding outfits so much easier</h2>
        </div>
        <form
          className={`mt-6 flex shadow-md ${isFormFixed ? 'fixed bottom-12 left-4 w-11/12 transition-transform duration-1000 ease-in-out transform translate-y-0' : 'static w-11/12 transition-transform duration-1000 ease-in-out transform -translate-y-12'}`}
        >
          <input
            type="text"
            placeholder='Message your personal designer...'
            className="p-2 border border-gray-300 rounded-md block w-full text-sm outline-none"
            onFocus={() => {
              setInputFocused(true);
              setFormFixed(true);
            }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <SendChatButton inputValue={inputValue} clearInput={clearInput}/>
        </form>
      </section>
    </main>
  );
}