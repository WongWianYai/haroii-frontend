"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CheckCircle, AlertTriangle, Loader2, RefreshCw, CreditCard } from "lucide-react";
import { API_URL, API_BASE_PATH } from "@/config";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  tableSessionId: string;
  tableNo: string;
  totalAmount: number;
  onPaymentConfirmed: () => void;
}

export default function PaymentPopup({
  isOpen,
  onClose,
  tableSessionId,
  tableNo,
  totalAmount,
  onPaymentConfirmed,
}: PaymentPopupProps) {
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const confirmingRef = useRef(false); // Prevent duplicate confirmation calls

  const getAuthHeaders = (): Record<string, string> => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const generateQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}${API_BASE_PATH}/billing/generate-qr`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ tableSessionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // User-friendly error messages
        let errorMessage = "เกิดข้อผิดพลาดในการสร้าง QR Code";
        
        if (response.status === 404) {
          errorMessage = errorData.message || "ไม่พบโต๊ะหรือออเดอร์ กรุณาตรวจสอบอีกครั้ง";
        } else if (response.status === 400) {
          errorMessage = errorData.message || "ข้อมูลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
        } else if (response.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบใหม่";
        } else if (response.status === 500) {
          errorMessage = errorData.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        } else {
          errorMessage = errorData.message || `เกิดข้อผิดพลาด (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
      setPaymentId(data.paymentId);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error("Error generating QR code:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการสร้าง QR Code กรุณาลองใหม่อีกครั้ง");
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [tableSessionId]);

  const confirmPayment = useCallback(async () => {
    if (!paymentId) return;
    
    // Prevent duplicate confirmation calls (debouncing)
    if (confirmingRef.current) {
      console.log("Payment confirmation already in progress, ignoring duplicate call");
      return;
    }

    try {
      confirmingRef.current = true;
      setConfirming(true);
      setError(null);

      const response = await fetch(
        `${API_URL}${API_BASE_PATH}/billing/confirm-payment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ paymentId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // User-friendly error messages
        let errorMessage = "เกิดข้อผิดพลาดในการยืนยันการชำระเงิน";
        
        if (response.status === 404) {
          errorMessage = "ไม่พบข้อมูลการชำระเงิน กรุณาลองใหม่อีกครั้ง";
        } else if (response.status === 400) {
          errorMessage = errorData.message || "ไม่สามารถยืนยันการชำระเงินได้ อาจถูกยืนยันไปแล้ว";
        } else if (response.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบใหม่";
        } else if (response.status === 500) {
          errorMessage = "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
        } else {
          errorMessage = errorData.message || `เกิดข้อผิดพลาด (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      // Call the callback to notify parent component
      onPaymentConfirmed();
      
      // Close popup after successful confirmation
      onClose();
    } catch (err: any) {
      console.error("Error confirming payment:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการยืนยันการชำระเงิน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setConfirming(false);
      confirmingRef.current = false;
    }
  }, [paymentId, onPaymentConfirmed, onClose]);

  // Generate QR code when popup opens
  useEffect(() => {
    if (isOpen && tableSessionId) {
      generateQRCode();
    } else {
      // Reset state when popup closes
      setQrCodeUrl(null);
      setPaymentId(null);
      setError(null);
      setLoading(false);
      setConfirming(false);
      setRetryCount(0);
      confirmingRef.current = false;
    }
  }, [isOpen, tableSessionId, generateQRCode]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 fade-in duration-200">
        <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="relative border-b border-gray-200 bg-gradient-to-r from-[#F38DA9]/5 to-[#e07d97]/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#F38DA9]" />
                ชำระเงิน - โต๊ะ {tableNo}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-300">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-[#F38DA9] animate-spin mb-4" />
                  <div className="absolute inset-0 w-12 h-12 bg-[#F38DA9]/20 rounded-full animate-ping" />
                </div>
                <p className="text-gray-600 font-medium">กำลังสร้าง QR Code...</p>
                <p className="text-gray-400 text-sm mt-2">กรุณารอสักครู่</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top duration-300">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">{error}</p>
                    {retryCount > 0 && (
                      <p className="text-red-600 text-sm mt-1">
                        ความพยายามครั้งที่ {retryCount}
                      </p>
                    )}
                    <Button
                      onClick={generateQRCode}
                      variant="outline"
                      size="sm"
                      className="mt-3 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                      disabled={loading}
                    >
                      <RefreshCw className="w-4 h-4" />
                      ลองอีกครั้ง
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Display */}
            {qrCodeUrl && !loading && !error && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                {/* QR Code Image */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-200 hover:border-[#F38DA9]/30 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <img
                      src={qrCodeUrl}
                      alt="PromptPay QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </div>

                {/* Amount Display */}
                <div className="bg-gradient-to-r from-[#F38DA9]/10 to-[#e07d97]/10 rounded-lg p-4 border border-[#F38DA9]/20 hover:border-[#F38DA9]/40 transition-all duration-300">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1 font-medium">ยอดเงินรวม</p>
                    <p className="text-3xl font-bold text-[#F38DA9] animate-in zoom-in duration-300">
                      ฿{totalAmount.toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100/50 transition-colors duration-200">
                  <p className="text-sm text-blue-800 text-center leading-relaxed">
                    กรุณาสแกน QR Code เพื่อชำระเงิน
                    <br />
                    หลังจากชำระเงินแล้ว กดปุ่ม "ยืนยันการชำระเงิน"
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={confirmPayment}
                    disabled={confirming}
                    className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold h-12 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {confirming ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        กำลังยืนยัน...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ยืนยันการชำระเงิน
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    disabled={confirming}
                    className="px-6 h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
