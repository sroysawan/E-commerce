import React, {useState,useEffect } from 'react'
import { listUserCart,saveAddress } from '../../api/user'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {numberFormat} from '../../utils/number'
const SummaryCard = () => {

    const token = useEcomStore((state)=> state.token)
    const carts = useEcomStore((state)=> state.carts)

    const [products,setProducts] = useState([])
    const [cartTotal,setCartTotal] = useState(0)

    const [address,setAddress] = useState('')
    const [addressSaved,setAddressSaved] = useState(false)

    const navigate = useNavigate()
    useEffect(()=>{
        if(carts.length === 0){
            navigate('/shop')
        }
    },[])
    useEffect(()=>{
        handleGetUserCart(token)
    },[])

    const handleGetUserCart = (token)=>{
        listUserCart(token)
        .then((res)=>{
            // console.log(res)
            setProducts(res.data.products)
            setCartTotal(res.data.cartTotal)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    
    const handleSaveAddress = () => {
        console.log(address)
        if(!address){
           return toast.warning('Please fill address')
        }
        saveAddress(token,address)
        .then((res)=>{
            console.log(res)
            toast.success(res.data.message)
            setAddressSaved(true)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleGoToPayment =()=>{
        if(!addressSaved){
            return toast.warning('Please fill Address')
        }
        navigate('/user/payment')
    }
    // console.log(products)
  return (
    <div className='container mx-auto'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Left  */}
        <div className='mx-4 md:w-2/4'>
            <div className='bg-gray-100 p-4 rounded-md border shadow-md space-y-3'>
                <h1 className='text-xl font-bold'>ที่อยู่ในการส่งสินค้า</h1>
                <textarea 
                    required
                    className='w-full resize-none px-2 py-1 rounded-md' 
                    placeholder='กรุณากรอกที่อยู่' 
                    onChange={(e)=>setAddress(e.target.value)}
                />
                <button 
                    className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700'
                    onClick={handleSaveAddress}
                >
                        Save Address
                </button>
            </div>
        </div>

        {/* Right  */}
        <div className='mx-4 md:w-1/4'>
            <div className='bg-gray-100 p-4 rounded-md border shadow-md space-y-4'>
                <h1 className='text-xl font-bold'>คำสั่งซื้อของคุณ</h1>

                {/* item list  */}
                {
                    products?.map((item,index)=>
                    <div key={index}>
                        <div className='flex justify-between items-end'>
                            <div>
                                <p className='font-semibold'>{item.product.title}</p>
                                <p className='font-thin'>จำนวน : {item.count} x {numberFormat(item.product.price)}</p>
                            </div>
                            <div>
                                <p className='text-red-500 font-bold'>{numberFormat(item.count * item.product.price)}</p>
                            </div>
                        </div>
                    </div>
                    )
                }
                
                <hr />
                <div>
                    <div className='flex justify-between items-center'>
                        <p>ค่าจัดส่ง</p>
                        <p>$0</p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p>ส่วนลด</p>
                        <p>$0</p>
                    </div>
                </div>
                <hr />
                <div>
                    <div className='flex justify-between items-center'>
                        <p className='font-bold'>ยอดรวมสุทธิ:</p>
                        <p className='text-red-500'>{numberFormat(cartTotal)}</p>
                    </div>
                </div>
                <hr />
                <div>
                {
                products.length > 0 ? (
                  // แสดงปุ่มสั่งซื้อที่ใช้งานได้
                  <button 
                  className='bg-red-500 text-white p-2 w-full 
              rounded-md shadow-md hover:bg-red-800'
                  onClick={handleGoToPayment}
              >
                  ดำเนินการชำระเงิน
              </button>
                ) : (
                  // แสดงปุ่มสั่งซื้อที่ disabled
 
                    <button
                      className="bg-black text-white w-full rounded-lg py-2 shadow-md "
                      disabled
                    >
                      ไม่มีสินค้า
                    </button>

                )
      
            }

                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
