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
    Plus
} from "lucide-react";
import { API_URL, API_BASE_PATH } from "@/config";

const statusConfig = {
    PENDING: {
        label: "รอดำเนินการ",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        nextStatus: "IN_PROGRESS" as OrderStatus,
        nextLabel: "เริ่มทำ",
        canCancel: true
    },
    IN_PROGRESS: {
        label: "กำลังทำ",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: ChefHat,
        nextStatus: "READY" as OrderStatus,
        nextLabel: "เสร็จแล้ว",
        canCancel: false
    },
    READY: {
        label: "พร้อมเสิร์ฟ",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        nextStatus: "SERVED" as OrderStatus,
        nextLabel: "เสิร์ฟแล้ว",
        canCancel: false
    },
    SERVED: {
        label: "เสิร์ฟแล้ว",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Utensils,
        nextStatus: null,
        nextLabel: null,
        canCancel: false
    },
    CANCELLED: {
        label: "ยกเลิกแล้ว",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: X,
        nextStatus: null,
        nextLabel: null,
        canCancel: false
    }
};

export default function OrderManagement() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
    const [selectedTable, setSelectedTable] = useState<string>("ALL");
    const [editingOrder, setEditingOrder] = useState<string | null>(null);
    const [editingItems, setEditingItems] = useState<any[]>([]);

    const getAuthHeaders = (): Record<string, string> => {
        // Get token from cookies
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        console.log('Auth token:', token ? 'Found' : 'Not found');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchTableNumber = async (tableSessionId: string): Promise<string> => {
        try {
            const response = await fetch(`${API_URL}${API_BASE_PATH}/table-sessions/${tableSessionId}`, {
                credentials: "include",
                headers: {
                    ...getAuthHeaders(),
                },
            });

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
            const sortedOrders = ordersWithTableNumbers.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            setAllOrders(sortedOrders);

            // Filter for display based on selected status
            if (selectedStatus === "ALL") {
                setDisplayOrders(sortedOrders);
            } else {
                setDisplayOrders(sortedOrders.filter((order: Order) => order.status === selectedStatus));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
        try {
            setUpdatingOrder(orderId);
            const response = await fetch(`${API_URL}${API_BASE_PATH}/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                credentials: "include",
                body: JSON.stringify({ nextStatus }),
            });

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
        const order = allOrders.find(o => o._id === orderId);
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
    const updateEditingItemQuantity = (itemIndex: number, newQuantity: number) => {
        const updatedItems = [...editingItems];
        if (newQuantity <= 0) {
            // ลบรายการถ้าจำนวนเป็น 0
            updatedItems.splice(itemIndex, 1);
        } else {
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                qty: newQuantity,
                lineTotal: updatedItems[itemIndex].price * newQuantity
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
            if (confirm("ไม่มีรายการในออเดอร์ คุณต้องการยกเลิกออเดอร์ทั้งหมดหรือไม่?")) {
                await cancelOrder(orderId);
            }
            return;
        }

        try {
            setUpdatingOrder(orderId);

            const itemsForApi = editingItems.map(item => ({
                menuItemId: String(item.menuItemId), // Ensure string
                qty: parseInt(String(item.qty)), // Ensure integer
                note: item.note || '', // Ensure string
                options: item.options || {} // Ensure object
            }));

            // Validate data before sending
            const invalidItems = itemsForApi.filter(item =>
                !item.menuItemId || isNaN(item.qty) || item.qty <= 0
            );

            if (invalidItems.length > 0) {
                throw new Error('Invalid item data detected');
            }

            const apiUrl = `${API_URL}${API_BASE_PATH}/orders/${orderId}/items`;
            console.log('Sending update request to:', apiUrl);
            console.log('Request data:', { items: itemsForApi });
            console.log('Headers:', getAuthHeaders());

            const response = await fetch(apiUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                credentials: "include",
                body: JSON.stringify({ items: itemsForApi }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: errorData
                });

                if (response.status === 401) {
                    throw new Error('ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่');
                } else if (response.status === 403) {
                    throw new Error('ไม่มีสิทธิ์ในการแก้ไขออเดอร์นี้');
                } else if (response.status === 404) {
                    throw new Error('ไม่พบออเดอร์ที่ต้องการแก้ไข');
                } else {
                    throw new Error(errorData.message || `เกิดข้อผิดพลาด (${response.status})`);
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

    // Update display orders when filters change
    useEffect(() => {
        let filtered = allOrders;

        // Filter by status
        if (selectedStatus !== "ALL") {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        // Filter by table
        if (selectedTable !== "ALL") {
            filtered = filtered.filter(order => order.tableNo === selectedTable);
        }

        // Ensure filtered orders are also sorted by time (oldest first)
        const sortedFiltered = filtered.sort((a, b) =>
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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin text-[#F38DA9]" />
                <span className="ml-2">กำลังโหลดออเดอร์...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">จัดการออเดอร์</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        ติดตามและจัดการออเดอร์จากลูกค้า
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => {
                            setSelectedStatus("ALL");
                            setSelectedTable("ALL");
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        ล้างตัวกรอง
                    </Button>
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

            {/* Filters */}
            <div className="space-y-4">
                {/* Status Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">กรองตามสถานะ</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedStatus === "ALL" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedStatus("ALL")}
                            className={selectedStatus === "ALL" ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}
                        >
                            ทั้งหมด ({allOrders.length})
                        </Button>
                        {Object.entries(statusConfig).map(([status, config]) => {
                            const count = allOrders.filter(order => order.status === status).length;
                            return (
                                <Button
                                    key={status}
                                    variant={selectedStatus === status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedStatus(status as OrderStatus)}
                                    className={selectedStatus === status ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}
                                >
                                    {config.label} ({count})
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Table Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">กรองตามโต๊ะ</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedTable === "ALL" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTable("ALL")}
                            className={selectedTable === "ALL" ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}
                        >
                            ทุกโต๊ะ ({allOrders.length})
                        </Button>
                        {Array.from(new Set(allOrders.map(order => order.tableNo).filter(Boolean)))
                            .sort()
                            .map((tableNo) => {
                                const count = allOrders.filter(order => order.tableNo === tableNo).length;
                                return (
                                    <Button
                                        key={tableNo}
                                        variant={selectedTable === tableNo ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedTable(tableNo!)}
                                        className={selectedTable === tableNo ? "bg-[#F38DA9] hover:bg-[#e37795]" : ""}
                                    >
                                        โต๊ะ {tableNo} ({count})
                                    </Button>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                    const config = statusConfig[order.status];
                    const StatusIcon = config.icon;

                    return (
                        <Card key={order._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <CardTitle className="text-sm font-medium">
                                            ออเดอร์ #{order._id.slice(-6)}
                                        </CardTitle>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <Hash className="w-3 h-3" />
                                            โต๊ะ {order.tableNo || "N/A"}
                                        </div>
                                    </div>
                                    <Badge className={`${config.color} flex items-center gap-1`}>
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
                                <div className="space-y-2">
                                    {(editingOrder === order._id ? editingItems : order.items).map((item, index) => (
                                        <div key={index} className="flex justify-between items-start text-sm">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-gray-500">จำนวน: {item.qty}</div>
                                                {item.note && (
                                                    <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                                                        <StickyNote className="w-3 h-3" />
                                                        {item.note}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-right">
                                                    <div className="font-medium">฿{item.lineTotal}</div>
                                                </div>

                                                {/* Edit Item Controls - Only for PENDING orders in editing mode */}
                                                {config.canCancel && editingOrder === order._id && (
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => updateEditingItemQuantity(index, item.qty + 1)}
                                                            disabled={updatingOrder === order._id}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                        {item.qty > 1 && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                                onClick={() => updateEditingItemQuantity(index, item.qty - 1)}
                                                                disabled={updatingOrder === order._id}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => removeEditingItem(index)}
                                                            disabled={updatingOrder === order._id}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="border-t pt-2">
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>รวมทั้งหมด</span>
                                        <span className="text-[#F38DA9]">
                                            ฿{editingOrder === order._id
                                                ? editingItems.reduce((sum, item) => sum + item.lineTotal, 0)
                                                : order.total
                                            }
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    {/* Edit Mode Controls - Only for PENDING orders */}
                                    {config.canCancel && editingOrder === order._id && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => saveOrderChanges(order._id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                size="sm"
                                                disabled={updatingOrder === order._id}
                                            >
                                                <Save className="w-4 h-4 mr-1" />
                                                บันทึก
                                            </Button>
                                            <Button
                                                onClick={cancelEditing}
                                                variant="outline"
                                                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                                                size="sm"
                                                disabled={updatingOrder === order._id}
                                            >
                                                ยกเลิก
                                            </Button>
                                        </div>
                                    )}

                                    {/* Normal Controls - Only for PENDING orders not in editing mode */}
                                    {config.canCancel && editingOrder !== order._id && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => startEditingOrder(order._id)}
                                                variant="outline"
                                                className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                                                size="sm"
                                                disabled={updatingOrder === order._id}
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                แก้ไขออเดอร์
                                            </Button>
                                            <Button
                                                onClick={() => cancelOrder(order._id)}
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                size="sm"
                                                disabled={updatingOrder === order._id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}

                                    {/* Progress Button - Only when not editing */}
                                    {config.nextStatus && editingOrder !== order._id && (
                                        <Button
                                            onClick={() => updateOrderStatus(order._id, config.nextStatus!)}
                                            disabled={updatingOrder === order._id}
                                            className="w-full bg-[#F38DA9] hover:bg-[#e37795]"
                                            size="sm"
                                        >
                                            {updatingOrder === order._id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                config.nextLabel
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีออเดอร์</h3>
                    <p className="text-gray-500">
                        {selectedStatus === "ALL" && selectedTable === "ALL"
                            ? "ยังไม่มีออเดอร์เข้ามาในระบบ"
                            : `ไม่มีออเดอร์ที่ตรงกับตัวกรอง${selectedStatus !== "ALL" ? ` สถานะ: ${statusConfig[selectedStatus as OrderStatus]?.label}` : ""
                            }${selectedTable !== "ALL" ? ` โต๊ะ: ${selectedTable}` : ""
                            }`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}