import React from 'react'
import { Pagination } from "@mui/material";
const PaginationTable = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4 sha">
    <Pagination
      count={totalPages} // จำนวนหน้าทั้งหมด
      page={currentPage} // หน้าปัจจุบัน
      onChange={onPageChange} // ฟังก์ชันเมื่อเปลี่ยนหน้า
      color="primary"
      variant="outlined"
      shape="rounded"
      showFirstButton
      showLastButton
    />
  </div>
  )
}

export default PaginationTable
