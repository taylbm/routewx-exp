import Link from 'next/link'

/* This example requires Tailwind CSS v2.0+ */
export default function Example() {
  return (
    <div className='bg-white'>
      <div className='sm:b-12 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-base font-semibold uppercase tracking-wide text-amber-900'>
            ahead of the weather curve
          </h2>
          <p className='mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl'>
            RouteWx
          </p>
          <img
            alt='RouteWx logo'
            className='mx-auto h-48 w-48 rounded-full py-4'
            src='/favicon.png'
          />

          <div className='mx-auto mt-6 px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-4xl text-center'>
              <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
                Plan your trips safely, using the latest technology.
              </h2>
              <p className='mt-3 text-xl text-gray-500 sm:mt-4'>
                Powered by Swift Weather Solutions
              </p>
            </div>
          </div>
          <div className='mt-10 bg-white pb-12 sm:pb-16'>
            <div className='relative'>
              <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto max-w-4xl'>
                  <dl className='rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-4'>
                    <div className='flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r'>
                      <dt className='order-2 mt-2 text-lg font-medium leading-6 text-gray-500'>
                        Forecasted Chance of Frozen Precipitation
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-amber-900'>
                        Rain or Snow?
                      </dd>
                    </div>
                    <div className='flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r'>
                      <dt className='order-2 mt-2 text-lg font-medium leading-6 text-gray-500'>
                        Get Forecasted Wind Gusts
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-amber-900'>
                        Windy?
                      </dd>
                    </div>
                    <div className='flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l'>
                      <dt className='order-2 mt-2 text-lg font-medium leading-6 text-gray-500'>
                        Number of Forecast points per hour
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-amber-900'>
                        1.5 million
                      </dd>
                    </div>
                    <div className='flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l'>
                      <dt className='order-2 mt-2 text-lg font-medium leading-6 text-gray-500'>
                        from the EPA <a>https://www.airnow.gov</a> API
                      </dt>
                      <dd className='order-1 text-5xl font-extrabold text-amber-900'>
                        Air Quality
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <h2 className='mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            <span className='block'>Ready to dive in?</span>
            <span className='block'>Try out the demo today.</span>
          </h2>
          <div className='mt-8 flex justify-center'>
            <div className='inline-flex rounded-md shadow'>
              <Link href='/demo'>
                <a className='inline-flex items-center justify-center rounded-md border border-transparent bg-amber-700 px-5 py-3 text-base font-medium text-white hover:bg-green-700'>
                  Go to demo
                </a>
              </Link>
            </div>
            {/* <div className='ml-3 inline-flex'>
              <a
                href='#'
                className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-5 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200'
              >
                Learn more
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
