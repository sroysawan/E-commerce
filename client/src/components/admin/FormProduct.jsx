import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import UploadFile from "./uploadFile";
import {Link} from 'react-router-dom'
import { Pencil, Trash } from "lucide-react";
const initialState = {
  title: "",
  description: "",
  price: "",
  quantity: "",
  categoryId: '',
  images: [],
};
const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
//   console.log(products);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: '',
    images: [],
  })

  useEffect(() => {
    getCategory(token);
    getProduct(token, 100);
  }, []);

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
      const res = await createProduct(token, form);
      setForm(initialState)
      toast.success(`Add Product ${res.data.title} success`);
      getProduct(token)
      //   console.log(res);
    } catch (error) {
      console.log(error);
      // toast.error(error)
    }
  };

  const handleDelete = async(id)=>{
    if(window.confirm('Are you sure you want to delete')){
      try {
        const res = await deleteProduct(token,id)
        toast.success(`Deleted Product ${res.data.title} success`);
        getProduct(token)
        // console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handelSubmit}>
        <h1>Add Product</h1>
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

        <button 
          className="bg-blue-500 p-2 rounded-md shadow-lg
          hover:scale-105 hover:-translate-y-1 hover:duration-200">
          Add Product
        </button>
      </form>
      <hr />
      <br />
      <table className="table w-full border">
        <thead>
          <tr className="bg-gray-200 border">
            <th scope="col">No</th>
            <th scope="col">รูปภาพ</th>
            <th scope="col">ชื่อ</th>
            <th scope="col">รายละเอียด</th>
            <th scope="col">ราคา</th>
            <th scope="col">จำนวน</th>
            <th scope="col">จำนวนที่ขายได้</th>
            <th scope="col">วันทีอัปเดต</th>
            <th scope="col">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => {
            // console.log(item);
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  {
                    item.images.length > 0 
                    ? <img 
                      src={item.images[0].url} 
                      className="w-24 h-24 rounded-lg shadow-md" />
                    : <div 
                      className="w-24 h-24 bg-gray-200 rounded-lg 
                      flex items-center justify-center shadow-md">
                        No image</div>
                  }
                </td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.sold}</td>
                <td>{item.updatedAt}</td>
                <td className="flex gap-2">
                  <p className="bg-yellow-400 rounded-md p-1 shadow-md
                  hover:scale-105 hover:-translate-y-1 hover:duration-200">
                    <Link to={'/admin/product/'+item.id}>
                      <Pencil />
                    </Link>
                  </p>
                  <p 
                    onClick={()=>handleDelete(item.id)}
                    className="bg-red-400 rounded-md p-1 shadow-md 
                    hover:scale-105 hover:-translate-y-1 hover:duration-200"
                  >
                    <Trash />
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FormProduct;
