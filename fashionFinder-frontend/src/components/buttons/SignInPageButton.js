'use client';

export default function NextButton() {
  return (
    <button 
    onClick={()=> {
      console.log("works");
    }}
    className="bg-black text-white py-4 px-3 mt-4 mb-4 w-full font-semibold text-center">
       <span>NEXT</span>
    </button>
  );
}