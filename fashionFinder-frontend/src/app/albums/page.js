'use client';

import React, { useState } from 'react';

export default function AlbumsPage() {
  const [albumName, setAlbumName] = useState('');
  const [albumButtons, setAlbumButtons] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleCreateAlbum = () => {
    setShowModal(true);
  };

  const handleModalInputChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAlbumName('');
  };

  const handleModalSubmit = () => {
    if (albumName.trim() !== '') {
      const newButton = (
        <button className="border border-black/35 bg-white outline-black p-1 rounded-xl mb-2 text-black font-semibold m-3" key={albumName}>
          {albumName}
        </button>
      );
      setAlbumButtons(prevButtons => [...prevButtons, newButton]);
      setShowModal(false);
      setAlbumName('');
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center bg-gray-300 shadow-lg">
        <h1 className="font-bold text-center p-4 text-3xl">Albums</h1>
        <button className="bg-black p-1 rounded-xl mb-2 text-white font-semibold" onClick={handleCreateAlbum}>
          Create Album
        </button>
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-10 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Enter Album Name:</h2>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2 outline-none"
                value={albumName}
                onChange={handleModalInputChange}
                placeholder='Album Name'
              />
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white p-2 rounded-md mr-2 font-semibold" onClick={handleModalSubmit}>Create</button>
                <button className="bg-gray-300 text-gray-800 p-2 rounded-md font-semibold" onClick={handleModalClose}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
          {albumButtons.map(button => button)}
        </div>
    </main>
  );
}

