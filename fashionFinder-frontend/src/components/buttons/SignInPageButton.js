import { useEffect } from 'react';

export default function NextButton({ onLogin }) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        onLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onLogin]);

  return (
    <button
      className="bg-black text-white py-4 px-3 mt-4 mb-4 w-full font-semibold text-center"
      onClick={onLogin}>
      NEXT
    </button>
  );
}
