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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderHistoryItem, OrderHistoryResponse, OrderStatus } from "@/types";
import { API_URL } from "@/config";

const OrderHistory: React.FC = () => {
  const [allOrders, setAllOrders] = useState<OrderHistoryItem[]>([]); // All orders from API
  const [filteredOrders, setFilteredOrders] = useState<OrderHistoryItem[]>([]); // Filtered orders for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Sorting states
  type SortField = "id" | "tableNo" | "items" | "total" | "status" | "date";
  type SortOrder = "asc" | "desc";
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: "1",
        limit: "1000", // Fetch more orders for client-side filtering
      });

      // Only send backend-supported filters
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
      setAllOrders(ordersArray);
      setTotalOrders(response.pagination?.total || ordersArray.length);
    } catch (err: any) {
      console.error("❌ Failed to fetch order history:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering and sorting
  const applyFilters = () => {
    let filtered = [...allOrders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by menu item name (search in items)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.items.some(item => 
          item.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "id":
          comparison = a.id.localeCompare(b.id);
          break;
        case "tableNo":
          comparison = a.tableNo.localeCompare(b.tableNo);
          break;
        case "items":
          const aItems = a.items.length;
          const bItems = b.items.length;
          comparison = aItems - bItems;
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "date":
          const aDate = a.orderCreatedAt ? new Date(a.orderCreatedAt).getTime() : 0;
          const bDate = b.orderCreatedAt ? new Date(b.orderCreatedAt).getTime() : 0;
          comparison = aDate - bDate;
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / 20));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleOrderClick = (order: OrderHistoryItem) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    applyFilters();
  };

  const handleReset = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setSortField("date");
    setSortOrder("desc");
    setCurrentPage(1);
    setFilteredOrders(allOrders);
  };

  // Fetch orders when date filters change
  useEffect(() => {
    fetchOrderHistory();
  }, [dateFrom, dateTo]);

  // Apply filters when allOrders, filters, or sorting changes
  useEffect(() => {
    applyFilters();
  }, [allOrders, statusFilter, searchTerm, sortField, sortOrder]);

  const handleExport = async (format: "csv") => {
    try {
      // Export filtered orders as CSV with only: รายการ, จำนวน, ยอดรวม, วันที่สั่ง
      const headers = ["รายการ", "จำนวน", "ยอดรวม", "วันที่สั่ง"];
      const csvRows = [headers.join(",")];
      
      filteredOrders.forEach(order => {
        // Create a row for each item in the order
        order.items.forEach(item => {
          const orderDate = order.orderCreatedAt 
            ? formatDateTime(order.orderCreatedAt)
            : "-";
          
          const row = [
            `"${item.name}"`,
            item.qty,
            item.lineTotal || (item.price * item.qty),
            `"${orderDate}"`
          ];
          csvRows.push(row.join(","));
        });
      });
      
      const csvContent = csvRows.join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order_history_${new Date().toISOString().split('T')[0]}.csv`;
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
      PENDING: { 
        label: "รอดำเนินการ", 
        className: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200" 
      },
      IN_PROGRESS: { 
        label: "กำลังทำ", 
        className: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200" 
      },
      READY: { 
        label: "พร้อมเสิร์ฟ", 
        className: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200" 
      },
      SERVED: { 
        label: "เสิร์ฟแล้ว", 
        className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200" 
      },
      CANCELLED: { 
        label: "ยกเลิก", 
        className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200" 
      },
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
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
    return filteredOrders.reduce((total, order) => total + order.total, 0);
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
      const orders = filteredOrders.filter(order => order.status === status);
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
                {filteredOrders.length}
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
                {filteredOrders.length > 0 ? formatCurrency(calculateTotalIncome() / filteredOrders.length) : formatCurrency(0)}
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
      {filteredOrders.length > 0 && (
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
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="ค้นหาชื่อเมนู..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")} value={statusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
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
        </div>

        <div className="flex gap-2 justify-between">
          <Button onClick={handleReset} variant="outline">
            🔄 รีเซ็ต
          </Button>
          
          <Button onClick={() => handleExport("csv")} size="sm" variant="outline">
            📄 ส่งออก CSV
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
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center gap-1">
                  ยอดรวม
                  {sortField === "total" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  วันที่สั่ง
                  {sortField === "date" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 && filteredOrders.map((order) => (
              <TableRow 
                key={order.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleOrderClick(order)}
              >
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {(!filteredOrders || filteredOrders.length === 0) && !loading && (
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

      {/* Order Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">รายละเอียดออเดอร์</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">รหัสออเดอร์</p>
                  <p className="font-mono font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">โต๊ะ</p>
                  <p className="font-semibold text-lg">{selectedOrder.tableNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">สถานะ</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">วันที่สั่ง</p>
                  <p className="font-medium">
                    {selectedOrder.orderCreatedAt ? formatDateTime(selectedOrder.orderCreatedAt) : '-'}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-semibold text-lg mb-3">รายการอาหาร</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        {item.note && (
                          <p className="text-sm text-gray-600 mt-1">
                            📝 {item.note}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-600">x{item.qty}</p>
                        <p className="font-semibold">
                          {formatCurrency(item.lineTotal || (item.price * item.qty))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>ยอดรวมทั้งหมด</span>
                  <span className="text-2xl text-blue-600">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <Button onClick={handleCloseModal} variant="outline">
                  ปิด
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderHistory;
