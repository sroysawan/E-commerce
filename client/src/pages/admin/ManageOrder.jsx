import React from 'react'
import TableOrders from '../../components/admin/TableOrders'
import TableOrderPagination from '../../components/admin/TableOrderPagination'

const ManageOrder = () => {
  return (
    <div className="container mx-auto">
      {/* <TableOrders /> */}
      <TableOrderPagination />
    </div>
  )
}

export default ManageOrder
