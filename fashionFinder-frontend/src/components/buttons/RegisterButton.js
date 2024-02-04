import { useEffect } from 'react';

export default function RegisterButton({ onSignup }) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        onSignup();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onSignup]);

  return (
    <button
      className="bg-black text-white py-4 font-semibold text-center hover:bg-gray-700"
      onClick={onSignup}>
      REGISTER
    </button>
  );
}
