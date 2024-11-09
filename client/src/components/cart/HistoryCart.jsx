import React, { useEffect, useState } from "react";
import { historyUserCart } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import {numberFormat} from '../../utils/number'
import { dateFormat } from '../../utils/dateFormat'

const HistoryCart = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    handleGetOrders(token);
  }, []);

  const handleGetOrders = (token) => {
    historyUserCart(token)
      .then((res) => {
        // console.log(res.data.orders);
        setOrders(res.data.orders);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h1>
      <div className="space-y-4 mt-4">
        {/* Card loop Order  */}
        {orders?.map((item, index) => {
          // console.log(item)
          return (
            <div key={index} className="bg-gray-200 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <div>
                  <p className="text-lg">Order Date</p>
                  <p className="font-bold">วันที่ {dateFormat(item.updatedAt)}</p>
                </div>
                <div>
                  <span  className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-full`}>
                    {item.orderStatus}
                  </span>
                </div>
              </div>
              {/* table loop product  */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        สินค้า
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        ราคา
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        จำนวน
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        รวม
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {item.products?.map((product, index) => {
                    //   console.log(product);
                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            {product.product.title}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {numberFormat(product.product.price)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {product.count}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {numberFormat(product.count * product.product.price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-right">
                <p>ราคาสุทธิ</p>
                <p>{numberFormat(item.cartTotal)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryCart;