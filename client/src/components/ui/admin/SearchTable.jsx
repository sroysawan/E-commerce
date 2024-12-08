import React from 'react'

const SearchTable = ({handleSearch,textSearch}) => {
  return (
    <div className="flex items-center space-x-4 text-sm md:text-base">
          <p>ค้นหา</p>
          <input
            type="text"
            onChange={handleSearch}
            placeholder={textSearch}
            className="border border-gray-300 rounded-lg px-2 md:px-4 py-1.5 md:py-2 focus:ring-1 focus:outline-none focus:ring-blue-500"
          />
        </div>
  )
}

export default SearchTable
