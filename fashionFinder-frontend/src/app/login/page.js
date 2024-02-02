import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShirt, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import NextButton from '@/components/buttons/SignInPageButton';

export default function LoginPage() {
  return (
    <main>
      <div className="max-w-lg mx-auto">
        <form>
          <h1 className="text-2xl font-bold mt-10 mb-5">Enter your email</h1>
          <input
            type="text"
            placeholder="E-mail address"
            className="border border-black py-4 px-3 outline-none w-full"
          />
          <NextButton />
        </form>
        <span className="text-sm">Make your experience even more fun when signing in</span>

        <div className="p-5 text-xs space-y-3">
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
            <p>Save outfits to albums you create</p>
          </div>
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faShirt} className="w-5 h-5" />
            <p>Set your brand preferences</p>
          </div>
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faSackDollar} className="w-5 h-5" />
            <p>Set your budget</p>
          </div>
        </div>
      </div>
    </main>
  );
}
