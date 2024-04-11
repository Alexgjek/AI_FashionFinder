"use client";
import { useState, useRef, useEffect } from "react";
import SendChatButton from "@/components/buttons/SendChatButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare,faSave,faTrashAlt, faPlus,faBars } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Header from "@/components/Header";
import ReviewModal from "@/components/ReviewModal/ReviewModal";
import SearchBar from "@/components/SearchBar";
import AlbumSort from "@/components/sorting/albumSorting/AlbumSort";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [chatName, setChatName] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
  const [unsavedChangesModal, setUnsavedChangesModal] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [saveChatModal, setSaveChatModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userAlbums, setUserAlbums] = useState([]);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const conversationContainerRef = useRef(null);
  const [outfit, setOutfit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [sortType, setSortType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(0); // Initialize with 0 or some default value
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if window is defined before accessing window.innerWidth
    if (typeof window !== 'undefined') {
    setWindowWidth(window.innerWidth);
    }
    }, []);
    
    
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        // Close the menu toggle when switching from small screen to full screen
        if (window.innerWidth > 768) {
          setIsMenuOpen(false);
        }
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  useEffect(() => {
    const filtered = userAlbums.filter((userAlbums) =>
      userAlbums.albumName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  }, [searchQuery, userAlbums]);

  const handleSortChange = async (option) => {
    try {
      const response = await axios.get("/api/users/getUserAlbums");
      const fetchedAlbums = response.data.albums;

      let sortedAlbums = [...fetchedAlbums];

      if (option === "alphabetical") {
        sortedAlbums.sort((a, b) => a.albumName.localeCompare(b.albumName));
      } else if (option === "ascending") {
        sortedAlbums.sort(
          (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
        );
      } else if (option === "descending") {
        sortedAlbums.sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );
      }

      setSortType(option);

      setUserAlbums(sortedAlbums);
    } catch (error) {
      console.log(error);
    }
  };

  //angjelos code
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("/api/users/getChats");
        const { savedChats } = response.data;
        setSavedChats(savedChats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [isUnsavedChanges]);

  const handleUnload = (e) => {
    if (isUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  const isConversationIdentical = () => {
    const existingChat = savedChats.find(
      (chat) => chat.chatName.toLowerCase() === chatName.toLowerCase()
    );
    if (existingChat) {
      return (
        existingChat.messages.length === conversation.length &&
        existingChat.messages.every(
          (msg, index) => msg.message === conversation[index].message
        )
      );
    }
    return false;
  };

  const resetAiMemory = async () => {
    try {
      const response = await axios.post("http://localhost:8000/resetAiMemory");
      console.log(response.data.message); // Log success message
      // Handle success scenario
    } catch (error) {
      console.error("Error resetting AI memory:", error);
      // Handle error scenario
    }
  };

  const saveChat = async () => {
    try {
      const lowerCaseChatName = chatName.toLowerCase();
      const existingChatIndex = savedChats.findIndex(chat => chat.chatName.toLowerCase() === lowerCaseChatName);
  
      if (existingChatIndex !== -1) {
        // Update existing chat
        const existingMessages = savedChats[existingChatIndex].messages;
        const newMessages = conversation.filter(message => !existingMessages.includes(message));
        
        const response = await axios.put('/api/users/updatedChats', {
          chatName: lowerCaseChatName,
          messages: newMessages
        });
        const { message, success } = response.data;
        if (success) {
          console.log(message);
          setSavedChats(prevChats => {
            const updatedChats = [...prevChats];
            updatedChats[existingChatIndex].messages = existingMessages.concat(newMessages);
            return updatedChats;
          });
          // Reset input values and close modal
          setConversation([]);
          setIsSubmitted(false);
          setChatName('');
          toggleModal();
          setIsUnsavedChanges(false); // Reset unsaved changes state
        } else {
          console.error(message);
        }
      } else {
        // Save new chat
        const response = await axios.post('/api/users/saveChats', {
          chatName: lowerCaseChatName,
          messages: conversation
        });
        
        const { message, user } = response.data;
        console.log(message);
        setSavedChats(user.savedChats);
        
        // Reset input values and close modal
        setConversation([]);
        setIsSubmitted(false);
        setChatName('');
        toggleModal();
        setIsUnsavedChanges(false); // Reset unsaved changes state
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await axios.delete(
        `/api/users/deleteChats?chatId=${chatId}`
      );
      const { success, message } = response.data;
      if (success) {
        setSavedChats(savedChats.filter((chat) => chat._id !== chatId));
        console.log(message);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const confirmDeleteChat = (chatId) => {
    setDeleteIndex(chatId);
  };

  const handleConfirmDeleteChat = async () => {
    if (deleteIndex) {
      console.log("Deleting chat:", deleteIndex);
      try {
        await deleteChat(deleteIndex);
        if (savedChats.length === 1 || savedChats.length > 1) {
          // If the last remaining saved chat is deleted, switch back to New Chat mode
          handleNewChat();
        }
        setDeleteIndex(null); // Reset deleteIndex after successful deletion
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }
  };

  const loadSavedChat = (savedChat) => {
    if (isUnsavedChanges) {
      setUnsavedChangesModal(true);
    } else {
      setConversation(savedChat.messages);
      setChatName(savedChat.chatName); // Set the chat name
      setIsSubmitted(true);
      setIsUnsavedChanges(false);
    }
  };

  //start of my code
  const handleAddButton = async (
    productUrl,
    imageUrl,
    price,
    color,
    brand,
    rating
  ) => {
    try {
      const response = await axios.get("/api/users/getUserAlbums");
      setUserAlbums(response.data.albums);
      setOutfit({ productUrl, imageUrl, price, color, brand, rating });
      setShowModal(true);
      console.log(productUrl);
      console.log(response);
      console.log("price: " + price);
      console.log("color: " + color);
      console.log("brand: " + brand);
      console.log("rating: " + rating);
    } catch (error) {
      console.error("Error fetching user albums:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAlbums([]);
  };
  const clearInput = () => {
    setInputValue("");
  };

  //modified to angjelos version
  const handleNewChat = () => {
    if (isUnsavedChanges) {
      setUnsavedChangesModal(true);
    } else {
      setConversation([]);
      setIsSubmitted(false);
      resetAiMemory();
      setChatName("");
      setIsUnsavedChanges(false);
    }
  };

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue.trim()) {
      return; // Exit early if input is empty
    }

    console.log(inputValue);

    setIsSubmitted(true);
    const newMessage = {
      sender: "You",
      message: `${inputValue}`,
      link: false,
    };
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    clearInput();

    try {
      const userInfoResponse = await axios.get(
        "http://localhost:3000/api/users/userInfo"
      );
      const userInfo = userInfoResponse.data;
      setIsUnsavedChanges(true);
      setIsFetchingResponse(true);
      const response = await axios.post("http://localhost:8000/getAIResponse", {
        prompt: inputValue,
        userInfo: userInfo,
      });
      const respJson = response.data;
      console.log(respJson);

      let attributes = {};
      let beginSearch = false;
      if (respJson.ai_response.indexOf("BEGIN_SEARCH") > -1) {
        attributes = JSON.parse(respJson.ai_response.match(/\{(.*)\}/)[0].replace(/\n/g,''));
        attributes.brand = attributes.brand || "";
        beginSearch = true;
      }
      console.table(attributes);

      const fashionFinderMessage = {
        sender: "FashionFinder",
        message: beginSearch
          ? "Searching for the best match..."
          : respJson.ai_response,
        // ? respJson.ai_response : "An error occurred while processing the request",
        link: false,
      };

      setConversation((prevConversation) => [
        ...prevConversation,
        fashionFinderMessage,
      ]);

      if (beginSearch) {
        //call Search API to query the MongoDB
        const matches = await axios.post("http://localhost:8000/searchItems", {
          attributes: attributes,
          userInfo: userInfo,
        });
        console.log("testing" + matches);

        let matchMessage = {};
        if (matches.data.length > 0) {
          matchMessage = {
            sender: "FashionFinder",
            message: matches.data
              .map(
                (item) =>
                  item.product_url +
                  "^" +
                  item.image_url +
                  "^" +
                  item.price +
                  "^" +
                  item.color +
                  "^" +
                  item.brand +
                  "^" +
                  item.rating
              )
              .join("\n"),
            link: true,
            //rateExperience: true, // to rate experience
            //ratingPrompt: "How would you rate your experience with FashionFinder? (1-5 stars)" //
          };
        } else {
          matchMessage = {
            sender: "FashionFinder",
            message: "Could not find any matches",
            link: false,
          };
        }

        const fashionFinderReviewMessage = {
          sender: "FashionFinder",
          message: "Leave us a review!",
          reviewMessage: "Thank you for your review!",
          action: "review",
        };

        console.log(matchMessage);
        setConversation((prevConversation) => [
          ...prevConversation,
          matchMessage,
          fashionFinderReviewMessage,
        ]); //added tis
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setIsFetchingResponse(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const handleCreateAlbum = () => {
    console.log("Create Album");
    setShowCreateAlbumModal(true);
    console.log(showCreateAlbumModal);
    handleSortChange(sortType);
    setShowModal(false);
    setErrorMessage("");
  };

  const handleModalInputChange = (e) => {
    setAlbumName(e.target.value);
    setErrorMessage("");
  };

  const handleModalSubmit = async () => {
    const trimmedAlbumName = albumName.trim();
    if (!trimmedAlbumName) {
      setErrorMessage("Album name cannot be empty");
      return;
    }
    if (trimmedAlbumName[0] === " ") {
      setErrorMessage("Album name cannot start with a space");
      return;
    }
    try {
      const response = await axios.post("/api/users/createAlbums", {
        albumName: trimmedAlbumName,
      });
      setUserAlbums((prevAlbums) => [
        ...prevAlbums,
        { albumName: trimmedAlbumName },
      ]);
      handleSortChange(sortType);
      setShowCreateAlbumModal(false);
      setShowModal(true);
      setAlbumName("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Album already exists");
        } else {
          setErrorMessage("Failed to create album");
        }
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(true);
    setAlbumName("");
    setShowCreateAlbumModal(false);
    setErrorMessage("");
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleModalSubmit();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [albumName]);

  const toggleAlbumSelection = (albumName) => {
    setSelectedAlbums((prevSelected) => {
      if (!prevSelected) {
        console.error("prevSelected is undefined");
        return [];
      }

      const newSelected = prevSelected.includes(albumName)
        ? prevSelected.filter((name) => name !== albumName)
        : [...prevSelected, albumName];
      console.log(newSelected);
      return newSelected;
    });
  };

  const handleConfirm = async () => {
    try {
      const { productUrl, imageUrl, price, color, brand, rating } = outfit;
      await axios.post("http://localhost:3000/api/users/addOutfitToAlbum", {
        selectedAlbums,
        outfits: [
          { outfitUrl: productUrl, imageUrl, price, color, brand, rating },
        ],
      });

      console.log("Outfit added to albums successfully");
    } catch (error) {
      console.log("Failed to add outfit to albums:", error);
    }

    closeModal();
  };
  const toggleModal = () => {
    setSaveChatModal(!saveChatModal);
  };

  const toggleReviewModal = () => {
    setShowReviewModal(!showReviewModal);
  };

  const handleChatNameKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveChat();
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };
  
  // to check for review in each conv 
  const onReviewSubmitted = (submitted) => {
    let reviewConversationIndex = -1;
    conversation.forEach((conv, index) => {
      if(conv.action == "review") {
        reviewConversationIndex = index;
      }
    })
    if(reviewConversationIndex < 0) {
      return;
    }
    conversation[reviewConversationIndex].submitted = submitted;
    setConversation(conversation)
  }
 return(
  <main>
  <Header />
  <div className='m-0 w-full h-screen grid grid-cols-7' style={{ height: 'calc(100vh - 60px)' }}>
    <div className={`${windowWidth > 768 ? 'bg-gray-200' : 'bg-gray-100'} col-span-1 left-0 p-1 overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 60px)', width: isMenuOpen ? '125px' : 'auto' }}>
      {windowWidth > 768 ? (
        <div className='bg-gray-200 col-span-1 left-0 p-1'>
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
          {isMenuOpen && (
            <div className='bg-gray-200 p-1'>
              <button
                className='w-full rounded-lg p-2 hover:bg-gray-100 flex justify-between items-center'
                onClick={handleNewChat}
              >
                <span className='font-semibold text-sm'>New Chat</span>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              {savedChats.slice().reverse().map((chat, index) => (
                <div key={index} className="saved-chat" style={{ padding: '5px', margin: '5px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }} onClick={() => loadSavedChat(chat)}>
                  <div>
                    <p>
                      <strong>Chat:</strong>{" "}
                      {chat.chatName.length > 50
                        ? chat.chatName.substring(0, 50) + "..."
                        : chat.chatName}
                    </p>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={() => confirmDeleteChat(chat._id)}
                      className="text-red-300 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {windowWidth > 768 && !isMenuOpen && savedChats.slice().reverse().map((chat, index) => (
        <div key={index} className="saved-chat" style={{ padding: '5px', margin: '5px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }} onClick={() => loadSavedChat(chat)}>
          <div>
            <p>
              <strong>Chat:</strong>{" "}
              {chat.chatName.length > 50
                ? chat.chatName.substring(0, 50) + "..."
                : chat.chatName}
            </p>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={() => confirmDeleteChat(chat._id)}
              className="text-red-300 cursor-pointer"
            />
          </div>
        </div>
      ))}

        </div>




        <div className="col-span-6 flex flex-col items-center justify-center">
          {isSubmitted ? (
            <div
              ref={conversationContainerRef}
              className="absolute top-20 w-4/6 p-2"
              style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
            >
              {conversation.map((conv, index) => (
                <div key={index} className="p-2">
                  <p className="font-bold">{conv.sender}</p>
                  <>
                    {conv.link ? (
                      <div>
                        <p className="mb-2">Here's what I found:</p>
                        <div className="ai-result-container">
                          {conv.message.split("\n").map((part, idx) => (
                            <div className="ai-result relative group" key={idx}>
                              <img
                                className="ai-image"
                                src={part.split("^")[1]}
                                alt="Result"
                              />
                              <div className="flex gap-3 bg-white mb-2">
                                <a
                                  href={part.split("^")[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button-go p-2 bg-transparent text-gray-800 font-semibold"
                                >
                                  Go
                                </a>
                                <button
                                  onClick={() =>
                                    handleAddButton(
                                      part.split("^")[0],
                                      part.split("^")[1],
                                      part.split("^")[2],
                                      part.split("^")[3],
                                      part.split("^")[4],
                                      part.split("^")[5]
                                    )
                                  }
                                  className="button-add p-2 bg-transparent text-gray-800 font-semibold"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : conv.action == "review" ?
                    (<div className='font-md'>
                      <button disabled={conv.submitted} onClick={toggleReviewModal} className={conv.submitted ? ' text-green-500' : 'text-blue-600'}>
                        {conv.submitted ? conv.reviewMessage : conv.message}
                      </button>
                    </div>) :
                    (<div className='font-md'><p>{conv.message}</p></div>)}
                  </>
                  <hr className="bg-black" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto">
              <img src="/FFlogo.png" alt="FashionFinder Logo" />
              <h1 className="text-4xl mx-auto font-semibold text-center">
                Tell us what you're looking for
              </h1>
              <h2 className="font-semibold text-xl text-center p-2 mb-20">
                We'll find it for you
              </h2>
            </div>
          )}
        
          <div className="absolute bottom-5 w-4/6 flex justify-center h-16">
            <textarea
              type="text"
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-2/4 p-4 rounded-l-xl outline-none z-10 bg-transparent border border-gray-300 border-r-0 resize-none"
              placeholder={
                isFetchingResponse
                  ? "Waiting for FashionFinder response..."
                  : "Message FashionFinder..."
              }
              disabled={isFetchingResponse}
            />
            <SendChatButton
              inputValue={inputValue}
              clearInput={clearInput}
              handleClick={handleSubmit}
            />
            <button
              onClick={() => toggleModal()}
              onKeyDown={handleChatNameKeyDown}
              disabled={
                conversation.length === 0 ||
                isFetchingResponse ||
                (savedChats.some(
                  (chat) =>
                    chat.chatName.toLowerCase() === chatName.toLowerCase()
                ) &&
                  isConversationIdentical())
              }
              className="border border-gray-300 bg-slate-500 text-white rounded-lg px-4 py-2 ml-2 h-full"
              style={{ width: "120px" }}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Chat
            </button>
          </div>
          
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50 gap-2 p-5">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-4">
                Which album would you like to add to?
              </h2>
              <div className="inline-flex mb-3 gap-2">
                <AlbumSort onSortChange={handleSortChange} />
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="overflow-y-auto max-h-[20vh] h-[20vh]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4">
                  {userAlbums
                    .filter((album) =>
                      album.albumName
                        .toLowerCase()
                        .startsWith(searchQuery.toLowerCase())
                    )
                    .map((album, index) => (
                      <div key={index} className="mb-2">
                        <button
                          className={`border border-gray-200 shadow-md text-gray-800 px-4 py-2 rounded-md w-full truncate flex-1 overflow-ellipsis ${
                            selectedAlbums.includes(album.albumName)
                              ? "bg-green-400 opacity-50"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            toggleAlbumSelection(album.albumName)
                          }
                        >
                          {album.albumName}
                        </button>
                      </div>
                  
                      ))}
                  </div>
                </div>
                <div className="flex justify-center mt-4 gap-3 items-center">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md w-2/5 font-semibold text-center"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md w-2/5 font-semibold text-center"
                  >
                    Cancel
                  </button>
                  <button
                    className="text-green bg-green-400 rounded-full w-8 h-8 inline"
                    onClick={handleCreateAlbum}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            </div>
            
          )}
        </div>
      {deleteIndex && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="bg-white p-10 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this chat?
            </h2>
            <div className="flex items-center justify-center">
              <button
                className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold"
                onClick={handleConfirmDeleteChat}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold"
                onClick={() => setDeleteIndex(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {unsavedChangesModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="bg-white p-10 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to leave? You have unsaved changes.
            </h2>
            <div className="flex items-center justify-center">
              <button
                className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold"
                onClick={() => {
                  setConversation([]);
                  setIsUnsavedChanges(false);
                  setUnsavedChangesModal(false);
                  resetAiMemory();
                  setIsSubmitted(false);
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold"
                onClick={() => setUnsavedChangesModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {saveChatModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="bg-white p-10 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Enter Chat Name</h2>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              onKeyDown={handleChatNameKeyDown}
              className="border border-gray-300 rounded-md px-4 py-2 mb-2 w-full"
              placeholder="Enter chat name"
            />
            <div className="flex items-center justify-center">
              <button
                className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold"
                onClick={saveChat}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showReviewModal && (<ReviewModal onClose={(closed) => {setShowReviewModal(false); onReviewSubmitted(closed)}} />)} {/* onClose takes the parameter "closed" from the ReviewModal.js file  */}
      {showCreateAlbumModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="bg-white p-10 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Enter Album Name</h2>
            {errorMessage && (
              <p className="text-sm text-red-500 mb-2">{errorMessage}</p>
            )}
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 mb-2 outline-none"
              value={albumName}
              onChange={handleModalInputChange}
              placeholder="Album Name"
            />
            <div className="flex items-center justify-center">
              <button
                className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold disabled:opacity-50"
                onClick={handleModalSubmit}
                disabled={!albumName}
              >
                Create
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold"
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>      

        
      )}
              </div>

    </main>
  );
}
