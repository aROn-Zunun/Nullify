import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'Nullify',
  description:
    'Zero-knowledge data storage solution built with Next.js and MySQL'
}

export default function RootLayout ({ children }) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <Navbar />
        <main style={{ flex: 1, alignContent: 'center' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
