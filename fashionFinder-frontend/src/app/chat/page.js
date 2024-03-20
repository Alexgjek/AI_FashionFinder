
'use client';
import { useState, useRef, useEffect } from 'react';
import SendChatButton from '@/components/buttons/SendChatButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Header from "@/components/Header";


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

    setIsSubmitted(true);
    const newMessage = {
      sender: "You",
      message: `${inputValue}`,
      link: false
    };
    setConversation(prevConversation => [...prevConversation, newMessage]);
    clearInput();

    try {
      const userInfoResponse = await axios.get('http://localhost:3000/api/users/userInfo');
      const userInfo = userInfoResponse.data;
      const response = await axios.post('http://localhost:8000/getAIResponse', {
        prompt: inputValue,
        userInfo: userInfo,
      });
      const respJson = response.data;
      console.log(respJson);

      let attributes = {};
      let beginSearch = false;
      if (respJson.ai_response.indexOf("BEGIN_SEARCH") > -1) {
        attributes = JSON.parse(respJson.ai_response.replace("BEGIN_SEARCH", ""));
        beginSearch = true;
      }
      console.table(attributes);

      const fashionFinderMessage = {
        sender: "FashionFinder",
        message: beginSearch ? "Searching for the best match..." : respJson.ai_response,
        // ? respJson.ai_response : "An error occurred while processing the request",
        link: false
      };

      setConversation(prevConversation => [...prevConversation, fashionFinderMessage]);

      if (beginSearch) {
        //call Search API to query the MongoDB
        const matches = await axios.post('http://localhost:8000/searchItems', {
          attributes: attributes,
          userInfo: userInfo,
        });
        console.log("testing" + matches)

        let matchMessage = {};
        if (matches.data.length > 0) {
          matchMessage = {
            sender: "FashionFinder",
            message: matches.data.map(item => item.product_url + "^" + item.image_url).join("\n"),
            link: true,
            //rateExperience: true, // to rate experience 
          //ratingPrompt: "How would you rate your experience with FashionFinder? (1-5 stars)" // 
          }
        } else {
          matchMessage = {
            sender: "FashionFinder",
            message: "Could not find any matches",
            link: false
          }
        }
        console.log(matchMessage);
        setConversation(prevConversation => [...prevConversation, matchMessage]);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };


  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }


  return (
    <main>
      <Header />
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
                  <p className='font-bold'>{conv.sender}</p>
                  <>
                    {conv.link ? (
                      <div className="ai-result-container">
                        {/* {conv.message.split("\n").map((part, idx) => <div className="ai-result"><a key={idx} href={part.split("^")[0]} target="_blank" className="ai-link" style={{ display: "block", color: "blue", textDecoration: "underline" }}>{part.split("^")[0]}</a><img className="ai-image" key={idx} src={part.split("^")[1]} /></div>)} */}
                        {conv.message.split("\n").map((part, idx) => <div className="ai-result"><a key={idx} href={part.split("^")[0]} target="_blank" className="ai-link" style={{ display: "block", color: "blue", textDecoration: "underline" }}><img className="ai-image" key={idx} src={part.split("^")[1]} /></a></div>)}
                      </div>
                    ) : (
                      <div className='font-md'><p>{conv.message}</p></div>
                    )}
                  </>
                  <hr className='bg-black' />
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
    </main>

  );
}