import {
  ClipboardList,
  UserCheck,
  UsersRound,
  WalletMinimal,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import useEcomStore from "../../../store/ecom-store";
import { numberFormat } from "../../../utils/number";
import AdminChart from "./AdminChart";

const FromDashboard = () => {
  const token = useEcomStore((state) => state.token);
  const getAllUser = useEcomStore((state) => state.getAllUser);
  const allUsers = useEcomStore((state) => state.allUsers);
  const getAllOrder = useEcomStore((state) => state.getAllOrder);
  const orders = useEcomStore((state) => state.orders);

  const [totalCartTotal, setTotalCartTotal] = useState(0);
  console.log(allUsers);
  useEffect(() => {
    getAllUser(token);
  }, [token, getAllUser]);

  useEffect(() => {
    getAllOrder(token);
  }, [token, getAllOrder]);

  // คำนวณผลรวมแยกใน useEffect หรือจุดอื่นที่เหมาะสม
  useEffect(() => {
    const total = calculateTotalCartTotal(orders);
    setTotalCartTotal(total);
  }, [orders]);

  // ฟังก์ชันแยกที่คำนวณผลรวมของ cartTotal
  const calculateTotalCartTotal = (orders) => {
    return orders.reduce((total, order) => {
      return total + (order.cartTotal || 0); // ตรวจสอบว่ามีค่า cartTotal หรือไม่ ถ้าไม่มีให้ใช้ค่า 0
    }, 0);
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-8">
        <div className="dashboard-box">
          <div className="dashboard-content">
              <div className="relative flex items-center justify-center">
                <div className="icon-bg-circle"></div>
                <WalletMinimal  className="icons-admin z-10" />
              </div>
            <div className="grid grid-flow-row-50%_50%] p-2">
              <div className="flex items-center">
                <h1 className="font-bold text-base md:text-xl">รายได้รวม</h1>
              </div>
              <div>
                <h1 className="text-sm md:text-lg font-medium">
                  {numberFormat(totalCartTotal)} THB
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-box">
          <div className="dashboard-content">
              <div className="relative flex items-center justify-center">
                <div className="icon-bg-circle"></div>
                <ClipboardList className="icons-admin z-10" />
              </div>
            <div className="grid grid-flow-row-50%_50%] p-2">
              <div className="flex items-center">
                <h1 className="font-bold text-base md:text-xl">จำนวนคำสั่งซื้อ</h1>
              </div>
              <div>
                <h1 className="text-sm md:text-lg  font-medium">
                  {orders.length} คำสั่งซื้อ
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-box">
          <div className="dashboard-content">
              <div className="relative flex items-center justify-center">
                <div className="icon-bg-circle">
                </div>
                <UsersRound className="icons-admin z-10" />
              </div>
            <div className="grid grid-flow-row-50%_50%] p-2">
              <div className="flex items-center">
                <h1 className="font-bold text-base md:text-xl">จำนวนผู้ใช้งาน</h1>
              </div>
              <div>
                <h1 className="text-sm md:text-lg  font-medium">{allUsers.length} คน</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-box">
          <div className="dashboard-content">
              <div className="relative flex items-center justify-center">
                <div className="icon-bg-circle"></div>
                <UserCheck className="icons-admin z-10" />
              </div>
            <div className="grid grid-flow-row-50%_50%] p-2">
              <div className="flex items-center">
                <h1 className="font-bold text-base md:text-xl text-wrap">
                  จำนวนผู้ใช้งานที่ยังใช้งาน
                </h1>
              </div>
              <div>
                <h1 className="text-sm md:text-lg  font-medium">
                  {allUsers && allUsers.length > 0
                    ? `${allUsers.filter((user) => user.enabled).length} คน`
                    : "ไม่มีผู้ใช้งาน"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AdminChart />
      </div>
    </div>
  );
};

export default FromDashboard;
