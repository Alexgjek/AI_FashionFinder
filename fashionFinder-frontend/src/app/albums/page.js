'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

export default function AlbumsPage() {
  const [albumName, setAlbumName] = useState('');
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); 

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
      const newAlbum = { name: albumName, outfits: [] };
      setAlbums(prevAlbums => [...prevAlbums, newAlbum]);
      setShowModal(false);
      setAlbumName('');
    }
  };

  const handleDeleteAlbum = (index) => {
    setDeleteIndex(index); 
    setShowModal(true); 
  };

  const confirmDeleteAlbum = () => {
    setAlbums(prevAlbums => prevAlbums.filter((_, i) => i !== deleteIndex)); 
    setShowModal(false); 
    setDeleteIndex(null); 
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center bg-gray-300 shadow-lg p-4">
        <h1 className="font-bold text-3xl mb-4">Albums</h1>
        <button className="bg-black text-white px-4 py-2 rounded-xl mb-4 font-semibold" onClick={handleCreateAlbum}>
          Create Album
        </button>
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-10 rounded-md shadow-lg">
              {deleteIndex !== null ? ( 
                <>
                  <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete this album?</h2>
                  <div className="flex items-center justify-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 font-semibold" onClick={confirmDeleteAlbum}>Yes</button>
                    <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" onClick={handleModalClose}>No</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-2">Enter Album Name</h2>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 mb-2 outline-none"
                    value={albumName}
                    onChange={handleModalInputChange}
                    placeholder='Album Name'
                  />
                  <div className="flex items-center justify-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 font-semibold" onClick={handleModalSubmit}>Create</button>
                    <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" onClick={handleModalClose}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 m-5">
        {albums.map((album, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 relative">
            <h2 className="text-center text-lg font-semibold mb-2">{album.name}</h2>
            <button
              className="absolute bottom-0 right-0 bg-transparent text-white px-4 py-2 rounded-md font-semibold"
              onClick={() => handleDeleteAlbum(index)}
              title='Delete Album'
            >
              <FontAwesomeIcon icon={faTrashCan} className='text-red-500' />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
