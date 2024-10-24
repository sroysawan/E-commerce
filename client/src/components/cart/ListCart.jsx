import { ListCheck } from 'lucide-react'
import React from 'react'
import useEcomStore from '../../store/ecom-store'
import { Link,useNavigate } from 'react-router-dom'
import { createUserCart } from '../../api/user'
import { toast} from 'react-toastify'

const ListCart = () => {
    const user = useEcomStore((state)=> state.user)
    const cart = useEcomStore((state)=> state.carts)
    //axios interceptor
    const token = useEcomStore((state)=> state.token)
    const getTotalPrice = useEcomStore((state)=> state.getTotalPrice)
    
    const navaigate = useNavigate()
    const handleSaveCart = async()=>{
        await createUserCart(token,{cart})
        .then((res)=>{
            console.log(res)
            toast.success('Add to Cart Success')
            navaigate('/checkout')
        })
        .catch((error)=> {
            console.log(error)
        })
        // console.log('save cart')
    }
  return (
    <div className='bg-gray-300 rounded-lg p-4'>
        {/* Header  */}
      <div className='flex gap-4 items-center mb-4'>
        <ListCheck size={36}/>
        <h1 className='font-bold text-2xl'>รายการสินค้า {cart.length} สินค้า</h1>
      </div>

      {/* List  */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Left  */}
        <div className='col-span-2'>
        {
            cart.map((item,index)=>     
            <div key={index} className='bg-white p-2 rounded-md shadow-md mb-4'>
                {/* Row 1 */}
                <div className='flex justify-between mb-2'>
                    {/* Left  */}
                    <div className='flex gap-2 items-center'>
                        {
                            item.images && item.images.length > 0
                            ? <img src={item.images[0].url} className='w-16 h-16 rounded-md object-cover' />
                            : <div className='w-16 h-16 rounded-md bg-gray-200 flex items-center text-center'>
                                    No Image
                                </div>
                        }
                        <div>
                            <p className='font-bold'>{item.title}</p>
                            <p className='text-sm'>{item.price} x {item.count}</p>
                        </div>
                    </div>
                    {/* Right  */}
                    <div className='font-bold text-blue-600 flex items-center'>
                        {item.price * item.count}
                    </div>
                </div>
            </div>
        )
    }
        </div>
        {/* Right  */}
        <div className='bg-white rounded-lg p-4 shadow-md space-y-4'>
            <h1 className='text-2xl font-bold'>ยอดรวม</h1>
            <div className='flex justify-between items-center'>
                <span>รวมสุทธิ</span>
                <span className='text-xl'>{getTotalPrice()}</span>
            </div>
                <div className='flex flex-col gap-2'>
                   {
                    user
                    ? 
                    <Link>
                        <button 
                            className='bg-red-600 text-white w-full 
                            rounded-lg py-2 shadow-md hover:bg-red-700'
                            onClick={handleSaveCart}
                        >
                            สั่งซื้อ
                        </button>
                    </Link>
                    : 
                    <Link to={'/login'}>
                    <button 
                        className='bg-blue-600 text-white w-full 
                        rounded-lg py-2 shadow-md hover:bg-blue-700'
                    >
                        Login
                    </button>
                </Link>
                   }
                    

                    
                    <Link to={'/shop'}>
                        <button 
                            className='bg-gray-500 text-white w-full 
                            rounded-lg py-2 shadow-md hover:bg-gray-700'
                        >
                            แก้ไขรายการ
                        </button>
                    </Link>
                </div>
        </div>

      </div>
    </div>
  )
}

export default ListCart
