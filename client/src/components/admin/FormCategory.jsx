import React, { useEffect, useState } from "react";
import {
  createCategory,
  removeCategory,
  updateCategory,
} from "../../api/category";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";

const FormCategory = () => {
  const token = useEcomStore((state) => state.token);
  const categories = useEcomStore((state) => state.categories);
  const getCategory = useEcomStore((state) => state.getCategory);

  const [name, setName] = useState(""); // สำหรับเพิ่มหมวดหมู่
  const [editData, setEditData] = useState({}); // เก็บข้อมูลที่กำลังแก้ไข

  console.log(categories);
  useEffect(() => {
    getCategory(token);
  }, [token, getCategory]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.warning("Please fill data");
    }

    try {
      const res = await createCategory(token, { name });
      toast.success(`Added category ${res.data.name} successfully!`);
      getCategory(token);
      setName(""); // รีเซ็ตช่อง input
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (item) => {
    setEditData({ id: item.id, name: item.name });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, name: e.target.value });
  };

  const handleUpdateSubmit = async (id) => {
    if (!editData.name.trim()) {
      return toast.warning("Please fill data");
    }

    try {
      await updateCategory(token, id, { name: editData.name });
      toast.success(`Updated category to ${editData.name} successfully!`);
      getCategory(token);
      setEditData({}); // รีเซ็ตข้อมูลการแก้ไข
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        const res = await removeCategory(token, id);
        toast.success(`Deleted category ${res.data.name} successfully!`);
        getCategory(token);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Category Management
      </h1>

      {/* ฟอร์มเพิ่มหมวดหมู่ */}
      <form className="flex gap-4 mb-6" onSubmit={handleAddSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add Category"
          className=" border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
        >
          Add Category
        </button>
      </form>

      {/* ตารางหมวดหมู่ */}
      <table className="w-full table-auto divide-y divide-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-blue-100 text-gray-800 font-bold">
          <tr>
            <th className="px-4 py-3 text-center">ลำดับ</th>
            <th className="px-4 py-3">หมวดหมู่</th>
            <th className="px-4 py-3 text-center">จำนวนรายการ</th>
            <th className="px-4 py-3 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item, index) => (
            <tr
              key={index}
              className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition-colors"
            >
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2">
                {editData.id === item.id ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p>{item.name}</p>
                )}
              </td>
              <td className="px-4 py-2 text-center">{item.products.length}</td>
              <td className="px-4 py-2 text-center">
                {editData.id === item.id ? (
                  <button
                    onClick={() => handleUpdateSubmit(item.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Save
                  </button>
                ) : (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormCategory;
