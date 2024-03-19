'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import axios from 'axios';
import Header from '@/components/Header';
import AlbumSort from '@/components/sorting/albumSorting/AlbumSort';
import SearchBar from '@/components/SearchBar';

export default function AlbumsPage() {
  const [albumName, setAlbumName] = useState('');
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteAlbumName, setDeleteAlbum] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editAlbumName, setEditAlbumName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [oldAlbumName, setOldAlbumName] = useState('');
  const [sortType, setSortType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  

  const handleSortChange = async (option) => {
    try {
      const response = await axios.get('/api/users/getUserAlbums');
      const fetchedAlbums = response.data.albums;
      
      let sortedAlbums = [...fetchedAlbums];
      
      if (option === 'alphabetical') {
        sortedAlbums.sort((a, b) => a.albumName.localeCompare(b.albumName));
      } else if (option === 'ascending') {
        sortedAlbums.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
      } else if (option === 'descending') {
        sortedAlbums.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      }
      
      setSortType(option);

      setAlbums(sortedAlbums);
    } catch (error) {
      console.log(error);
    }
  };
  
  
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('/api/users/getUserAlbums');
      setAlbums(response.data.albums);
      setFilteredAlbums(response.data.albums);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query); 
  };

  useEffect(() => {
    const filtered = albums.filter(album => album.albumName.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredAlbums(filtered);
  }, [searchQuery,albums]);
  
  const handleCreateAlbum = () => {
    setShowModal(true);
    setErrorMessage('');
  };

  const handleModalInputChange = (e) => {
    setAlbumName(e.target.value);
    setErrorMessage('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAlbumName('');
    setEditAlbumName('');
    setDeleteAlbum('');
    setEditMode(false);
    setErrorMessage('');
  };

  const handleModalSubmit = async () => {
    const trimmedAlbumName = albumName.trim();
    if (!trimmedAlbumName) {
      setErrorMessage('Album name cannot be empty');
      return;
    }
    if (trimmedAlbumName[0] === ' ') {
      setErrorMessage('Album name cannot start with a space');
      return;
    }
    try {
      const response = await axios.post('/api/users/createAlbums', { albumName: trimmedAlbumName });
      setAlbums(prevAlbums => [...prevAlbums, { albumName: trimmedAlbumName }]);
      handleSortChange(sortType);
      setShowModal(false);
      setAlbumName('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage('Album already exists');
        } else {
          setErrorMessage('Failed to create album');
        }
      } else {
        setErrorMessage('Network error. Please try again.');
      }
    }
  };

  const handleDeleteAlbum = async (albumName) => {
    setDeleteAlbum(albumName);
    setShowModal(true);
  };

  const confirmDeleteAlbum = async () => {
    if (deleteAlbumName) {
      try {
        const response = await axios.delete(`/api/users/deleteAlbums?albumName=${deleteAlbumName}`);
        setShowModal(false);
        setDeleteAlbum("");
        await fetchAlbums();
        handleSortChange(sortType);
      } catch (error) {
        console.log("Failed to delete album", error);
      }
    }
  };

  const handleEditAlbum = (albumName) => {
    setOldAlbumName(albumName);
    setEditAlbumName('');
    setEditMode(true);
    setShowModal(true);
    setErrorMessage('');
  };

  const handleEditInputChange = (e) => {
    setEditAlbumName(e.target.value);
    setErrorMessage('');
  };

  const handleEditModalSubmit = async () => {
    const trimmedEditAlbumName = editAlbumName.trim();
    if (!trimmedEditAlbumName) {
      setErrorMessage('Album name cannot be empty');
      return;
    }
    if (trimmedEditAlbumName[0] === ' ') {
      setErrorMessage('Album name cannot start with a space');
      return;
    }
    const existingAlbum = albums.find(album => album.albumName.toLowerCase() === trimmedEditAlbumName.toLowerCase());
    if (existingAlbum) {
      setErrorMessage('Album already exists');
      return;
    }
    try {
      const response = await axios.put('/api/users/editAlbumName', { oldName: oldAlbumName, newName: trimmedEditAlbumName });
      setShowModal(false);
      setEditAlbumName('');
      setEditMode(false);
      await fetchAlbums();
      handleSortChange('');
    } catch (error) {
      console.log("Failed to edit album", error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (editMode) {
          handleEditModalSubmit();
        } else {
          handleModalSubmit();
        }
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [editMode, editAlbumName, albumName]);

  return (
    <main>
      <Header />
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"></div>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-md shadow-lg">
            {deleteAlbumName ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete this album?</h2>
                <div className="flex items-center justify-center">
                  <button className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold" onClick={confirmDeleteAlbum}>Yes</button>
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" onClick={handleModalClose}>No</button>
                </div>
              </>
            ) : editMode ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Edit Album Name</h2>
                {errorMessage && <p className='text-sm text-red-500 mb-2'>{errorMessage}</p>}
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 mb-2 outline-none"
                  value={editAlbumName}
                  onChange={handleEditInputChange}
                  placeholder='New Album Name'
                />
                <div className="flex items-center justify-center">
                  <button className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold w-1/3 disabled:opacity-50" onClick={handleEditModalSubmit} disabled={!editAlbumName}>Save</button>
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold w-1/3" onClick={handleModalClose}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">Enter Album Name</h2>
                {errorMessage && <p className='text-sm text-red-500 mb-2'>{errorMessage}</p>}
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 mb-2 outline-none"
                  value={albumName}
                  onChange={handleModalInputChange}
                  placeholder='Album Name'
                />
                <div className="flex items-center justify-center">
                  <button className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold disabled:opacity-50" onClick={handleModalSubmit} disabled={!albumName}>Create</button>
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" onClick={handleModalClose}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center bg-gray-300 shadow-lg p-4">
        <h1 className="font-bold text-3xl mb-4">Albums</h1>
        <button className="bg-black text-white px-4 py-2 rounded-xl mb-4 font-semibold" onClick={handleCreateAlbum}>
          Create Album
        </button>
      </div>
      <div className='inline-flex gap-3'>
        <AlbumSort albums={albums} onSortChange={handleSortChange} />
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-3 gap-4 m-5">
        {filteredAlbums.map((album, index) => (
          album && album.albumName && (
            <div key={index} className="flex bg-white rounded-lg shadow-md p-4 relative text-center">
              <Link
                href={`/albums/${album.albumName}`}
                className="text-lg font-semibold mb-2 hover:opacity-70 truncate flex-1"
                style={{ textOverflow: 'ellipsis' }}>
                {album.albumName}
              </Link>
              <div className='flex justify-end absolute bottom-0 right-0 space-x-2 mr-2'>
                <button
                title='Share Album'>
                  <FontAwesomeIcon icon={faShareFromSquare} className='text-gray-500'/>
                </button>
                <button
                  className="text-white"
                  onClick={() => handleEditAlbum(album.albumName)}
                  title='Edit Album'>
                  <FontAwesomeIcon icon={faPenToSquare} className='text-blue-500' />
                </button>
                <button
                  className="text-white"
                  onClick={() => handleDeleteAlbum(album.albumName)}
                  title='Delete Album'>
                  <FontAwesomeIcon icon={faTrashCan} className='text-red-500' />
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </main>
  );
}


