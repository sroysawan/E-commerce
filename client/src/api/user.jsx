import axios from "axios";

export const createUserCart = async (token, cart) => {
    //code body
    return await axios.post("http://localhost:5000/api/user/cart", cart, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };