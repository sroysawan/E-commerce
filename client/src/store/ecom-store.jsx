import axios from 'axios'
import { create } from 'zustand'
import { persist,createJSONStorage } from 'zustand/middleware'
import { listCategory } from '../api/category'
import { listProduct,searchFilters } from '../api/product'

const ecomStore = (set) => ({
    user: null,
    token: null,
    categories: [],
    products: [],
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
        } catch (error) {}
      },

    getProduct : async (count) => {
        try {
          const res = await listProduct(count)
          set({
            products: res.data
          })
        } catch (error) {}
      },

    actionSearchFilters : async (arg) => {
        try {
          const res = await searchFilters(arg)
          set({
            products: res.data
          })
        } catch (error) {}
      },


})

const usePersist = {
    name: 'ecom-store',
    storage: createJSONStorage(()=>localStorage)
}

const useEcomStore = create(persist(ecomStore,usePersist))

export default useEcomStore