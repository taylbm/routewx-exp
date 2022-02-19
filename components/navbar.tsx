import Link from 'next/link'
import { useRouter } from 'next/router'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navLinks = [
  { name: 'Route App', href: '/routeApp', current: false },
  { name: 'Articles', href: '/articles', current: false },
]

export default function Navbar() {
  const router = useRouter()
  navLinks.forEach((n) => {
    n.current = n.href === router.route
  })

  return (
    <div className='w-full bg-blue-50'>
      <header className='flex h-20 space-x-12 px-6'>
        <Link href='/'>
          <a className='group inline-flex items-center'>
            <h1 className='ml-2 font-medium group-hover:text-blue-600'>
              RouteWX
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
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-700 duration-1000 hover:border-gray-300 hover:text-blue-600',
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium  '
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
