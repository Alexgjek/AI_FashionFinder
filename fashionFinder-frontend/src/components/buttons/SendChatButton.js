//newest code 

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function SendChatButton({ inputValue, clearInput, handleClick }) {

  return (
    <button
      type="button"
      className="px-4 py-1.5 border border-gray-300 rounded-r-xl border-l-0"
      onClick={handleClick}
      
    >
      <FontAwesomeIcon icon={faArrowUp} className="text-gray-800 bg-gray-400 px-2 py-3 rounded-xl w-5" />
    </button>
  );
}