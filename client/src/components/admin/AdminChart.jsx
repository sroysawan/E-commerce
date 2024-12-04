import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { Bar, Pie } from "react-chartjs-2";
import { pieData, pieOptions } from "../../utils/pieCharts";
import { barData, barOptions } from "../../utils/barCharts";
import { getOrdersAdmin } from "../../api/admin";
const AdminChart = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getAllOrder = useEcomStore((state) => state.getAllOrder);
  const orders = useEcomStore((state) => state.orders);

  useEffect(() => {
    getAllOrder(token);
  }, [token, getAllOrder]);

  useEffect(() => {
    getCategory();
  }, []);

  const labelBarArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // คำนวณยอดขายรายเดือน
  const dataBarArr = new Array(12).fill(0); // เริ่มต้น array ที่ 0 สำหรับแต่ละเดือน
  orders.forEach((order) => {
    if (order.status === "succeeded") {
      const month = new Date(order.createdAt).getMonth(); // ดึงเดือนจาก createdAt
      dataBarArr[month] += order.amount; // รวมยอดขายตามเดือน
    }
  });

  // เตรียมข้อมูล Pie chart ตามหมวดหมู่สินค้า
  const topCategory = categories.sort((a, b) => b.sold - a.sold).slice(0, 5);
  const labelPieArr = [];
  const dataPieArr = [];
  for (const dataObj of topCategory) {
    labelPieArr.push(dataObj.name);
    dataPieArr.push(dataObj.products.length);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_40%] justify-between gap-6">
      <div className="bg-white shadow-lg h-[400px] p-4 flex flex-col">
        <p className="text-sm md:text-xl font-bold mb-4">ยอดขายรายเดือน (Monthly Sales)</p>
        <div className="flex-grow flex justify-center items-center">
          <Bar data={barData(labelBarArr, dataBarArr)} options={barOptions} />
        </div>
      </div>
      <div className="bg-white shadow-lg h-[400px] p-4 flex flex-col">
        <p className="text-sm md:text-xl font-bold mb-4">หมวดหมู่สินค้าขายดี</p>
        <div className="flex-grow flex justify-center items-center">
          <Pie data={pieData(labelPieArr, dataPieArr)} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminChart;
