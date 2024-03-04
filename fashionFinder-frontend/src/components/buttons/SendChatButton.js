import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function SendChatButton() {
  return (
    <button
      type="button"
      className="px-4 py-1.5 border border-gray-300 rounded-r-md bg-slate-500 text-white">
      <FontAwesomeIcon icon={faArrowUp} className="text-white w-5" />
    </button>
  );
}