import React from "react";

const EntriesPerPageSelect = ({ limit, total, onLimitChange, totalItems }) => {
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2 text-sm md:text-base">
        <label>Show</label>
        <select
          value={limit}
          onChange={onLimitChange}
          className="border rounded-md py-0.5 px-2.5 md:px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={total}>All</option>
        </select>
        <label>entries per page</label>
      </div>
      {/* <div>
        <p>ทั้งหมด {totalItems} รายการ</p>
      </div> */}
    </div>
  );
};

export default EntriesPerPageSelect;
