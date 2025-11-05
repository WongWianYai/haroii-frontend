import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderHistoryItem, OrderHistoryResponse, OrderStatus } from "@/types";
import { API_URL } from "@/config";

const OrderHistory: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (search.trim()) {
        params.append("tableNo", search.trim());
      }
      if (dateFrom) {
        params.append("dateFrom", dateFrom);
      }
      if (dateTo) {
        params.append("dateTo", dateTo);
      }

      const url = `${API_URL}/api/v1/orders/history?${params}`;

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch order history: ${res.status} ${res.statusText}`);
      }

      const response = await res.json();
      
      // Handle the actual backend response format: { success: true, data: [...], pagination: {...} }
      const ordersArray = Array.isArray(response.data) ? response.data : [];
      setOrderHistory(ordersArray);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalOrders(response.pagination?.total || 0);
    } catch (err: any) {
      console.error("❌ Failed to fetch order history:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setOrderHistory([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrderHistory();
  }, [currentPage, statusFilter, search, dateFrom, dateTo]);

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      const params = new URLSearchParams({ format });
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (search.trim()) {
        params.append("tableNo", search.trim());
      }
      if (dateFrom) {
        params.append("dateFrom", dateFrom);
      }
      if (dateTo) {
        params.append("dateTo", dateTo);
      }

      const res = await fetch(`${API_URL}/api/v1/orders/export?${params}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to export orders");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order_history_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("การส่งออกข้อมูลล้มเหลว");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { label: "รอดำเนินการ", variant: "secondary" as const },
      IN_PROGRESS: { label: "กำลังทำ", variant: "default" as const },
      READY: { label: "พร้อมเสิร์ฟ", variant: "outline" as const },
      SERVED: { label: "เสิร์ฟแล้ว", variant: "default" as const },
      CANCELLED: { label: "ยกเลิก", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotalIncome = () => {
    return orderHistory.reduce((total, order) => total + order.total, 0);
  };

  const getStatusBreakdown = () => {
    const statusConfig = {
      PENDING: { label: "รอดำเนินการ", color: "text-yellow-600" },
      IN_PROGRESS: { label: "กำลังทำ", color: "text-blue-600" },
      READY: { label: "พร้อมเสิร์ฟ", color: "text-orange-600" },
      SERVED: { label: "เสิร์ฟแล้ว", color: "text-green-600" },
      CANCELLED: { label: "ยกเลิก", color: "text-red-600" },
    };

    const breakdown = Object.entries(statusConfig).map(([status, config]) => {
      const orders = orderHistory.filter(order => order.status === status);
      const total = orders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        status: status as OrderStatus,
        count: orders.length,
        total,
        label: config.label,
        color: config.color,
      };
    });

    return breakdown.filter(item => item.count > 0);
  };

  if (loading) {
    return <div className="p-4 text-gray-500">กำลังโหลดประวัติออเดอร์...</div>;
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">ประวัติออเดอร์</h1>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchOrderHistory} variant="outline">
            ลองใหม่
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ประวัติออเดอร์</h1>
        <div className="text-sm text-gray-600">
          ทั้งหมด {totalOrders} รายการ
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">รายได้รวม</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(calculateTotalIncome())}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              💰
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">จำนวนออเดอร์</p>
              <p className="text-2xl font-bold text-green-900">
                {orderHistory.length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              📋
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">ค่าเฉลี่ยต่อออเดอร์</p>
              <p className="text-2xl font-bold text-purple-900">
                {orderHistory.length > 0 ? formatCurrency(calculateTotalIncome() / orderHistory.length) : formatCurrency(0)}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
          {(dateFrom || dateTo) && (
            <div className="mt-2 text-xs text-purple-600">
              {dateFrom && dateTo ? `${dateFrom} ถึง ${dateTo}` : 
               dateFrom ? `ตั้งแต่ ${dateFrom}` : 
               `จนถึง ${dateTo}`}
            </div>
          )}
        </div>
      </div>



      {/* Status Breakdown */}
      {orderHistory.length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">สถิติตามสถานะ</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {getStatusBreakdown().map(({ status, count, total, label, color }) => (
              <div key={status} className="text-center">
                <div className={`text-lg font-bold ${color}`}>{count}</div>
                <div className="text-xs text-gray-600">{label}</div>
                <div className="text-xs font-medium">{formatCurrency(total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input
          placeholder="ค้นหาหมายเลขโต๊ะ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")} value={statusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="PENDING">รอดำเนินการ</SelectItem>
            <SelectItem value="IN_PROGRESS">กำลังทำ</SelectItem>
            <SelectItem value="READY">พร้อมเสิร์ฟ</SelectItem>
            <SelectItem value="SERVED">เสิร์ฟแล้ว</SelectItem>
            <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="วันที่เริ่มต้น"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <Input
          type="date"
          placeholder="วันที่สิ้นสุด"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />

        <div className="flex gap-2">
          <Button onClick={() => handleExport("csv")} size="sm">
            CSV
          </Button>
          <Button variant="secondary" onClick={() => handleExport("xlsx")} size="sm">
            Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสออเดอร์</TableHead>
              <TableHead>โต๊ะ</TableHead>
              <TableHead>รายการ</TableHead>
              <TableHead>ยอดรวม</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่สั่ง</TableHead>
              <TableHead>ระยะเวลา (นาที)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderHistory && orderHistory.length > 0 && orderHistory.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {(order.originalOrderId || order.id).slice(-8)}
                </TableCell>
                <TableCell className="font-semibold">
                  {order.tableNo}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.name} x{item.qty}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        และอีก {order.items.length - 2} รายการ
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-sm">
                  {order.orderCreatedAt ? formatDateTime(order.orderCreatedAt) : '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {order.sessionDuration ? Math.round(order.sessionDuration / 60) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {(!orderHistory || orderHistory.length === 0) && !loading && (
        <div className="text-center py-8 text-gray-500">
          ไม่พบประวัติออเดอร์
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </Button>
          
          <span className="text-sm text-gray-600">
            หน้า {currentPage} จาก {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
