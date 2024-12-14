import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFiles, uploadFiles,  } from "../../../api/product";
import useEcomStore from "../../../store/ecom-store";
import { Loader } from 'lucide-react';
const UploadFile = ({ form, setForm , fileInputRef, setIsUploading,setAllImagesUploaded   }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const fileInputRef = useRef(null); // เพิ่ม useRef
  const token = useEcomStore((state) => state.token);

  const handleOnchange = (e) => {
    setIsLoading(true)
    setIsUploading(true); // แจ้งว่าเริ่มอัปโหลด
    const files = e.target.files
    let uploadedCount = 0; // นับจำนวนรูปที่อัปโหลดสำเร็จ
    const totalFiles = files.length;

    if (files) {
      // setIsLoading(true)
      let allFiles = form.images //[] empty array
      for (let i = 0; i < files.length; i++) {
        // console.log(files[i]);

        //validate
        const file = files[i]
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not image`)
          continue
        }
        // Image Resize
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          //ส่งข้อมูลไป backend
          (data) => {
            //end point backend
            //upload image
            // console.log('data',data)
            uploadFiles(token, data)
              .then((res) => {
                // console.log(res)

                allFiles.push(res.data) // เพิ่มรูปใหม่
                setForm({
                  ...form,
                  images: allFiles,
                }) // อัปเดต form
                uploadedCount++; // นับจำนวนที่อัปโหลดเสร็จ
                setIsLoading(false)
                toast.success("Upload Image Success")
              })
              .catch((error) => {
                console.log(error)
                setIsLoading(false)
              })
              .finally(() => {
                if (uploadedCount === totalFiles) {
                  setIsLoading(false);
                  setIsUploading(false);
                  setAllImagesUploaded(true); // บอกว่ารูปทั้งหมดอัปโหลดเสร็จแล้ว
                }
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""; // ล้างค่าของ input
                }
              })
          },
          //ประเภทการแปลงรหัสไฟล์
          "base64"
        );
      }
    }
  };


  const handleDelete = (public_id)=>{
    // console.log(public_id)
    const images = form.images
    removeFiles(token, public_id)
    .then((res)=> {
        const filterImages = images.filter((item)=>{
            // console.log(item)
            return item.public_id !== public_id
        })
        // console.log(filterImages)
        setForm({
            ...form,
            images: filterImages
        })
        toast.error(res.data)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // ล้างค่าของ input
        }
    })
    .catch((error)=>{
        console.log(error)
    })
  }
  // console.log(form)


  return (
    <div className="my-4">
      <div className="flex md:mx-4 md:gap-4 my-4">
      {
        //ถ้าข้างหน้าเป็น false จะทำ isLoading && ถ้าเป็น true จะทำ loader
        isLoading && <Loader className="animate-spin w-16 h-16"/>
      }
      
        {/*Show image upload*/}
       {
        form.images.map((item,index)=>
            <div className="relative" key={index}>
                <img 
                    src={item.url} 
                    className="w-14 md:w-24 h-14 md:h-24 hover:scale-105"
                    alt={`ProductUpload ${index+1}`}
                />
                <span 
                    className="absolute top-0 right-0 bg-red-700 px-2 py-0.5 rounded-full text-xs md:text-sm cursor-pointer hover:text-white"
                    onClick={()=>handleDelete(item.public_id)}
                >X
                </span>
            </div>
        )
       }
      </div>
      <div>
        <input 
         ref={fileInputRef}
          // className="text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          className="text-base md:text-lg w-64 md:w-96 text-gray-900 border border-gray-300 rounded-lg p-1 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          onChange={handleOnchange} 
          type="file" 
          name="images" 
          multiple />
      </div>
    </div>
  );
};

export default UploadFile;
