import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { listCategory } from "../api/category";
import { listProduct, searchFilters } from "../api/product";
import { getListAllUser, getOrdersAdmin } from "../api/admin";
import _ from "lodash";
import { historyUserCart } from "../api/user";

const ecomStore = (set, get) => ({
  //สร้าง state ประกอบไปด้วย key:value
  user: null,
  token: null,
  carts: [],
  searchResults: [],    // สินค้าที่แสดงในผลลัพธ์การค้นหา
  filteredProducts: [], // เก็บสินค้าที่ผ่านการกรอง
  filteredProductShop: [], // เก็บสินค้าที่ผ่านการกรอง
  filteredProductCategory: [], // เก็บสินค้าที่ผ่านการกรอง

  products: [],        // สินค้าที่แสดงใน Shop
  totalProduct: 0,

  allUsers: [], // สำหรับเก็บข้อมูลทั้งหมด
  totalUsers: 0, // สำหรับเก็บจำนวนผู้ใช้ทั้งหมด

  categories: [],
  totalCategory: 0,

  orders: [],
  totalOrders: 0,

  historyOrders: [],
  totalHistoryOrders: 0,

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

  getCategoryPagination: async (token, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc", searchQuery = "") => {
    set({ isLoading: true });
    try {
      const res = await listCategory(token, page, limit, sortBy, sortOrder, searchQuery);
      set({
        categories: res.data.category,
        totalCategory: res.data.total,
        page,
        limit,
        sortBy,
        sortOrder,
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

  getCategory: async (token, page = 1, limit = 0) => {
    // ฟังก์ชันนี้จะดึงข้อมูลทั้งหมด (limit = 0)
    set({ isLoading: true });
    try {
      const res = await listCategory(token, page, limit); // limit = 0 เพื่อดึงข้อมูลทั้งหมด
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

  getProductPagination: async (token, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc", searchQuery = "") => {
    set({ isLoading: true });
    try {
      const res = await listProduct(token, page, limit, sortBy, sortOrder, searchQuery);
      set({
        products: res.data.products,
        totalProduct: res.data.total,
        page,
        limit,
        sortBy,
        sortOrder,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  getProduct: async (token, page = 1, limit = 0) => {
    // ฟังก์ชันนี้จะดึงข้อมูลทั้งหมด (limit = 0)
    set({ isLoading: true });
    try {
      const res = await listProduct(token, page, limit); // limit = 0 เพื่อดึงข้อมูลทั้งหมด
      set({
        products: res.data.products,
        filteredProducts: res.data.products,
        totalProduct: res.data.total,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  //searchText
  actionSearchFilters: async (arg) => {
    try {
      const res = await searchFilters(arg);
      set({
        searchResults: res.data,  // เก็บผลลัพธ์การค้นหา
      });
    } catch (error) {
      console.log(error);
    }
  },

  //filter
  filterProductsByCategoryAndPrice: async (arg) => {
    set({ isLoading: true });
    try {
      const res = await searchFilters(arg);
      set({
        filteredProductShop: res.data,  // เก็บผลลัพธ์การค้นหา
        // filteredProducts: res.data,  // เก็บผลลัพธ์การค้นหา
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

    // New function for filtering products by price range within a category
    filterProductsByPrice: (products, priceRange) => {
      if (!products || products.length === 0) return;
      
      const filtered = products.filter(
        (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      set({ filteredProductCategory: filtered });
      // set({ filteredProducts: filtered });
    },
  
    setFilteredProducts: (products) => {
      if (!products) return;
      set({ filteredProductCategory: products });
      // set({ filteredProducts: products });
    },

    // filterProductsByPrice: (products, priceRange) => {
    //   if (!products || !Array.isArray(products) || products.length === 0) {
    //     console.log('No products to filter');
    //     return;
    //   }
  
    //   try {
    //     const filtered = products.filter(
    //       (product) => 
    //         product.price >= priceRange[0] && 
    //         product.price <= priceRange[1]
    //     );
        
    //     console.log(`Filtered ${filtered.length} products from ${products.length} total`);
    //     set({ filteredProducts: filtered });
    //   } catch (error) {
    //     console.error('Error filtering products:', error);
    //     // ถ้าเกิดข้อผิดพลาด ให้แสดงสินค้าทั้งหมด
    //     set({ filteredProducts: products });
    //   }
    // },
  
    // setFilteredProducts: (products) => {
    //   if (!products || !Array.isArray(products)) {
    //     console.log('Invalid products data');
    //     return;
    //   }
    //   set({ filteredProducts: products });
    // },
  


  actionAddtoCart: (product) => {
    try {
      const carts = get().carts;
  
      const existingProductIndex = carts.findIndex((item) => item.id === product.id);
      if (existingProductIndex > -1) {
        const existingProduct = carts[existingProductIndex];
        const updatedCount = existingProduct.count + (product.count || 1);
  
        if (updatedCount > product.quantity) {
          return false; // เพิ่มสินค้าไม่ได้
        }
  
        const updatedCarts = carts.map((item, index) =>
          index === existingProductIndex ? { ...item, count: updatedCount } : item
        );
        set({ carts: updatedCarts });
        return true; // เพิ่มสินค้าได้สำเร็จ
      } else {
        if ((product.count || 1) > product.quantity) {
          return false; // เพิ่มสินค้าใหม่ไม่ได้
        }
  
        const updatedCarts = [{ ...product, count: product.count || 1 }, ...carts];
        set({ carts: updatedCarts });
        return true; // เพิ่มสินค้าใหม่สำเร็จ
      }
    } catch (error) {
      console.error(error);
      return false; // หากเกิดข้อผิดพลาด
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

  getAllHistoryOrder: async (token, page = 1, limit = 5,  searchQuery = "") => {
    set({ isLoading: true });
    try {
      const res = await historyUserCart(token, page, limit,searchQuery);
      set({
        historyOrders: res.data.orders,
        totalHistoryOrders: res.data.total,
        page,
        limit,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  resetHistoryOrders: () => {
    set({
      historyOrders: [],
      totalHistoryOrders: 0,
      isLoading: true
    });
  },

  getAllUserPagination: async (token, page = 1, limit = 10,  sortBy = "createdAt", sortOrder = "asc", searchQuery = "") => {
    set({ isLoading: true });
    try {
      const res = await getListAllUser(token, page, limit, sortBy, sortOrder, searchQuery);
      set({
        allUsers: res.data.users,
        totalUsers: res.data.total,
        page,
        limit,
        sortBy,
        sortOrder,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  getAllUser: async (token, page = 1, limit = 0) => {
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

  getOrderPagination: async (token, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc", searchQuery = "") => {
    set({ isLoading: true });
    try {
      const res = await getOrdersAdmin(token, page, limit, sortBy, sortOrder, searchQuery);
      set({
        orders: res.data.orders,
        totalOrders: res.data.total,
        page,
        limit,
        sortBy,
        sortOrder,
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
