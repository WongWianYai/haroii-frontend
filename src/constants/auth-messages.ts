export const AUTH_ERROR_MESSAGES = {
    'invalid-credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'email-already-exists': 'อีเมลนี้ถูกใช้งานแล้ว',
    'invalid-email': 'อีเมลไม่ถูกต้อง',
    'invalid-password': 'รหัสผ่านไม่ถูกต้อง',
    'password-too-short': 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
    'passwords-not-match': 'รหัสผ่านไม่ตรงกัน',
    'server-error': 'เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง',
    'network-error': 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
    'unknown-error': 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง',
    'unauthorized': 'กรุณาเข้าสู่ระบบ',
    'session-expired': 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
} as const;

// Type for error codes
export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;