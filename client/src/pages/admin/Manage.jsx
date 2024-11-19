import React from 'react'
import TableUser from '../../components/admin/TableUser'
import TableUserPagination from '../../components/admin/TableUserPagination'

const Manage = () => {
  return (
    <div className="container mx-auto">
      {/* <TableUser /> */}
      <TableUserPagination/>
    </div>
  )
}

export default Manage
