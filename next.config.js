/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
require('dotenv').config()

module.exports = withPWA(
  withMDX({
    images: {
      domains: [],
    },
    pwa: {
      dest: 'public',
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  })
)
module.exports = {
  env: {
    REACT_APP_MAPBOX_TOKEN: process.env.REACT_APP_MAPBOX_TOKEN,
  },
}
