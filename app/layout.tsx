import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kanban Task Management System",
  description: " Take Home exercise from Becoming You Labs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className='relative'>
          <div className='flex'>
            <Navigation />
            <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-20 max-md:pb-14 sm:px-14'>
              <div className='mx-auto w-full max-w-5xl'>{children}</div>
            </section>
          </div>
        </main>
      </body>
    </html>
  )
}
