import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { listCategory } from "../api/category";
import { listProduct, searchFilters } from "../api/product";
import { getListAllUser, getOrdersAdmin } from "../api/admin";
import _ from "lodash";
const ecomStore = (set, get) => ({
  //สร้าง state ประกอบไปด้วย key:value
  user: null,
  token: null,
  products: [],
  carts: [],

  allUsers: [],  // สำหรับเก็บข้อมูลทั้งหมด
  totalUsers: 0,  // สำหรับเก็บจำนวนผู้ใช้ทั้งหมด

  categories: [],
  totalCategory: 0,  

  orders: [],
  totalOrders: 0,  


  page: 1, // หน้าเริ่มต้น
  limit: 10, // ข้อมูลต่อหน้าเริ่มต้น
  isLoading: false, // สถานะการโหลดข้อมูล

  //clear All when logout
  actionLogout: () => {
    set({
      user: null,
      token: null,
      categories: [],
      products: [],
      carts: [],
    });
  },

  //clear carts when payment success
  clearCart: () => {
    set({ carts: [] });
  },


  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:5000/api/login", form);
    // console.log(res.data.token)
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },

  //old
  // getCategory: async () => {
  //   try {
  //     const res = await listCategory();
  //     set({
  //       categories: res.data,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  
  getCategoryPagination: async (token,page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const res = await listCategory(token,page, limit);
      set({
        categories: res.data.category,
        totalCategory: res.data.total,
        page,
        limit,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  // setPage: (page) => {
  //   set({ page });
  // },
  // setLimit: (limit) => {
  //   set({ limit });
  // },
  
  getCategory: async (token,page = 1, limit = 0) => {
    // ฟังก์ชันนี้จะดึงข้อมูลทั้งหมด (limit = 0)
    set({ isLoading: true });
    try {
      const res = await listCategory(token,page, limit); // limit = 0 เพื่อดึงข้อมูลทั้งหมด
      set({
        categories: res.data.category,
        totalCategory: res.data.total,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },


//old
  // getProduct: async (count) => {
  //   try {
  //     const res = await listProduct(count);
  //     set({
  //       products: res.data,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  getProductPagination: async (token,page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const res = await listProduct(token,page, limit);
      set({
        products: res.data.products,
        totalProduct: res.data.total,
        page,
        limit,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  getProduct: async (token,page = 1, limit = 0) => {
    // ฟังก์ชันนี้จะดึงข้อมูลทั้งหมด (limit = 0)
    set({ isLoading: true });
    try {
      const res = await listProduct(token,page, limit); // limit = 0 เพื่อดึงข้อมูลทั้งหมด
      set({
        products: res.data.products,
        totalProduct: res.data.total,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  actionSearchFilters: async (arg) => {
    try {
      const res = await searchFilters(arg);
      set({
        products: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  actionAddtoCart: (product) => {
    try {
      //get = เข้าถึงตัวแปร
      const carts = get().carts;

      // ตรวจสอบว่ามีสินค้าอยู่ใน carts หรือไม่
      const existingProduct = carts.find((item) => item.id === product.id);

      if (existingProduct) {
        // ถ้ามีสินค้าอยู่แล้ว ไม่ต้องเพิ่มสินค้าใหม่
        console.log("สินค้านี้ถูกเพิ่มไปแล้ว");
        return;
      }

      // ถ้าไม่มีสินค้าใน carts ให้เพิ่มสินค้าใหม่
      // const updateCart = [...carts,{...product,count:1}]  //สินค้าใหม่ถูกเพิ่มเข้าไปด้านล่างสุดของตะกร้า
      const updateCart = [{ ...product, count: 1 }, ...carts]; //สินค้าใหม่ถูกเพิ่มเข้าไปด้านบนสุดของตะกร้า

      console.log("เพิ่มสินค้าลงตะกร้า", updateCart);

      //step uniqe จะกดเพิ่มสินค้าซ้ำไม่ได้
      // const uniqe = _.unionWith(updateCart,_.isEqual)
      // console.log(uniqe)

      // อัปเดตค่า carts ใน state
      set({
        carts: updateCart,
      });
    } catch (error) {
      console.log(error);
    }
  },

  actionUpdateQuantity: (productId, newQuantity) => {
    // console.log('Update Click',productId,newQuantity)
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item
      ),
    }));
  },

  actionRemoveProduct: (productId) => {
    // console.log('remove product',productId)
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== productId),
    }));
  },

  getTotalPrice: () => {
    return get().carts.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);
  },



  //old
  // getAllUser: async (token) => {
  //   try {
  //     const res = await getListAllUser(token);
  //     set({
  //       alluser: res.data,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  getAllUserPagination: async (token, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const res = await getListAllUser(token, page, limit);
      set({
        allUsers: res.data.users,
        totalUsers: res.data.total,
        page,
        limit,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  // setPage: (page) => {
  //   set({ page });
  // },
  // setLimit: (limit) => {
  //   set({ limit });
  // },

    // ดึงข้อมูลผู้ใช้ทั้งหมด
    getAllUser: async (token,page = 1, limit = 0) => {
      set({ isLoading: true });
      try {
        const response = await getListAllUser(token, page, limit); // limit = 0
        set({
          allUsers: response.data.users,
          totalUsers: response.data.total,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching all users:", error);
        set({ isLoading: false });
      }
    },

    getOrderPagination: async (token, page = 1, limit = 0) => {
      set({ isLoading: true });
      try {
        const res = await getOrdersAdmin(token, page, limit);
        set({
          orders: res.data.orders,
          totalOrders: res.data.total,
          page,
          limit,
          isLoading: false,
        });
      } catch (error) {
        console.error(error);
        set({ isLoading: false });
      }
    },

    getAllOrder: async (token,page = 1, limit = 0) => {
      set({ isLoading: true });
      try {
        const response = await getOrdersAdmin(token, page, limit); // limit = 0
        set({
          orders: response.data.orders,
          totalOrders: response.data.total,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching all users:", error);
        set({ isLoading: false });
      }
    },

    
});

//เก็บค่าลง localStorage refresh ก็ไม่หายไป
const usePersist = {
  name: "ecom-store",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    user: state.user,
    token: state.token,
    carts: state.carts,
  }),
};

const useEcomStore = create(persist(ecomStore, usePersist));

export default useEcomStore;
