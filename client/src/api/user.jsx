import axios from "axios";

export const createUserCart = async (token, cart) => {
    //code body
    return await axios.post("http://localhost:5000/api/user/cart", cart, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


export const listUserCart = async (token) => {
    //code body
    return await axios.get("http://localhost:5000/api/user/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export const saveAddress = async (token,address) => {
    //code body
    return await axios.post("http://localhost:5000/api/user/address",
        {
            address
        }, 
        {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export const saveOrder = async (token,payload) => {
    //code body
    return await axios.post("http://localhost:5000/api/user/order",
      payload, 
        {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


  //old
  // export const historyUserCart = async (token) => {
  //   //code body
  //   return await axios.get("http://localhost:5000/api/user/order", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };

  export const historyUserCart = async (token, page = 1, limit = 5,searchQuery = "" ) => {
    return await axios.get("http://localhost:5000/api/user/order", {
        params: { page, limit , query: searchQuery}, // ส่งพารามิเตอร์เพื่อรองรับการแบ่งหน้า
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
  };
  
  // หากต้องการดึงข้อมูลทั้งหมด
  const historyUserCartWithoutPagination = async (token) => {
    return await historyUserCart(token, 1, 0); // กำหนด limit เป็น 0 เพื่อดึงข้อมูลทั้งหมด
  };
