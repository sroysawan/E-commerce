import axios from "axios";

export const createProduct = async (token, form) => {
  //code body
  return await axios.post("http://localhost:5000/api/product", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const listProduct = async (count = 20) => {
  //code body
  return await axios.get("http://localhost:5000/api/products/" + count);
};
export const readProduct = async (token, id) => {
  //code body
  return await axios.get("http://localhost:5000/api/product/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateProduct = async (token, id ,form) => {
  //code body
  return await axios.put("http://localhost:5000/api/product/" + id,form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteProduct = async (token, id) => {
  //code body
  return await axios.delete("http://localhost:5000/api/product/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};





// image 
export const uploadFiles = async (token, form) => {
  //code body
//   console.log("form api frontend", form);
  return await axios.post(
    "http://localhost:5000/api/images",
    {
        image: form
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFiles = async (token, public_id) => {
  //code body
//   console.log("form api frontend", form);
  return await axios.post(
    "http://localhost:5000/api/removeimages",
    {
        public_id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};




//search

export const searchFilters = async (arg) => {
  //code body
  return await axios.post("http://localhost:5000/api/search/filters",arg);
};


//สินค้าขายดี
export const listProductBy = async (sort,order,limit) => {
  //code body
  return await axios.post("http://localhost:5000/api/productby",{
    sort,order,limit
  });
};




