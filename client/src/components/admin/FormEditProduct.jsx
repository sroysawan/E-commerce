import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import {
  createProduct,
  listProduct,
  readProduct,
  updateProduct,
} from "../../api/product";
import { toast } from "react-toastify";
import UploadFile from "./uploadFile";
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: '',
    images: [],
};
const FormEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory();
    fetchProduct(token, id,form);
  }, []);

  const fetchProduct = async (token, id, form) => {
    try {
      const res = await readProduct(token, id, form);
      console.log("res form backend", res);
      setForm(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handelOnChange = (e) => {
    // console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(token, id, form);
    //   console.log(res);
      toast.success(`Edit Product ${res.data.title} success`);
      navigate('/admin/product');
    } catch (error) {
      console.log(error);
      // toast.error(error)
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handelSubmit}>
        <h1>Edit Product</h1>
        <input
          type="text"
          value={form.title}
          onChange={handelOnChange}
          placeholder="Title"
          name="title"
          className="border"
        />
        <input
          type="text"
          value={form.description}
          onChange={handelOnChange}
          placeholder="Description"
          name="description"
          className="border"
        />
        <input
          type="number"
          value={form.price}
          onChange={handelOnChange}
          placeholder="Price"
          name="price"
          className="border"
        />
        <input
          type="number"
          value={form.quantity}
          onChange={handelOnChange}
          placeholder="Quantity"
          name="quantity"
          className="border"
        />
        <select
          className="border"
          name="categoryId"
          onChange={handelOnChange}
          required
          value={form.categoryId}
        >
          <option value="" disabled>
            Please Selected
          </option>
          {categories.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <hr />
        {/* upload image */}
        <UploadFile form={form} setForm={setForm} />

        <button className="bg-blue-500">Update Product</button>
      </form>
      <hr />
      <br />
    </div>
  );
};

export default FormEditProduct;
