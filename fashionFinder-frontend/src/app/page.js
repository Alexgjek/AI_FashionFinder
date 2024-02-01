import Header from '@/components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <main>
      <section className='pt-32'>
        <div>
          <h1 className='text-6xl font-bold'>
            Your very own<br /> personal designer
          </h1>
          <h2 className='text-xl mt-6'>Makes finding outfits so much easier</h2>

          <form className="mt-6">
            <div className="mt-1 relative rounded-md shadow-sm flex">
              <input
                type="text"
                id="userInput"
                name="userInput"
                placeholder='Message your personal designer...'
                className="p-2 border border-gray-300 rounded-md block w-full text-sm outline-none"
              />
              <button
                type="button"
                className="px-4 py-1.5 border border-gray-300 rounded-r-md bg-slate-500 text-white">
                <FontAwesomeIcon icon={faArrowUp} className='text-white text-xs'/>
                <span className='text-xs'>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
