import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import UploadFile from "./uploadFile";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";


const initialState = {
  title: "",
  description: "",
  price: "",
  quantity: "",
  categoryId: "",
  images: [],
};
const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  console.log('products', categories);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  });

  useEffect(() => {
    getCategory();
    getProduct(100);
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
      setForm(initialState);
      toast.success(`Add Product ${res.data.title} success`);
      getProduct();
      // ล้างรูปภาพที่อัปโหลด
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ล้างค่า input file
      }
    } catch (error) {
      console.log(error);
      // toast.error(error)
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        const res = await deleteProduct(token, id);
        toast.success(`Deleted Product ${res.data.title} success`);
        getProduct();
        // console.log(res)
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-4 bg-white shadow-md">
      <form onSubmit={handelSubmit}>
        <h1 className="text-2xl font-bold">Add Product</h1>
        <div className="my-4 flex flex-wrap gap-4">
          <input
            type="text"
            value={form.title}
            onChange={handelOnChange}
            placeholder="Title"
            name="title"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={form.description}
            onChange={handelOnChange}
            placeholder="Description"
            name="description"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={form.price}
            onChange={handelOnChange}
            placeholder="Price"
            name="price"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={form.quantity}
            onChange={handelOnChange}
            placeholder="Quantity"
            name="quantity"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
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
        </div>
        <hr />

        {/* upload image */}
        <UploadFile form={form} setForm={setForm} />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => setForm(initialState)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-transform transform hover:scale-105"
          >
            Reset
          </button>
        </div>
      </form>
      <br />
      <hr />
      <br />
      <table className="min-w-full border-collapse overflow-hidden bg-white shadow-md rounded-lg text-sm">
        <thead className="bg-blue-500 text-white text-left text-sm uppercase font-medium">
          <tr>
            <th className="px-6 py-3">No</th>
            <th className="px-6 py-3">รูปภาพ</th>
            <th className="px-6 py-3">ชื่อ</th>
            <th className="px-6 py-3">รายละเอียด</th>
            <th className="px-6 py-3">ราคา</th>
            <th className="px-6 py-3">จำนวน</th>
            <th className="px-6 py-3">จำนวนที่ขายได้</th>
            <th className="px-6 py-3">วันที่อัปเดต</th>
            <th className="px-6 py-3">จัดการ</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {products.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 transition duration-200 border-b dark:text-gray-400"
            >
              <td className="px-6 py-4 text-center">{index + 1}</td>
              <td className="px-6 py-4">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                    No image
                  </div>
                )}
              </td>
              <td className="px-6 py-4 ">{item.title}</td>
              <td className="px-6 py-4">{item.description}</td>
              <td className="px-6 py-4">{numberFormat(item.price)}</td>
              <td className="px-6 py-4">{item.quantity}</td>
              <td className="px-6 py-4 w-36">{item.sold}</td>
              <td className="px-6 py-4 w-48">{dateFormat(item.updatedAt)}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/product/${item.id}`}
                    className="bg-yellow-400 text-white rounded-md px-2 py-1 hover:bg-yellow-500"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-400 text-white rounded-md px-2 py-1 hover:bg-red-500"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormProduct;
