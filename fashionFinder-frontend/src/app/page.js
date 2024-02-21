'use client';
import { useState } from 'react';
import SendChatButton from '@/components/buttons/SendChatButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'


export default function Home() {
  
  const [inputValue, setInputValue] = useState('');

  const clearInput = () => setInputValue('');
  
  return (
    <div className='m-0 w-full h-screen grid grid-cols-7' style={{ height: 'calc(100vh - 60px)' }}>
      <div className='bg-gray-200 col-span-1 left-0 p-1'>
      <button className='w-full rounded-lg p-2 hover:bg-gray-100 flex justify-between items-center'>
        <span className='font-semibold text-sm'>New Chat</span>
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
      </div>
      <div className='col-span-6 flex flex-col items-center justify-center'>
        <div className='mx-auto'>
        <h1 className='text-4xl mx-auto font-semibold text-center'>
          Tell us what you're looking for
        </h1>
        <h2 className='font-semibold text-xl text-center p-2'>
          We'll find it for you
        </h2>
        </div>
        <div className="absolute bottom-5 w-full flex justify-center h-16">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-2/4 p-4 border rounded-xl outline-none z-10"
            placeholder="Message FashionFinder..."
          />
          <SendChatButton inputValue={inputValue} clearInput={clearInput}/>
        </div>
      </div>
    </div>
  );
}