import React from 'react'
import ContentCarousel from '../components/home/ContentCarousel'
import BestSeller from '../components/home/BestSeller'
import NewProduct from '../components/home/NewProduct'
import CategoryProduct from '../components/home/CategoryProduct'

const Home = () => {
  return (
    <div className='pt-8 container mx-auto '>
      <ContentCarousel />
      <p className='text-2xl text-center my-4'>สินค้าขายดี</p>
      <BestSeller />
      <p className='text-2xl text-center my-4'>สินค้าใหม่</p>
      <NewProduct />
      <CategoryProduct/>
    </div>
  )
}

export default Home
