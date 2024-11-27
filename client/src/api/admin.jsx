import axios from "axios";

export const getOrdersAdmin = async (token, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc" , searchQuery = "") => {
  //code body
  return await axios.get("http://localhost:5000/api/admin/orders", {
    params: { page, limit,sortBy, sortOrder, query: searchQuery }, // ส่งพารามิเตอร์เพื่อรองรับการแบ่งหน้า
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeOrderStatus = async (token, orderId, orderStatus) => {
  //code body
  return await axios.put(
    "http://localhost:5000/api/admin/order-status",
    {
      orderId,
      orderStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getListAllUser = async (token, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc" , searchQuery = "") => {
  return await axios.get("http://localhost:5000/api/users", {
      params: { page, limit, sortBy, sortOrder, query: searchQuery }, // ส่งพารามิเตอร์เพื่อรองรับการแบ่งหน้า
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
};

// หากต้องการดึงข้อมูลทั้งหมด
const getAllUsersWithoutPagination = async (token) => {
  return await getListAllUser(token, 1, 0); // กำหนด limit เป็น 0 เพื่อดึงข้อมูลทั้งหมด
};


export const changeUserStatus = async (token,value) => {
  //code body
  return await axios.post("http://localhost:5000/api/change-status",
    value
 ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const changeUserRole = async (token,value) => {
  //code body
  return await axios.post("http://localhost:5000/api/change-role",
    value
 ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
