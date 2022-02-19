import Link from 'next/link'
import TwitterIcon from 'components/icons/social/Twitter'

const curYear = new Date().getFullYear()

const navigation = {
  main: [{ name: 'Privacy Policy', href: '/privacyPolicy' }],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/routewx',
      icon: TwitterIcon,
    },
  ],
}

export default function Example() {
  return (
    <footer className='bg-white'>
      <div className='mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8'>
        <nav
          className='-mx-5 -my-2 flex flex-wrap justify-center'
          aria-label='Footer'
        >
          {navigation.main.map((item) => (
            <div key={item.name} className='px-5 py-2'>
              <Link href={item.href}>
                <a className='text-base text-gray-500 hover:text-gray-900'>
                  {item.name}
                </a>
              </Link>
            </div>
          ))}
        </nav>
        <div className='mt-8 flex justify-center space-x-6'>
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className='transform fill-gray-400 transition-all duration-75 hover:scale-125 hover:fill-amber-700'
            >
              <span className='sr-only'>{item.name}</span>
              <item.icon aria-hidden='true' />
            </a>
          ))}
        </div>
        <p className='mt-8 text-center text-base text-gray-400'>
          &copy; {curYear} RouteWX
        </p>
      </div>
    </footer>
  )
}
