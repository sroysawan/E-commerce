import axios from "axios";

export const createCategory = async (token, form) => {
  //code body
  return await axios.post("http://localhost:5000/api/category", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const listCategory = async () => {
//   return await axios.get('http://localhost:5000/api/category');
// };

export const listCategory = async (token,page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc" , searchQuery = "") => {
  //code body
  return await axios.get("http://localhost:5000/api/category", {
    params: { page, limit,sortBy, sortOrder, query: searchQuery },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// หากต้องการดึงข้อมูลทั้งหมด
const getCategoryWithoutPagination = async (token) => {
  return await listCategory(1, 0); // กำหนด limit เป็น 0 เพื่อดึงข้อมูลทั้งหมด
};

export const listByCategory = async (id) => {
  //code body
  const decodedId = decodeURIComponent(id);
  // return await axios.get("http://localhost:5000/api/category/" + id);
  return await axios.get(`http://localhost:5000/api/category/${decodedId}`);
};

export const updateCategory = async (token, id, form) => {
  //code body
  return await axios.put("http://localhost:5000/api/category/" + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeCategory = async (token, id) => {
  //code body
  return await axios.delete("http://localhost:5000/api/category/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
