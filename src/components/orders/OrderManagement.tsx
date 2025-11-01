"use client";

import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  ChefHat,
  CheckCircle,
  Utensils,
  RefreshCw,
  StickyNote,
  Calendar,
  Hash,
  Trash2,
  Minus,
  X,
  AlertTriangle,
  Save,
  Plus,
  Users,
  Timer,
  Bell,
  Eye,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Zap,
} from "lucide-react";
import { API_URL, API_BASE_PATH } from "@/config";

const statusConfig = {
  PENDING: {
    label: "รอดำเนินการ",
    color: "bg-yellow-50 text-yellow-900 border-yellow-400",
    bgGradient: "from-yellow-50 to-amber-50",
    icon: Clock,
    nextStatus: "IN_PROGRESS" as OrderStatus,
    nextLabel: "เริ่มทำ",
    canCancel: true,
    priority: 1,
    actionColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
  },
  IN_PROGRESS: {
    label: "กำลังทำ",
    color: "bg-indigo-50 text-indigo-900 border-indigo-400",
    bgGradient: "from-indigo-50 to-blue-50",
    icon: ChefHat,
    nextStatus: "READY" as OrderStatus,
    nextLabel: "เสร็จแล้ว",
    canCancel: false,
    priority: 2,
    actionColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
  READY: {
    label: "พร้อมเสิร์ฟ",
    color: "bg-green-50 text-green-900 border-green-400",
    bgGradient: "from-green-50 to-emerald-50",
    icon: CheckCircle,
    nextStatus: "SERVED" as OrderStatus,
    nextLabel: "เสิร์ฟแล้ว",
    canCancel: false,
    priority: 3,
    actionColor: "bg-green-600 hover:bg-green-700 text-white",
  },
  SERVED: {
    label: "เสิร์ฟแล้ว",
    color: "bg-gray-50 text-gray-600 border-gray-300",
    bgGradient: "from-gray-50 to-slate-50",
    icon: Utensils,
    nextStatus: null,
    nextLabel: null,
    canCancel: false,
    priority: 4,
    actionColor: "",
  },
  CANCELLED: {
    label: "ยกเลิกแล้ว",
    color: "bg-red-50 text-red-900 border-red-400",
    bgGradient: "from-red-50 to-rose-50",
    icon: X,
    nextStatus: null,
    nextLabel: null,
    canCancel: false,
    priority: 5,
    actionColor: "",
  },
};
export default function OrderManagement() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">(
    "ALL"
  );
  const [selectedTable, setSelectedTable] = useState<string>("ALL");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editingItems, setEditingItems] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "status">("table");
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const getAuthHeaders = (): Record<string, string> => {
    // Get token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    console.log("Auth token:", token ? "Found" : "Not found");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchTableNumber = async (tableSessionId: string): Promise<string> => {
    try {
      const response = await fetch(
        `${API_URL}${API_BASE_PATH}/table-sessions/${tableSessionId}`,
        {
          credentials: "include",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      if (response.ok) {
        const session = await response.json();
        return session.tableNo || "N/A";
      }
    } catch (err) {
      console.error("Failed to fetch table number:", err);
    }
    return "N/A";
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Always fetch all orders for accurate counts
      const response = await fetch(`${API_URL}${API_BASE_PATH}/orders`, {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      // Fetch table numbers for each order
      const ordersWithTableNumbers = await Promise.all(
        data.map(async (order: Order) => {
          const tableNo = await fetchTableNumber(order.tableSessionId);

          return { ...order, tableNo };
        })
      );

      // Sort orders by creation time (oldest first)
      const sortedOrders = ordersWithTableNumbers.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setAllOrders(sortedOrders);

      // Filter for display based on selected status
      if (selectedStatus === "ALL") {
        setDisplayOrders(sortedOrders);
      } else {
        setDisplayOrders(
          sortedOrders.filter((order: Order) => order.status === selectedStatus)
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    nextStatus: OrderStatus
  ) => {
    try {
      setUpdatingOrder(orderId);
      const response = await fetch(
        `${API_URL}${API_BASE_PATH}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          credentials: "include",
          body: JSON.stringify({ nextStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders after update
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  // เริ่มการแก้ไขออเดอร์
  const startEditingOrder = (orderId: string) => {
    const order = allOrders.find((o) => o._id === orderId);
    if (order) {
      setEditingOrder(orderId);
      setEditingItems([...order.items]); // Copy items for editing
    }
  };

  // ยกเลิกการแก้ไข
  const cancelEditing = () => {
    setEditingOrder(null);
    setEditingItems([]);
  };

  // อัปเดตจำนวนในโหมดแก้ไข (local state)
  const updateEditingItemQuantity = (
    itemIndex: number,
    newQuantity: number
  ) => {
    const updatedItems = [...editingItems];
    if (newQuantity <= 0) {
      // ลบรายการถ้าจำนวนเป็น 0
      updatedItems.splice(itemIndex, 1);
    } else {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        qty: newQuantity,
        lineTotal: updatedItems[itemIndex].price * newQuantity,
      };
    }
    setEditingItems(updatedItems);
  };

  // ลบรายการในโหมดแก้ไข (local state)
  const removeEditingItem = (itemIndex: number) => {
    const updatedItems = [...editingItems];
    updatedItems.splice(itemIndex, 1);
    setEditingItems(updatedItems);
  };

  // บันทึกการแก้ไข
  const saveOrderChanges = async (orderId: string) => {
    if (editingItems.length === 0) {
      if (
        confirm("ไม่มีรายการในออเดอร์ คุณต้องการยกเลิกออเดอร์ทั้งหมดหรือไม่?")
      ) {
        await cancelOrder(orderId);
      }
      return;
    }

    try {
      setUpdatingOrder(orderId);

      const itemsForApi = editingItems.map((item) => ({
        menuItemId: String(item.menuItemId), // Ensure string
        qty: parseInt(String(item.qty)), // Ensure integer
        note: item.note || "", // Ensure string
        options: item.options || {}, // Ensure object
      }));

      // Validate data before sending
      const invalidItems = itemsForApi.filter(
        (item) => !item.menuItemId || isNaN(item.qty) || item.qty <= 0
      );

      if (invalidItems.length > 0) {
        throw new Error("Invalid item data detected");
      }

      const apiUrl = `${API_URL}${API_BASE_PATH}/orders/${orderId}/items`;
      console.log("Sending update request to:", apiUrl);
      console.log("Request data:", { items: itemsForApi });
      console.log("Headers:", getAuthHeaders());

      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ items: itemsForApi }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        });

        if (response.status === 401) {
          throw new Error("ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่");
        } else if (response.status === 403) {
          throw new Error("ไม่มีสิทธิ์ในการแก้ไขออเดอร์นี้");
        } else if (response.status === 404) {
          throw new Error("ไม่พบออเดอร์ที่ต้องการแก้ไข");
        } else {
          throw new Error(
            errorData.message || `เกิดข้อผิดพลาด (${response.status})`
          );
        }
      }

      // Refresh orders and exit editing mode
      await fetchOrders();
      cancelEditing();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ยกเลิกออเดอร์ทั้งหมด
  const cancelOrder = async (orderId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกออเดอร์นี้?")) {
      return;
    }

    try {
      setUpdatingOrder(orderId);
      await updateOrderStatus(orderId, "CANCELLED" as OrderStatus);
      cancelEditing(); // Exit editing mode if active
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Update display orders when filters change
  useEffect(() => {
    let filtered = allOrders;

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Filter by table
    if (selectedTable !== "ALL") {
      filtered = filtered.filter((order) => order.tableNo === selectedTable);
    }

    // Ensure filtered orders are also sorted by time (oldest first)
    const sortedFiltered = filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    setDisplayOrders(sortedFiltered);
  }, [selectedStatus, selectedTable, allOrders]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Use displayOrders instead of filtering again
  const filteredOrders = displayOrders;

  // Helper functions for better organization
  const getOrdersByTable = () => {
    const tableGroups: Record<string, Order[]> = {};
    filteredOrders.forEach((order) => {
      const tableNo = order.tableNo || "N/A";
      if (!tableGroups[tableNo]) {
        tableGroups[tableNo] = [];
      }
      tableGroups[tableNo].push(order);
    });

    // Sort tables numerically
    const sortedTables = Object.keys(tableGroups).sort((a, b) => {
      if (a === "N/A") return 1;
      if (b === "N/A") return -1;
      return parseInt(a) - parseInt(b);
    });

    return sortedTables.map((tableNo) => ({
      tableNo,
      orders: tableGroups[tableNo].sort(
        (a, b) =>
          statusConfig[a.status].priority - statusConfig[b.status].priority
      ),
    }));
  };

  const getOrdersByStatus = () => {
    const statusGroups: Record<OrderStatus, Order[]> = {
      PENDING: [],
      IN_PROGRESS: [],
      READY: [],
      SERVED: [],
      CANCELLED: [],
    };

    filteredOrders.forEach((order) => {
      statusGroups[order.status].push(order);
    });

    return Object.entries(statusGroups)
      .filter(([_, orders]) => orders.length > 0)
      .map(([status, orders]) => ({
        status: status as OrderStatus,
        orders: orders.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      }));
  };

  const getElapsedTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} นาที`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours} ชม. ${mins} นาที`;
    }
  };

  const getUrgencyLevel = (createdAt: string, status: OrderStatus) => {
    const diffMins = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / 60000
    );

    if (status === "PENDING" && diffMins > 15) return "high";
    if (status === "IN_PROGRESS" && diffMins > 30) return "high";
    if (status === "READY" && diffMins > 10) return "high";
    if (diffMins > 10) return "medium";
    return "low";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F38DA9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            กำลังโหลดออเดอร์...
          </p>
          <p className="text-gray-400 text-sm mt-2">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F38DA9] to-[#e07d97] rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    จัดการออเดอร์
                  </h1>
                  <p className="text-sm text-gray-500">
                    {filteredOrders.length} ออเดอร์ทั้งหมด
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
           

              {/* View mode toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode("table")}
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    viewMode === "table" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  ตามโต๊ะ
                </Button>
                <Button
                  onClick={() => setViewMode("status")}
                  variant={viewMode === "status" ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    viewMode === "status" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <List className="w-4 h-4" />
                  ตามสถานะ
                </Button>
              </div>

              {/* Filter toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                ตัวกรอง
              </Button>

              {/* Refresh button */}
              <Button
                onClick={fetchOrders}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                รีเฟรช
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  กรองตามสถานะ
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedStatus === "ALL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("ALL")}
                    className={`flex items-center gap-2 ${
                      selectedStatus === "ALL"
                        ? "bg-[#F38DA9] hover:bg-[#e37795]"
                        : ""
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    ทั้งหมด ({allOrders.length})
                  </Button>
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = allOrders.filter(
                      (order) => order.status === status
                    ).length;
                    const StatusIcon = config.icon;
                    return (
                      <Button
                        key={status}
                        variant={
                          selectedStatus === status ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedStatus(status as OrderStatus)}
                        className={`flex items-center gap-2 ${
                          selectedStatus === status
                            ? "bg-[#F38DA9] hover:bg-[#e37795]"
                            : ""
                        }`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Table Filter */}
              {/* <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  กรองตามโต๊ะ
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTable === "ALL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTable("ALL")}
                    className={`flex items-center gap-2 ${
                      selectedTable === "ALL"
                        ? "bg-[#F38DA9] hover:bg-[#e37795]"
                        : ""
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    ทุกโต๊ะ ({allOrders.length})
                  </Button>
                  {Array.from(
                    new Set(
                      allOrders.map((order) => order.tableNo).filter(Boolean)
                    )
                  )
                    .sort((a, b) => parseInt(a!) - parseInt(b!))
                    .map((tableNo) => {
                      const count = allOrders.filter(
                        (order) => order.tableNo === tableNo
                      ).length;
                      const urgentCount = allOrders.filter(
                        (order) =>
                          order.tableNo === tableNo &&
                          getUrgencyLevel(order.createdAt, order.status) ===
                            "high"
                      ).length;

                      return (
                        <Button
                          key={tableNo}
                          variant={
                            selectedTable === tableNo ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedTable(tableNo!)}
                          className={`flex items-center gap-2 relative ${
                            selectedTable === tableNo
                              ? "bg-[#F38DA9] hover:bg-[#e37795]"
                              : ""
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          โต๊ะ {tableNo} ({count})
                          {urgentCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                              <Bell className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </Button>
                      );
                    })}
                </div>
              </div> */}

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  แสดง {filteredOrders.length} จาก {allOrders.length} ออเดอร์
                </div>
                <Button
                  onClick={() => {
                    setSelectedStatus("ALL");
                    setSelectedTable("ALL");
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="w-3 h-3" />
                  ล้างตัวกรอง
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="sm"
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="space-y-6">
            {getOrdersByTable().map(({ tableNo, orders }) => (
              <div
                key={tableNo}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#F38DA9] to-[#e07d97] rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex justify-between">
                        
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            โต๊ะ {tableNo}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {orders.length} ออเดอร์
                          </p>
                        </div>
                        <div>
                          ราคารวม{" "}
                           {orders.reduce((sum, order) => sum + order.total, 0)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {orders.some(
                        (order) =>
                          getUrgencyLevel(order.createdAt, order.status) ===
                          "high"
                      ) && (
                        <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          ต้องเร่งด่วน
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Orders Grid for this table */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {orders.map((order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        config={statusConfig[order.status]}
                        editingOrder={editingOrder}
                        editingItems={editingItems}
                        updatingOrder={updatingOrder}
                        onStartEdit={startEditingOrder}
                        onCancelEdit={cancelEditing}
                        onSaveChanges={saveOrderChanges}
                        onCancelOrder={cancelOrder}
                        onUpdateStatus={updateOrderStatus}
                        onUpdateEditingItem={updateEditingItemQuantity}
                        onRemoveEditingItem={removeEditingItem}
                        getElapsedTime={getElapsedTime}
                        getUrgencyLevel={getUrgencyLevel}
                        formatTime={formatTime}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status View */}
        {viewMode === "status" && (
          <div className="space-y-6">
            {getOrdersByStatus().map(({ status, orders }) => {
              const config = statusConfig[status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={status}
                  className={`bg-gradient-to-r ${config.bgGradient} rounded-2xl shadow-sm border border-gray-200 overflow-hidden`}
                >
                  {/* Status Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center`}
                        >
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {config.label}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {orders.length} ออเดอร์
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orders Grid for this status */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {orders.map((order) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          config={config}
                          editingOrder={editingOrder}
                          editingItems={editingItems}
                          updatingOrder={updatingOrder}
                          onStartEdit={startEditingOrder}
                          onCancelEdit={cancelEditing}
                          onSaveChanges={saveOrderChanges}
                          onCancelOrder={cancelOrder}
                          onUpdateStatus={updateOrderStatus}
                          onUpdateEditingItem={updateEditingItemQuantity}
                          onRemoveEditingItem={removeEditingItem}
                          getElapsedTime={getElapsedTime}
                          getUrgencyLevel={getUrgencyLevel}
                          formatTime={formatTime}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Empty State */}
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Utensils className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              ไม่มีออเดอร์
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {selectedStatus === "ALL" && selectedTable === "ALL"
                ? "ยังไม่มีออเดอร์เข้ามาในระบบ รอลูกค้าสั่งอาหารเข้ามา"
                : `ไม่มีออเดอร์ที่ตรงกับตัวกรอง${
                    selectedStatus !== "ALL"
                      ? ` สถานะ: ${
                          statusConfig[selectedStatus as OrderStatus]?.label
                        }`
                      : ""
                  }${selectedTable !== "ALL" ? ` โต๊ะ: ${selectedTable}` : ""}`}
            </p>
            {/* {(selectedStatus !== "ALL" || selectedTable !== "ALL") && (
              <Button
                onClick={() => {
                  setSelectedStatus("ALL");
                  setSelectedTable("ALL");
                }}
                className="bg-[#F38DA9] hover:bg-[#e37795] flex items-center gap-2 justify-center"
              >
                <Eye className="w-4 h-4" />
                ดูออเดอร์ทั้งหมด
              </Button>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Order Card Component
interface OrderCardProps {
  order: Order;
  config: any;
  editingOrder: string | null;
  editingItems: any[];
  updatingOrder: string | null;
  onStartEdit: (orderId: string) => void;
  onCancelEdit: () => void;
  onSaveChanges: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateEditingItem: (index: number, quantity: number) => void;
  onRemoveEditingItem: (index: number) => void;
  getElapsedTime: (createdAt: string) => string;
  getUrgencyLevel: (createdAt: string, status: OrderStatus) => string;
  formatTime: (dateString: string) => string;
  formatDate: (dateString: string) => string;
}

function OrderCard({
  order,
  config,
  editingOrder,
  editingItems,
  updatingOrder,
  onStartEdit,
  onCancelEdit,
  onSaveChanges,
  onCancelOrder,
  onUpdateStatus,
  onUpdateEditingItem,
  onRemoveEditingItem,
  getElapsedTime,
  getUrgencyLevel,
  formatTime,
  formatDate,
}: OrderCardProps) {
  const StatusIcon = config.icon;
  const urgencyLevel = getUrgencyLevel(order.createdAt, order.status);
  const elapsedTime = getElapsedTime(order.createdAt);

  const urgencyColors = {
    high: "bg-amber-100",
    medium: "border-yellow-300 bg-yellow-50",
    low: "border-gray-200 bg-white",
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 ${
        statusConfig[order.status].bgGradient
      } relative overflow-hidden`}
    >
      {/* Urgency indicator */}
      {urgencyLevel === "high" && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-500">
          <Bell className="absolute -top-4 -right-1 w-3 h-3 text-white" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />#{order._id.slice(-6)}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              โต๊ะ {order.tableNo || "N/A"}
              <span className="text-gray-300">•</span>
              <Timer className="w-3 h-3" />
              {elapsedTime}
            </div>
          </div>
          <Badge
            className={`${config.color} flex items-center gap-1 px-3 py-1`}
          >
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(order.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(order.createdAt)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {(editingOrder === order._id ? editingItems : order.items).map(
            (item, index) => (
              <div
                key={index}
                className="flex justify-between items-start text-sm p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-gray-600 text-xs">จำนวน: {item.qty}</div>
                  {item.note && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded">
                      <StickyNote className="w-3 h-3" />
                      {item.note}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold text-[#F38DA9]">
                      ฿{item.lineTotal}
                    </div>
                  </div>

                  {/* Edit Item Controls */}
                  {config.canCancel && editingOrder === order._id && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        onClick={() => onUpdateEditingItem(index, item.qty + 1)}
                        disabled={updatingOrder === order._id}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      {item.qty > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200"
                          onClick={() =>
                            onUpdateEditingItem(index, item.qty - 1)
                          }
                          disabled={updatingOrder === order._id}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => onRemoveEditingItem(index)}
                        disabled={updatingOrder === order._id}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">รวมทั้งหมด</span>
            <span className="text-xl font-bold text-[#F38DA9]">
              ฿
              {editingOrder === order._id
                ? editingItems.reduce((sum, item) => sum + item.lineTotal, 0)
                : order.total}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Edit Mode Controls */}
          {config.canCancel && editingOrder === order._id && (
            <div className="flex gap-2">
              <Button
                onClick={() => onSaveChanges(order._id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                disabled={updatingOrder === order._id}
              >
                <Save className="w-4 h-4 mr-2" />
                บันทึก
              </Button>
              <Button
                onClick={onCancelEdit}
                variant="outline"
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
                size="sm"
                disabled={updatingOrder === order._id}
              >
                ยกเลิก
              </Button>
            </div>
          )}

          {/* Normal Controls */}
          {config.canCancel && editingOrder !== order._id && (
            <div className="flex gap-2">
              <Button
                onClick={() => onStartEdit(order._id)}
                variant="outline"
                className="flex-1 text-orange-600 border-orange-300 hover:bg-orange-50"
                size="sm"
                disabled={updatingOrder === order._id}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                แก้ไข
              </Button>
              <Button
                onClick={() => onCancelOrder(order._id)}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
                size="sm"
                disabled={updatingOrder === order._id}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Progress Button */}
          {config.nextStatus && editingOrder !== order._id && (
            <Button
              onClick={() => onUpdateStatus(order._id, config.nextStatus!)}
              disabled={updatingOrder === order._id}
              className={`w-full ${config.actionColor} text-white font-semibold`}
              size="sm"
            >
              {updatingOrder === order._id ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {config.nextLabel}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
