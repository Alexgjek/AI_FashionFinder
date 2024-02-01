

export default function LoginPage() {
  return (
    <main>
      <div className="px-20 mx-auto">
        <form>
          <h1 className="text-2xl font-bold mt-10 mb-5">
            Enter your email
          </h1>
          <input
            type="text"
            id="emailUserInput"
            placeholder="E-mail address"
            className="border border-black py-4 px-3 outline-none w-full"
          />
          <button type="submit" className="bg-black text-white py-4 px-3 mt-4 mb-4 w-full font-semibold">
            NEXT
          </button>
        </form>
        <span className="text-sm">Make your experience even more fun when signing in</span>
        <div className="p-5 space-y-2 text-xs">
          <p>img Save outfits to albums you create</p>
          <p>img Set your brand preferences</p>
          <p>img Set your budget</p>
        </div>
      </div>
    </main>
  );
}
