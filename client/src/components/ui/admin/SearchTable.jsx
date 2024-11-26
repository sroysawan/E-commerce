import React from 'react'

const SearchTable = ({handleSearch}) => {
  return (
    <div className="flex items-center space-x-4">
          <p>ค้นหา</p>
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search User"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
  )
}

export default SearchTable
