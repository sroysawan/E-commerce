import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { numberFormat } from "../../utils/number";
const SearchCard = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  const actionSearchFilters = useEcomStore(
    (state) => state.actionSearchFilters
  );

  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [text, setText] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);
  const [price, setPrice] = useState([0, 30000]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  //step 1 search text title
  useEffect(() => {
    //หน่วงเวลาการค้นหา เผื่อ server เดดสะมอเล่
    const delay = setTimeout(() => {
      //ถ้ามีข้อความให้ search
      if (text) {
        actionSearchFilters({
          query: text,
        });
      } else {
        //ถ้าไม่มีจะโชว์ Product เหมือนเดิม
        getProduct();
      }
      //clear
      return () => clearTimeout(delay);
    }, 300);
  }, [text]); //จะจ้องมองการทำงานของ text ตลอดเวลา จะเรียก useEffect ทุกครั้งที่มีการ search
  // console.log(text)

  //step 2 search by category
  const handleCheck = (e) => {
    // console.log(e.target.value)
    const inCheck = e.target.value; //ค่าที่เราติ๊ก
    const inState = [...categorySelected]; //[] empty array ค่าที่ติ๊กต้องมาอยู่ในนี้
    const findCheck = inState.indexOf(inCheck); //indexOf เข้าไปหา array ในนั้น ถ้าเจอได้ตำแหน่ง ถ้าไม่เจอจะ return -1

    if (findCheck === -1) {
      inState.push(inCheck);
    } else {
      inState.splice(findCheck, 1);
    }
    setCategorySelected(inState);

    //ถ้าติ๊กเลือกจะส่งค่าไป backend
    if (inState.length > 0) {
      //ส่งค่าไป backend
      actionSearchFilters({
        category: inState,
      });
    } else {
      //ถ้าไม่ติ๊กเลย จะให้แสดงProduct
      getProduct();
    }
  };
  // console.log(categorySelected)

  //step 3 search price
  useEffect(() => {
    actionSearchFilters({ price });
  }, [ok]);
  const handelPrice = (value) => {
    // console.log(value)
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };
  return (
    <div className="sticky top-24 grid gap-y-5 grid-rows-[15%_30%_15%] h-[87vh]">
      <div className="bg-gray-300 shadow-lg p-4 rounded-xl">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">ค้นหาสินค้า</h1>
          {/* Search By Text  */}
          <div className="relative">
            <input
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="ค้นหาสินค้า"
              // className="border rounded-md w-full mb-4 px-2"
              className="w-full h-10 py-1 rounded-lg border border-black p-4 text-md shadow-md hover:border-black"
            />
            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-300 shadow-lg p-4 rounded-xl">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">หมวดหมู่สินค้า</h1>
          <div>
            {categories.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-lg">
                <input
                  type="checkbox"
                  className="size-4 rounded border-gray-300 hover:cursor-pointer"
                  value={item.id}
                  onChange={handleCheck}
                />
                <label>{item.name}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-300 shadow-lg p-4 rounded-xl">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">ค้นหาราคา</h1>
          <div>
            <div className="flex justify-between">
              <span>Min : {numberFormat(price[0])}</span>
              <span>Max : {numberFormat(price[1])}</span>
            </div>
            <Slider
              onChange={handelPrice}
              range
              min={0}
              max={30000}
              defaultValue={[0, 30000]}
            />
          </div>
        </div>
      </div>

      {/* Search By Category  */}
      {/* <div className="space-y-2">
        <h1 className="text-xl font-bold">หมวดหมู่สินค้า</h1>
        <div>
          {categories.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-lg" >
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300 hover:cursor-pointer"
                value={item.id}
                onChange={handleCheck}
              />
              <label>{item.name}</label>
            </div>
 
          ))}
        </div>
      </div>
      <hr /> */}
      {/* Search Price  */}
      {/* <div className="space-y-2">
        <h1 className="text-xl font-bold">ค้นหาราคา</h1>
        <div>
          <div className="flex justify-between">
            <span>Min : {numberFormat(price[0])}</span>
            <span>Max : {numberFormat(price[1])}</span>
          </div>
          <Slider
            onChange={handelPrice}
            range
            min={0}
            max={30000}
            defaultValue={[0, 30000]}
          />
        </div>
      </div> */}
    </div>
  );
};

export default SearchCard;
