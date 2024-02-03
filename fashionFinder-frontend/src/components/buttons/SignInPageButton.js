'use client';

export default function NextButton({ onLogin }) {
  return (
    <button 
    className="bg-black text-white py-4 px-3 mt-4 mb-4 w-full font-semibold text-center"
    onClick={onLogin}>
       NEXT
    </button>
  );
}