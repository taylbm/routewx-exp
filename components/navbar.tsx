import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navLinks = [{ name: 'Demo', href: '/demo', current: false }]

export default function Navbar() {
  const router = useRouter()
  navLinks.forEach((n) => {
    n.current = n.href === router.route
  })

  return (
    <div className='w-full bg-zinc-200'>
      <header className='flex h-20 space-x-12 px-6'>
        <Link href='/'>
          <a className='group inline-flex items-center'>
            <Image
              alt='RouteWx logo'
              className='rounded-full duration-200 group-hover:rotate-45'
              src='/favicon.png'
              height={40}
              width={40}
            />
            <h1 className='ml-2 font-medium group-hover:text-green-600'>
              RouteWx
            </h1>
          </a>
        </Link>

        <nav className='flex space-x-6'>
          <div className='hidden items-center space-x-6 sm:flex'>
            {navLinks.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={classNames(
                    item.current
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-700 duration-500 hover:border-gray-600 hover:text-green-900',
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                  )}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </div>
  )
}
