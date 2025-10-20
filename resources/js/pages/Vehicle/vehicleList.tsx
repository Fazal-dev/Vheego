import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from '@/components/data-table';
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicles',
        href: index().url,
    },
];

type VehiclePayment = {
  id: string;
  amount: number;
  status: string;
  email: string;
}

const columns: ColumnDef<VehiclePayment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
     },
    {
        accessorKey: "Actions",
        id: "actions",
        cell: ({ row }) => {
        const payment = row.original

        return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID   
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function getData() {
  return [
    { id: "1a", amount: 100, status: "pending", email: "user1@example.com" },
    { id: "2b", amount: 150, status: "paid", email: "user2@example.com" },
    { id: "3c", amount: 200, status: "pending", email: "user3@example.com" },
    { id: "4d", amount: 120, status: "paid", email: "user4@example.com" },
    { id: "5e", amount: 300, status: "pending", email: "user5@example.com" },
    { id: "6f", amount: 180, status: "paid", email: "user6@example.com" },
    { id: "7g", amount: 220, status: "pending", email: "user7@example.com" },
    { id: "8h", amount: 130, status: "paid", email: "user8@example.com" },
    { id: "9i", amount: 250, status: "pending", email: "user9@example.com" },
    { id: "10j", amount: 175, status: "paid", email: "user10@example.com" },
    { id: "11k", amount: 90, status: "pending", email: "user11@example.com" },
    { id: "12l", amount: 200, status: "paid", email: "user12@example.com" },
    { id: "13m", amount: 140, status: "pending", email: "user13@example.com" },
    { id: "14n", amount: 160, status: "paid", email: "user14@example.com" },
    { id: "15o", amount: 210, status: "pending", email: "user15@example.com" },
    { id: "16p", amount: 190, status: "paid", email: "user16@example.com" },
    { id: "17q", amount: 230, status: "pending", email: "user17@example.com" },
    { id: "18r", amount: 175, status: "paid", email: "user18@example.com" },
    { id: "19s", amount: 120, status: "pending", email: "user19@example.com" },
    { id: "20t", amount: 200, status: "paid", email: "user20@example.com" },
  ];
}


export default function VehicleList() {
    const data: VehiclePayment[] = getData();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle List" />
            <div className="p-4 bg-white rounded-lg shadow-md">
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
