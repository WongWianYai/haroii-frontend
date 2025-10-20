"use client";

import OrderManagement from "@/components/orders/OrderManagement";

export default function OrderManagementPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <OrderManagement />
            </div>
        </div>
    );
}