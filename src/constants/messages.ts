export const MESSAGES = {
  // Loading states
  LOADING: "กำลังโหลด...",
  
  // Error messages
  ERROR_GENERIC: "เกิดข้อผิดพลาด",
  ERROR_DELETE_MENU: "เกิดข้อผิดพลาดในการลบเมนู",
  ERROR_SAVE_MENU: "เกิดข้อผิดพลาดในการบันทึกเมนู",
  ERROR_UPDATE_DATA: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
  ERROR_FETCH_MENU: "เกิดข้อผิดพลาดในการโหลดเมนู",
  
  // Success messages
  SUCCESS_SAVE: "บันทึกสำเร็จ",
  SUCCESS_DELETE: "ลบสำเร็จ",
  SUCCESS_UPDATE: "อัปเดตสำเร็จ",
  
  // Confirmation messages
  CONFIRM_DELETE_MENU: "คุณต้องการลบเมนูนี้หรือไม่?",
  
  // Empty states
  NO_MENU_ITEMS: "ไม่มีรายการเมนู",
  NO_RESTAURANT_DATA: "ไม่พบข้อมูลร้านอาหาร",
  NO_MENU_IN_CATEGORY: "ไม่พบเมนูในหมวดหมู่",
  
  // Form labels
  SEARCH_BY_CATEGORY: "ค้นหาตามหมวดหมู่:",
  SEARCH_PLACEHOLDER: "พิมพ์หมวดหมู่ที่ต้องการค้นหา...",
  FOUND_ITEMS: "พบ",
  ITEMS_UNIT: "รายการ",
  AVAILABLE_CATEGORIES: "หมวดหมู่ที่มีอยู่:",
  ALL_CATEGORIES: "ทั้งหมด",
  
  // Button labels
  ADD_MENU: "เพิ่มเมนูใหม่",
  EDIT: "แก้ไข",
  DELETE: "ลบ",
  SAVE: "บันทึก",
  CANCEL: "ยกเลิก",
  DISCARD: "ยกเลิก",
  
  // Status
  AVAILABLE: "มีอยู่",
  OUT_OF_STOCK: "หมดสต๊อก",
} as const;