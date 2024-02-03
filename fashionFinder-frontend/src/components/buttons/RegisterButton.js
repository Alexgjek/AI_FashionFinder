export default function RegisterButton({ onSignup }){
  return (
    <button
    className="bg-black text-white py-4 font-semibold text-center"
    onClick={onSignup}>
      REGISTER
  </button>
  );
  
}