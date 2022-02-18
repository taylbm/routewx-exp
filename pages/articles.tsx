import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      Articles Page
      <div className='flex items-center justify-center'>
        <div
          className='spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    </>
  )
}
