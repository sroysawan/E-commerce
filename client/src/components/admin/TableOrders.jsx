import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { getOrdersAdmin,changeOrderStatus } from "../../api/admin";
import { toast } from "react-toastify";
import {numberFormat} from '../../utils/number'
import { dateFormat } from '../../utils/dateFormat'
const TableOrders = () => {
  const token = useEcomStore((state) => state.token);

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    handleGetOrders(token);
  }, []);

  const handleGetOrders = (token) => {
    getOrdersAdmin(token)
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeOrderStatus = (token,orderId,orderStatus) => {
    // console.log(orderId, orderStatus)
    changeOrderStatus(token,orderId, orderStatus)
    .then((res)=>{
      console.log(res)
      toast.success('Updated Status Order Completed')
      handleGetOrders(token)
    })
    .catch((error) => {
      console.log(error)
    });
  }

  const getStatusColor=(status) => {
    switch(status){
      case "Not Process":
        return 'bg-gray-300'
      case "Processing":
        return 'bg-blue-300'
      case "Completed":
        return 'bg-green-300'
      case "Cancelled":
        return 'bg-red-300'
    }
  }

  return (

      // <div className="overflow-x-auto p-4 bg-white shadow-md">
      //     {/* head */}
      //   <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-lg">
      //     <thead className="ltr:text-left rtl:text-right ">
      //       <tr className="bg-gray-300 text-center">
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">ลำดับ</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">ชื่อผู้ใช้</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">วันที่</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">สินค้า</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">รวม</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">สถานะ</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">สถานะการชำระเงิน</th>
      //         <th className="whitespace-nowrap px-4 py-2 text-gray-900">จัดการ</th>
      //       </tr>
      //     </thead>
      //     <tbody className="divide-y divide-gray-200">
      //       {orders?.map((item, index) => {
      //         return (
      //           <tr key={index}>
      //             <td className="whitespace-nowrap text-center px-4 py-2 font-medium text-gray-900">{index + 1}</td>
      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700">
      //               <p>{item.orderedBy.email}</p>
      //               <p>{item.orderedBy.address}</p>
      //             </td>
      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
      //               {dateFormat(item.createdAt)}
      //             </td>
      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700 ">            
      //               {
      //                   item.products?.map((product, index) =>
      //                       <div key={index}>
      //                           <p>{product.product.title}</p>
      //                           <span className="text-sm">จำนวน {product.count} x {numberFormat(product.product.price)}</span>
      //                       </div>
      //                   )
      //               }        
      //             </td>
      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{numberFormat(item.cartTotal)}</td>

      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
      //               <span 
      //                 className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-full`}
      //               >
      //               {item.orderStatus}
      //               </span>
      //             </td>
                  
      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
      //               <span 
      //                 className={`px-2 py-1 rounded-full ${item.status === "succeeded" ? 'bg-green-500' : 'bg-red-500'}`}
      //               >
      //               {item.status}
      //               </span>
      //             </td>



      //             <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
      //               <select 
      //                 value={item.orderStatus} 
      //                 onChange={(e)=> handleChangeOrderStatus(token,item.id,e.target.value)}
      //                 className="border border-black rounded-full py-1 px-1 text-gray-900 "
      //               >
      //                 <option>Not Process</option>
      //                 <option>Processing</option>
      //                 <option>Completed</option>
      //                 <option>Cancelled</option>
      //               </select>
      //             </td>
      //           </tr>
      //         );
      //       })}
      //     </tbody>
      //   </table>
      // </div>
      <div className="overflow-x-auto p-6 bg-gray-50 shadow-lg rounded-lg">
  <table className="w-full border-collapse text-sm text-left bg-white shadow-md rounded-lg">
    {/* Head */}
    <thead>
      <tr className="bg-gray-800 text-white uppercase text-center text-xs font-semibold">
        <th className="px-4 py-3">ลำดับ</th>
        <th className="px-4 py-3">ชื่อผู้ใช้</th>
        <th className="px-4 py-3">วันที่</th>
        <th className="px-4 py-3">สินค้า</th>
        <th className="px-4 py-3">รวม</th>
        <th className="px-4 py-3">สถานะ</th>
        <th className="px-4 py-3">การชำระเงิน</th>
        <th className="px-4 py-3">จัดการ</th>
      </tr>
    </thead>
    {/* Body */}
    <tbody className="divide-y divide-gray-200">
      {orders.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-gray-100 transition duration-200 text-center"
        >
          <td className="px-4 py-3">{index + 1}</td>
          <td className="px-4 py-3">
            <p>{item.orderedBy.email}</p>
            <p className="text-sm text-gray-500">{item.orderedBy.address}</p>
          </td>
          <td className="px-4 py-3">{dateFormat(item.createdAt)}</td>
          <td className="px-4 py-3 text-left">
            {item.products.map((product, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-medium">{product.product.title}</p>
                <span className="text-sm text-gray-600">
                  {`จำนวน ${product.count} x ${numberFormat(product.product.price)}`}
                </span>
              </div>
            ))}
          </td>
          <td className="px-4 py-3 font-semibold">
            {numberFormat(item.cartTotal)}
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                item.orderStatus
              )}`}
            >
              {item.orderStatus}
            </span>
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                item.status === "succeeded"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {item.status}
            </span>
          </td>
          <td className="px-4 py-3">
            <select
              value={item.orderStatus}
              onChange={(e) =>
                handleChangeOrderStatus(token, item.id, e.target.value)
              }
              className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Not Process</option>
              <option>Processing</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default TableOrders;
