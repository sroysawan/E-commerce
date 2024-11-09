import React from 'react'
import useEcomStore from '../../store/ecom-store'
import { User } from 'lucide-react'

const HeaderAdmin = () => {
  const user = useEcomStore((state)=> state.user)
  return (
    <header className='bg-white h-20 flex items-center px-6 justify-end'>
      <div className='flex items-center gap-4'>
        <div className='rounded-full bg-gray-300 p-2'>
          <User />
        </div>
        <div>
          {user.email}
        </div>
      </div>
    </header>
  )
}

export default HeaderAdmin
