import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";
const CartCard = () => {
  const navigate = useNavigate();
  const carts = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore(
    (state) => state.actionUpdateQuantity
  );
  const actionRemoveProduct = useEcomStore(
    (state) => state.actionRemoveProduct
  );
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);

  const handleNavigateToCartCheck = () => {
    if (carts.length > 0) {
      navigate(`/cartcheck/${carts.map((item) => item.id).join("-")}`);
    } else {
      navigate('/'); // กลับหน้าโฮมหากไม่มีสินค้าในตะกร้า
    }
  };
  

  return (
    <div className="sticky top-24 grid grid-rows-[auto,1fr,auto] h-full bg-gray-300 xl:rounded px-2 py-1 xl:p-4">
        <h1 className="text-xl xl:text-2xl font-bold py-2 xl:py-0">
          มีสินค้าในตะกร้า {carts.length} ชิ้น
        </h1>

        {/* เช็คเงื่อนไข ถ้าไม่มีสินค้า */}
        {carts.length === 0 ? (
          <div className="border p-2 h-[60vh] overflow-y-auto mb-3">
            <div className="flex-1 flex items-center justify-center my-2 text-red-500 text-2xl font-bold">
              ไม่มีสินค้าในตะกร้า
            </div>
          </div>
        ) : (
          <div className="rounded-lg md:pr-1 h-[60vh] overflow-y-auto mb-3">
            {/* Card */}
            {carts.map((item, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-md shadow-md mb-2"
              >
                {/* Row 1 */}
                <div className="flex justify-between mb-2">
                  {/* Left */}
                  <div className="flex gap-2 items-center">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        className="w-16 h-16 rounded-md object-cover"
                        alt={`Product ${item.title || "No title"}`}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center text-center">
                        No Image
                      </div>
                    )}
                    <div>
                      <p className="text-sm md:text-base font-bold">{item.title}</p>
                      <p className="text-xs md:text-sm line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  {/* Right */}
                  <div
                    className="text-red-600 hover:scale-105 p-2 hover:cursor-pointer"
                    onClick={() => actionRemoveProduct(item.id)}
                  >
                    <Trash2 />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex justify-between items-center">
                  <div className="border rounded-sm p-1 space-x-2 flex items-center">
                    <button
                      className="px-2 py-1 text-red-500 bg-white border border-red-500 rounded-md hover:bg-red-500 duration-200 hover:text-white"
                      onClick={() =>
                        actionUpdateQuantity(item.id, item.count - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-4 py-1">{item.count}</span>

                    {item.quantity <= item.count ? (
                      <button
                        className="px-2 py-1 bg-gray-300 border border-gray-500 rounded-md"
                        disabled={item.quantity <= item.count}
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 text-red-500 bg-white border border-red-500 rounded-md hover:bg-red-500 duration-200 hover:text-white"
                        onClick={() =>
                          actionUpdateQuantity(item.id, item.count + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  {/* <div>
                  {item.quantity <= item.count && (
                    <span className="text-red-600 text-sm font-bold">สินค้าคงเหลือ {item.quantity} ชิ้น</span>
                  )}
                </div> */}
                  <div className="font-bold text-blue-600">
                    {numberFormat(item.price * item.count)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ส่วนปุ่มดำเนินการชำระเงิน */}

        <div className="bg-white p-2 rounded-md shadow-md mt-2 mb-2">
          <div className="flex justify-between px-2 mb-2">
            <span>รวม</span>
            <span>{numberFormat(getTotalPrice())}</span>
          </div>

          {carts.length !== 0 ? (
            
              <button className="mt-2 md:mt-4 bg-green-500 text-white w-full py-2 rounded-md shadow-md hover:bg-green-700"
              onClick={handleNavigateToCartCheck}>
                ดำเนินการชำระเงิน
              </button>
            
          ) : (
            <button
              className="bg-black mt-2 md:mt-4 text-white w-full rounded-md py-2 shadow-md "
              disabled
            >
              ไม่มีสินค้า
            </button>
          )}
        </div>
      {/* </div> */}
    </div>
  );
};

export default CartCard;
