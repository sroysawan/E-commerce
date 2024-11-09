import React from 'react'
import ProductCard from './ProductCard'
import useEcomStore from '../../store/ecom-store';

const Product = () => {
  const products = useEcomStore((state) => state.products);
  return (
    <div className='grid grid-cols-3 gap-4 '>
      {products?.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
    </div>
  )
}

export default Product
