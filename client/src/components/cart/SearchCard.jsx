import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SearchCard = () => {
    const getProduct = useEcomStore((state)=> state.getProduct)
    const products = useEcomStore((state)=> state.products)

    const actionSearchFilters = useEcomStore((state)=> state.actionSearchFilters)

    const getCategory = useEcomStore((state)=> state.getCategory)
    const categories = useEcomStore((state)=> state.categories)

    const [text,setText] = useState('')
    const [categorySelected, setCategorySelected] = useState([])
    const [price, setPrice] = useState([0,30000])
    const [ok,setOk] = useState(false)


    useEffect(()=>{
        getCategory()
    },[])
    // console.log(categories)

    //step 1 search text title
    useEffect(()=>{
        //หน่วงเวลาการค้นหา เผื่อ server เดดสะมอเล่
        const delay = setTimeout(()=>{

            //ถ้ามีข้อความให้ search
            if(text){
                actionSearchFilters({
                    query: text
                })
            }else{
                //ถ้าไม่มีจะโชว์ Product เหมือนเดิม
                getProduct()
            }
            //clear 
            return ()=> clearTimeout(delay)
        },300)
    },[text]) //จะจ้องมองการทำงานของ text ตลอดเวลา จะเรียก useEffect ทุกครั้งที่มีการ search
    // console.log(text)

    //step 2 search by category
    const handleCheck =(e)=> {
        // console.log(e.target.value)
        const inCheck  = e.target.value //ค่าที่เราติ๊ก
        const inState = [...categorySelected] //[] empty array ค่าที่ติ๊กต้องมาอยู่ในนี้
        const findCheck = inState.indexOf(inCheck) //indexOf เข้าไปหา array ในนั้น ถ้าเจอได้ตำแหน่ง ถ้าไม่เจอจะ return -1
        
        if(findCheck === -1){
            inState.push(inCheck) 
        }else{
            inState.splice(findCheck,1)
        }
        setCategorySelected(inState)

        //ถ้าติ๊กเลือกจะส่งค่าไป backend
        if(inState.length > 0){
            //ส่งค่าไป backend
            actionSearchFilters({
                category: inState
            })
        }else{
            //ถ้าไม่ติ๊กเลย จะให้แสดงProduct
            getProduct()
        }
    }
    console.log(categorySelected)

    //step 3 search price
    useEffect(()=>{
        actionSearchFilters({ price })
    },[ok])
    const handelPrice = (value)=>{
        // console.log(value)
        setPrice(value)
        setTimeout(()=>{
            setOk(!ok)
        },300)
    }
  return (
    <div>
        <h1 className='mb-4 text-xl font-bold'>ค้นหาสินค้า</h1>
        {/* Search By Text  */}
        <input 
        onChange={(e)=> setText(e.target.value)}
            type="text" 
            placeholder='Search ....'
            className='border rounded-md w-full mb-4 px-2'/>
            <hr />

            {/* Search By Category  */}
            <div>
                <h1>หมวดหมู่สินค้า</h1>
                <div>
                {
                    categories.map((item,index)=>
                        <div className='flex items-center gap-2 text-xl'>
                            <input 
                                type="checkbox" 
                                value={item.id}
                                onChange={handleCheck}
                            />
                            <label>{item.name}</label>
                        </div>
                    )
                }
                </div>
            </div>
                <hr />
            {/* Search Price  */}
            <div>
                <h1>ค้นหาราคา</h1>
                <div>
                    <div className='flex justify-between'>
                        <span>Min : {price[0]}</span>
                        <span>Max : {price[1]}</span>
                    </div>
                    <Slider  
                        onChange={handelPrice}
                        range
                        min={0}
                        max={100000}
                        defaultValue={[0,30000]}
                    />
                </div>
            </div>
    </div>
  )
}

export default SearchCard
