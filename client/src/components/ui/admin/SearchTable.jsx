import React from 'react'

const SearchTable = ({handleSearch,textSearch}) => {
  return (
    <div className="flex items-center space-x-4 text-sm xl:text-base">
          <p>ค้นหา</p>
          <input
            type="text"
            onChange={handleSearch}
            placeholder={textSearch}
            className="border border-gray-300 rounded-lg px-2 xl:px-4 py-1.5 xl:py-2 focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
  )
}

export default SearchTable
