import React from 'react'
import { Pagination } from "@mui/material";
const PaginationProduct = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex justify-center">
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
