import Link from 'next/link'


export default function Header(){
  return (
    <header className='bg-white border-b flex justify-between p-4'>
        <div className="flex items-center gap-6">
          <Link href={'/'}>FashionFinder </Link>
          <nav className='flex gap-4'>
          <Link href={'/about'}>About</Link>
          <Link href={'/contact'}>Contact</Link>
          <Link href={'/Albums'}>Albums</Link>
          </nav>
        </div>
        <nav className='flex items-center gap-4'>
          <Link href={'/login'}>Sign In</Link>
          <Link href={'/register'}>Create Account</Link>
        </nav>
    </header>
  )
}