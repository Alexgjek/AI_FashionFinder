'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import SendChatButton from '@/components/buttons/SendChatButton';

export default function Home() {
  const [isInputFocused, setInputFocused] = useState(false);
  const [isFormFixed, setFormFixed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const clearInput = () => setInputValue('');
  
  const formStyle = isFormFixed
  ? { 
      position: 'fixed', 
      bottom: '3rem', 
      width: 'calc(100% - 2rem)',
      left: '1rem', 
      transition: 'transform 0.3s ease-in-out' 
    }
  : { 
      position: 'static', 
      width: 'calc(100% - 2rem)',
      transition: 'transform 0.3s ease-in-out' 
    };

  return (
    <main>
      <section className='p-4 pt-32'>
        <div>
          <h1 className='text-6xl font-bold'>
            Your very own<br /> personal designer
          </h1>
          <h2 className='text-xl mt-6'>Makes finding outfits so much easier</h2>
        </div>
        <form
          className="mt-6 flex shadow-md transition-transform duration-1000 ease-in-out"
          style={formStyle}
        >
          <input
            type="text"
            placeholder='Message your personal designer...'
            className="p-2 border border-gray-300 rounded-md block w-full text-sm outline-none"
            onFocus={() => {
              setInputFocused(true);
              setFormFixed(true);
            }}
            onBlur={() => setInputFocused(false)}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <SendChatButton inputValue={inputValue} clearInput={clearInput}/>
        </form>
      </section>
    </main>
  );
}