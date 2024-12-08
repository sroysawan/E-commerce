import React from 'react'
import { Pagination } from "@mui/material";
const PaginationProduct = ({ totalPages, currentPage, onPageChange,totalProducts,startIndex,endIndex }) => {
  return (
    <div className="flex justify-center md:justify-between items-center">
    <p className='hidden md:block text-xs md:text-base text-gray-400'>Showing {startIndex} - {endIndex} of {totalProducts} Products </p>

    <Pagination
      count={totalPages} // จำนวนหน้าทั้งหมด
      page={currentPage} // หน้าปัจจุบัน
      onChange={onPageChange} // ฟังก์ชันเมื่อเปลี่ยนหน้า
      color="error"
      showFirstButton
      showLastButton
    />
  </div>
  )
}

export default PaginationProduct
