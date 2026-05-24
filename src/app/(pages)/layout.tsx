import React from "react";

export const metadata = {
  title: 'Dragonfly Ares',
  description: '',
  openGraph: {
    title: 'Dragonfly Ares',
    description: '',
    siteName: 'Dragonfly Ares',
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
