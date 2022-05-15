import { GetStaticProps } from 'next'
import Head from 'next/head'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import matter from 'gray-matter'
import fs from 'fs'

export const getStaticProps: GetStaticProps = async () => {
  const fileContents = fs.readFileSync('content/privacyPolicy.mdx', 'utf8')

  const { content, data } = matter(fileContents)
  const mdxSource = await serialize(content)

  return { props: { source: mdxSource } }
}

export default function Post({ source }: { source: MDXRemoteSerializeResult }) {
  return (
    <div>
      <Head>
        <title>RouteWx Privacy Policy</title>
      </Head>
      <article className='prose mx-auto flex w-full max-w-3xl flex-col p-4'>
        <MDXRemote {...source} />
      </article>
    </div>
  )
}
