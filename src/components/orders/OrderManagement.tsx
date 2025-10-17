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
    Hash
} from "lucide-react";
import { API_URL, API_BASE_PATH } from "@/config";

const statusConfig = {
    PENDING: {
        label: "รอดำเนินการ",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        nextStatus: "IN_PROGRESS" as OrderStatus,
        nextLabel: "เริ่มทำ"
    },
    IN_PROGRESS: {
        label: "กำลังทำ",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: ChefHat,
        nextStatus: "READY" as OrderStatus,
        nextLabel: "เสร็จแล้ว"
    },
    READY: {
        label: "พร้อมเสิร์ฟ",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        nextStatus: "SERVED" as OrderStatus,
        nextLabel: "เสิร์ฟแล้ว"
    },
    SERVED: {
        label: "เสิร์ฟแล้ว",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Utensils,
        nextStatus: null,
        nextLabel: null
    }
};

export default function OrderManagement() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");

    const getAuthHeaders = () => {
        // Get token from cookies
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

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

            setAllOrders(ordersWithTableNumbers);

            // Filter for display based on selected status
            if (selectedStatus === "ALL") {
                setDisplayOrders(ordersWithTableNumbers);
            } else {
                setDisplayOrders(ordersWithTableNumbers.filter((order: Order) => order.status === selectedStatus));
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

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update display orders when status filter changes
    useEffect(() => {
        if (selectedStatus === "ALL") {
            setDisplayOrders(allOrders);
        } else {
            setDisplayOrders(allOrders.filter(order => order.status === selectedStatus));
        }
    }, [selectedStatus, allOrders]);

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

            {/* Status Filter */}
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
                                    {order.items.map((item, index) => (
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
                                            <div className="text-right">
                                                <div className="font-medium">฿{item.lineTotal}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="border-t pt-2">
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>รวมทั้งหมด</span>
                                        <span className="text-[#F38DA9]">฿{order.total}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                {config.nextStatus && (
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
                        {selectedStatus === "ALL"
                            ? "ยังไม่มีออเดอร์เข้ามาในระบบ"
                            : `ไม่มีออเดอร์ที่มีสถานะ "${statusConfig[selectedStatus as OrderStatus]?.label}"`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}