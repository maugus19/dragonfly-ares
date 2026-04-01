import React from "react";

export const metadata = {
  title: 'Dragonfly Ares',
  description: 'Gestión y procesamiento de códigos con scrapper integrado',
  openGraph: {
    title: 'Dragonfly Ares',
    description: 'Gestión y procesamiento de códigos con scrapper integrado',
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
