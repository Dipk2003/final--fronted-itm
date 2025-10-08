import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Footer, Navbar, ChatbotToggle, ClientProviders } from '@/shared/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Indian Trade Mart - B2B Marketplace',
  description: 'India\'s leading B2B tech marketplace connecting buyers and suppliers across industries',
  keywords: 'B2B marketplace, India, trade, suppliers, buyers, technology, industrial',
  authors: [{ name: 'Indian Trade Mart' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
<main className="pt-16">{children}</main>
          <Footer />
          <ChatbotToggle />
        </ClientProviders>
      </body>
    </html>
  )
}
