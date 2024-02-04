import Header from '@/components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import SendChatButton from '@/components/buttons/SendChatButton';

export default function Home() {
  return (
    <main>
      <section className='p-4 pt-32'>
        <div>
          <h1 className='text-6xl font-bold'>
            Your very own<br /> personal designer
          </h1>
          <h2 className='text-xl mt-6'>Makes finding outfits so much easier</h2>
        </div>
        <form className="mt-6 flex shadow-md">
          <input
            type="text"
            placeholder='Message your personal designer...'
            className="p-2 border border-gray-300 rounded-md block w-full text-sm outline-none"
          />
          <SendChatButton />
        </form>
      </section>
    </main>
  );
}
