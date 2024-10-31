import axios from 'axios'
import { create } from 'zustand'
import { persist,createJSONStorage } from 'zustand/middleware'

import { listCategory } from '../api/category'
import { listProduct,searchFilters } from '../api/product'
import _ from 'lodash'
const ecomStore = (set,get) => ({
    //สร้าง state ประกอบไปด้วย key:value
    user: null,
    token: null,
    categories: [],
    products: [],
    carts:[],
    
    actionLogout:()=>{
      set({
        user: null,
        token: null,
        categories: [],
        products: [],
        carts:[],
      })
    },
    actionLogin: async(form)=> {
        const res = await axios.post('http://localhost:5000/api/login',form)
        // console.log(res.data.token)
        set({
            user: res.data.payload,
            token: res.data.token,
        })
        return res
    },
    getCategory : async () => {
        try {
          const res = await listCategory()
          set({
            categories: res.data
          })
        } catch (error) {
          console.log(error)
        }
      },

    getProduct : async (count) => {
        try {
          const res = await listProduct(count)
          set({
            products: res.data
          })
        } catch (error) {
          console.log(error)
        }
      },

    actionSearchFilters : async (arg) => {
        try {
          const res = await searchFilters(arg)
          set({
            products: res.data
          })
        } catch (error) {
          console.log(error)
        }
      },

    actionAddtoCart: (product)=>{
      try {
        //get = เข้าถึงตัวแปร 
        const carts = get().carts

        // ตรวจสอบว่ามีสินค้าอยู่ใน carts หรือไม่
        const existingProduct = carts.find(item => item.id === product.id);

        if (existingProduct) {
          // ถ้ามีสินค้าอยู่แล้ว ไม่ต้องเพิ่มสินค้าใหม่
          console.log("สินค้านี้ถูกเพิ่มไปแล้ว");
          return;
        }

        // ถ้าไม่มีสินค้าใน carts ให้เพิ่มสินค้าใหม่
        const updateCart = [...carts,{...product,count:1}]
        console.log(updateCart);

        //step uniqe จะกดเพิ่มสินค้าซ้ำไม่ได้
        // const uniqe = _.unionWith(updateCart,_.isEqual)
        // console.log(uniqe)

         // อัปเดตค่า carts ใน state
        set({
          carts: updateCart,
        })
      } catch (error) {
        console.log(error)
      }
    },

    actionUpdateQuantity: (productId,newQuantity)=>{
      // console.log('Update Click',productId,newQuantity)
      set((state)=>({
          carts: state.carts.map((item)=>
              item.id === productId
                ? {...item, count: Math.max(1,newQuantity)}
                : item
          )
      }))
    },

    actionRemoveProduct: (productId)=>{
      // console.log('remove product',productId)
      set((state)=> ({
          carts: state.carts.filter((item)=>
            item.id !== productId
          )
      }))
    },

    getTotalPrice: ()=>{
      return get().carts.reduce((total,item)=> {
        return total + item.price * item.count
      },0)
    },

    clearCart: ()=>{
      set({ carts: []})
    }

})

//เก็บค่าลง localStorage refresh ก็ไม่หายไป
const usePersist = {
    name: 'ecom-store',
    storage: createJSONStorage(()=>localStorage)
}

const useEcomStore = create(persist(ecomStore,usePersist))

export default useEcomStore