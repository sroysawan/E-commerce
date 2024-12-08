// ฟังก์ชันสำหรับแปลง name เป็น slug (พิมพ์เล็กทั้งหมด)
// export const createSlug = (name) => {
//     return name.toLowerCase().replace(/\s+/g, "-"); // เปลี่ยนช่องว่างเป็น - และทำให้พิมพ์เล็กทั้งหมด
//   }
export const createSlug = (name) => {

  if (!name) return '';
  
  // ตรวจสอบว่าเป็นข้อความภาษาไทยหรือไม่ โดยใช้ช่วงรหัส Unicode ของภาษาไทย
  if (/[\u0E00-\u0E7F]/.test(name)) {
    // ถ้าเป็นภาษาไทย ให้เข้ารหัส URL แบบพิเศษ
    return encodeURIComponent(name.toLowerCase().trim());
  }
  return name
    .toLowerCase() // แปลงเป็นตัวพิมพ์เล็ก
    .replace(/[^a-z0-9\s-]/g, "") // ลบอักขระพิเศษ เช่น (), /, ฯลฯ
    .replace(/\s+/g, "-") // แทนที่ช่องว่างด้วยเครื่องหมาย -
    .replace(/-+/g, "-") // ลด - ซ้ำๆ ให้เหลือเพียงตัวเดียว
    .trim(); // ลบช่องว่างส่วนเกิน
};


  // ฟังก์ชันสำหรับแปลงตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่
export const capitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};


