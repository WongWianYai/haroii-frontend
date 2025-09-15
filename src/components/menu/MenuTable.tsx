import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MenuItem } from "@/types";

interface MenuTableProps {
    menuItems: MenuItem[];
    searchCategory: string;
    onEdit: (menu: MenuItem) => void;
    onDelete: (id: string) => void;
}

export default function MenuTable({
    menuItems,
    searchCategory,
    onEdit,
    onDelete
}: MenuTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/5 text-xs font-semibold">ชื่ออาหาร</TableHead>
                    <TableHead className="w-1/8 text-xs font-semibold">ราคา (บาท)</TableHead>
                    <TableHead className="w-2/5 text-xs font-semibold">คำอธิบาย</TableHead>
                    <TableHead className="w-1/6 text-xs font-semibold">หมวดหมู่</TableHead>
                    <TableHead className="w-1/8 text-xs font-semibold">สต๊อก</TableHead>
                    <TableHead className="w-1/6 text-xs font-semibold text-center">การจัดการ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell className="font-medium text-sm py-2">{item.name}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600 text-sm py-2">
                                ฿{item.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm leading-tight py-2">
                                {item.description}
                            </TableCell>
                            <TableCell className="py-2">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                                    {item.category}
                                </span>
                            </TableCell>
                            <TableCell className="py-2">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${item.isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}>
                                    {item.isAvailable ? "มีอยู่" : "หมดสต๊อก"}
                                </span>
                            </TableCell>
                            <TableCell className="py-2">
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(item)}
                                        className="hover:bg-[#F38DA9]/10 hover:border-[#F38DA9]/30 text-xs px-2 py-1 h-auto"
                                    >
                                        แก้ไข
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onDelete(item._id)}
                                        className="hover:bg-red-600 text-xs px-2 py-1 h-auto"
                                    >
                                        ลบ
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 text-sm py-8">
                            {searchCategory
                                ? `ไม่พบเมนูในหมวดหมู่ "${searchCategory}"`
                                : "ไม่มีรายการเมนู"
                            }
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}