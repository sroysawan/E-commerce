import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
