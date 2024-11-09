import React, { useEffect, useState } from 'react'
import { listProductBy } from '../../api/product'
import ProductCard from '../cart/ProductCard'
import SwiperShowProduct from '../../utils/SwiperShowProduct'
import { SwiperSlide } from 'swiper/react'
const NewProduct = () => {

    const [data, setData] = useState([])

    useEffect(()=>{
        loadData()
    },[])
    const loadData = () => {
        listProductBy('updatedAt','desc',7)
        .then((res)=>{
            console.log(res.data)
            setData(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
  return (
        <SwiperShowProduct>
        {
          data?.map((item,index)=>
            <SwiperSlide> 
              <ProductCard key={index} item={item}/>
            </SwiperSlide>
          )
        }
      </SwiperShowProduct>
  )
}

export default NewProduct
