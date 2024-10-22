import React, { useEffect, useState } from "react";
import {
  createCategory,
  listCategory,
  removeCategory,
} from "../../api/category";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const FormCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");
  // const [categories, setCategories] = useState([]);

  const categories = useEcomStore((state) => state.categories)
  const getCategory = useEcomStore((state) => state.getCategory)
  useEffect(() => {
    getCategory(token);
  }, []);

  // const getCategory = async (token) => {
  //   try {
  //     const res = await listCategory(token);
  //     setCategories(res.data);
  //   } catch (error) {}
  // };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.warning("Please fill data");
    }
    try {
      const res = await createCategory(token, { name });
      toast.success(`Add Category ${res.data.name} success!!`);
      getCategory(token);
    } catch (error) {
      console.log(error);
    }
  };

  const handelRemove = async (id) => {
    // console.log(id);
    try {
        const res = await removeCategory(token,id)
        console.log(res)
        toast.success(`Delete Category ${res.data.name} success!!`);
        getCategory(token);
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <h1>Category Management</h1>
      <form className="my-4" onSubmit={handelSubmit}>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="border border-black mr-2"
        />
        <button 
            className="bg-blue-600 text-white px-2 py-1 rounded-md">
            Add Category
        </button>
      </form>
      <hr />
      <ul className="list-none">
        {categories.map((item, index) => (
          <li key={index} className="flex justify-between my-2">
            <span>{item.name}</span>
            <button
              onClick={() => handelRemove(item.id)}
              className="bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormCategory;
