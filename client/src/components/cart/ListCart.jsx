import { ListCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createUserCart } from "../../api/user";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";
const ListCart = () => {
  const { id } = useParams()
  const user = useEcomStore((state) => state.user);
  const cart = useEcomStore((state) => state.carts);
  //axios interceptor
  const token = useEcomStore((state) => state.token);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);

  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const cartIds = cart.map((item) => item.id); // ดึง ID ทั้งหมดจากตะกร้า
    const urlIds = id ? id.split("-").map(Number) : []; // แปลงจาก URL เป็น array ของ ID

    // ตรวจสอบว่า IDs ใน URL ตรงกับสินค้าในตะกร้าหรือไม่
    if (urlIds.length === 0 || !urlIds.every((id) => cartIds.includes(id))) {
      navigate("/"); // กลับหน้าโฮม หากไม่มีสินค้า หรือ URL ไม่ถูกต้อง
    }
  }, [id, cart, navigate]);



  const handleSaveCart = async () => {
    await createUserCart(token, { cart })
      .then((res) => {
        // console.log(res);
        toast.success("Add to Cart Success");
        navigate("/checkout");
      })
      .catch((error) => {
        toast.warning(error.response.data.message);
        setErrorMsg(error.response.data.message);
        console.log(errorMsg);
      });
    // console.log('save cart')
  };
  return (
    <div className="bg-gray-300 w-full h-full xl:rounded-lg px-2 py-1 xl:p-4">
      <div className="flex gap-4 items-center py-2 mb-3 xl:py-0">
        <ListCheck size={36} />
        <h1 className="font-bold text-xl xl:text-2xl ">
          รายการสินค้า {cart.length} สินค้า
        </h1>
      </div>

     <div className="grid grid-cols-1 gap-4 h-full xl:grid-cols-[2fr,1fr] ">
          <div className="rounded-lg h-[50vh] xl:h-[49vh] xl:p-0 xl:border-0 overflow-y-auto xl:pr-1 ">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-2 rounded-md shadow-md mb-4"
              >
                {/* Row 1 */}
                <div className="flex justify-between mb-2">
                  {/* Left  */}
                  <div className="flex gap-2 items-center">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center text-center">
                        No Image
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm md:text-base">{item.title}</p>
                      <p className="text-sm">
                        {numberFormat(item.price)} x {item.count}
                      </p>
                    </div>
                  </div>
                  {/* Right  */}
                  <div className="font-bold text-blue-600 flex items-center">
                    {numberFormat(item.price * item.count)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        <div className="rounded-lg w-full">
          {/* Right  */}
          <div className=" bg-white  rounded-lg p-2 xl:p-4 shadow-md space-y-2 xl:space-y-4">
            <h1 className="text-xl xl:text-2xl font-bold">ยอดรวม</h1>
            <div className="flex justify-between items-center">
              <span className="text-lg xl:text-xl">รวมสุทธิ</span>
              <span className="text-lg xl:text-xl">{numberFormat(getTotalPrice())}</span>
            </div>
            <div className="flex flex-col gap-2">
              {user ? (
                cart.length > 0 ? (
                  // แสดงปุ่มสั่งซื้อที่ใช้งานได้
                  <Link>
                    <button
                      className="bg-red-600 text-white text-sm xl:text-base w-full rounded-lg py-2 shadow-md hover:bg-red-700"
                      onClick={handleSaveCart}
                    >
                      สั่งซื้อ
                    </button>
                  </Link>
                ) : (
                  // แสดงปุ่มสั่งซื้อที่ disabled
                  <Link>
                    <button
                      className="bg-black text-white text-sm xl:text-base  w-full rounded-lg py-2 shadow-md "
                      disabled
                    >
                      ไม่มีสินค้า
                    </button>
                  </Link>
                )
              ) : (
                // แสดงปุ่ม Login
                <Link to={"/login"}>
                  <button className="bg-blue-600 text-white text-sm xl:text-base w-full rounded-lg py-2 shadow-md hover:bg-blue-700">
                    Login
                  </button>
                </Link>
              )}

              <Link to={"/cart"}>
                <button
                  className="bg-gray-500 text-white text-sm xl:text-base w-full 
                            rounded-lg py-2 shadow-md hover:bg-gray-700"
                >
                  แก้ไขรายการ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCart;
