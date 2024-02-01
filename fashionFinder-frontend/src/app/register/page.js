export default function RegisterPage() {
  return (
    <main className="flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="p-10 text-xl font-bold">Create your personal account</h1>
        <div className="flex gap-3">
        <input 
          type="text"
          placeholder="First name *"
          required
          className="border border-black outline-none p-4"
        />
        <input 
          type="text"
          placeholder="Last name *"
          required
          className="border border-black outline-none p-4"
        />
        </div>
      </div>
    </main>
  );
}
