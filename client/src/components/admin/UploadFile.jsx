import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFiles, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";

const UploadFile = ({ form, setForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = useEcomStore((state) => state.token);
  const handleOnchange = (e) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      let allFiles = form.images; //[] empty array
      for (let i = 0; i < files.length; i++) {
        // console.log(files[i]);

        //validate
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not image`);
          continue;
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
                console.log(res);

                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                toast.success("Upload Image Success");
              })
              .catch((error) => {
                console.log(error);
              });
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
            console.log(item)
            return item.public_id !== public_id
        })
        console.log(filterImages)
        setForm({
            ...form,
            images: filterImages
        })
        toast.error(res.data);
    })
    .catch((error)=>{
        console.log(error)
    })
  }


  console.log(form)
  return (
    <div className="my-4">
      <div className="flex mx-4 gap-4 my-4">
        {/*Show image upload*/}
       {
        form.images.map((item,index)=>
            <div className="relative" key={index}>
                <img 
                    src={item.url} 
                    className="w-24 h-24 hover:scale-105"
                />
                <span 
                    className="absolute top-0 right-0 bg-red-700 p-1 rounded"
                    onClick={()=>handleDelete(item.public_id)}
                >X
                </span>
            </div>
        )
       }
      </div>

      <div>
        <input onChange={handleOnchange} type="file" name="images" multiple />
      </div>
    </div>
  );
};

export default UploadFile;
