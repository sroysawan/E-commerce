// ฟังก์ชันสำหรับแปลง name เป็น slug (พิมพ์เล็กทั้งหมด)
export const createSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-"); // เปลี่ยนช่องว่างเป็น - และทำให้พิมพ์เล็กทั้งหมด
  }

  // ฟังก์ชันสำหรับแปลงตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่
export const capitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};


