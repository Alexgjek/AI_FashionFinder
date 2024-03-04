// newest code 

'use client';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import SendChatButton from '@/components/buttons/SendChatButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const conversationContainerRef = useRef(null);

  const clearInput = () => {
    setInputValue('');
  };

  const handleNewChat = () => {
    setConversation([]);
    setIsSubmitted(false);
  };

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(inputValue)

    setIsSubmitted(true)
    const newMessage = {
      sender: "You",
      message: `${inputValue}`,
      link: false
    };
    const fashionFinderMessage = {
      sender: "FashionFinder",
      message: `Looking for the best match for "${inputValue}"`,
      link: false
    };
    setConversation(prevConversation => [...prevConversation, newMessage, fashionFinderMessage]);
    clearInput();
    
    const response = await fetch("http://localhost:3000/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: inputValue
      })
    });
    const respJson = await response.json();
    const results = [
      {
        sender: "FashionFinder",
        message: `Found ${respJson.length} results matching your query`,
        link: false
      },
      {
        sender: "FashionFinder",
        message: respJson.map(item => item.product_url).join("\n"),
        link: true
      }
    ];
    setConversation(prevConversation => [...prevConversation, ...results]);
  };

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }


  return (
    <div className='m-0 w-full h-screen grid grid-cols-7' style={{ height: 'calc(100vh - 60px)' }}>
      <div className='bg-gray-200 col-span-1 left-0 p-1'>
        <button
          className='w-full rounded-lg p-2 hover:bg-gray-100 flex justify-between items-center'
          onClick={handleNewChat}
        >
          <span className='font-semibold text-sm'>New Chat</span>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </div>
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
                  <div className='font-md'>{conv.message.split("\n").map((part, idx) => conv.link ? (<a key={idx} href={part} target="_blank" style={{display:"block",color:"blue",textDecoration:"underline"}}>{part}</a>) : (<p key={idx}>{part}</p>))}</div>
                  <hr className='bg-black' />
                </>
              </div>
            ))}
          </div>
        ) : (
          <div className='mx-auto'>
            <img src="/FFlogo.png" />
            <h1 className='text-4xl mx-auto font-semibold text-center'>
              Tell us what you're looking for
            </h1>
            <h2 className='font-semibold text-xl text-center p-2 mb-20'>
              We'll find it for you
            </h2>
          </div>
        )}
        <div className="absolute bottom-5 w-5/6 flex justify-center h-16" >
          <input
            type="text"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={e => setInputValue(e.target.value)}
            className="w-2/4 p-4 border rounded-xl outline-none z-10"
            placeholder="Message FashionFinder..."
          />
          <SendChatButton inputValue={inputValue} clearInput={clearInput} handleClick={handleSubmit} />
        </div>

      </div>
    </div>
  );
}
