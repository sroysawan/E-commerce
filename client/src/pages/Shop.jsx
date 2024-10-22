import React, { useEffect } from 'react'
import ProductCard from '../components/cart/ProductCard'
import useEcomStore from '../store/ecom-store'
import SearchCard from '../components/cart/SearchCard'
import CartCard from '../components/cart/CartCard'

const Shop = () => {
  const getProduct = useEcomStore((state)=> state.getProduct)
  const products = useEcomStore((state)=> state.products)
  useEffect(()=>{
    getProduct()
  },[])

  return (
    <div className='flex'>
      {/* SearBar  */}
      <div className='w-1/4 p-4 bg-gray-300 h-screen'>
        <SearchCard/>
      </div>


      {/* Product  */}
      <div className='w-1/2 p-4 h-screen overflow-y-auto'>
        <p className='text-2xl font-bold mb-4'>สินค้าทั้งหมด</p>
        <div className='flex flex-wrap gap-4'>
          {/* Product Cart */}
          {
            products.map((item,index)=>
              <ProductCard key={index} item={item}/>
            )
          }
          {/* Product Cart */}
        </div>
      </div>



      {/* Cart  */}
      <div className='w-1/4 p-4 bg-gray-300 h-screen overflow-y-auto'>
        <CartCard/>
      </div>
    </div>
  )
}

export default Shop
