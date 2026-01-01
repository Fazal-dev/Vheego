import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: Array<string>;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash:{suceess?:string};
    [key: string]: unknown;
}

export type owner = {
    owner : User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    phone_no: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Vehicle_table = {
  id: number;
  model: string;
  brand: string;
  color: string;
  transmission: string;
  fuel_type: string;
  license_plate: string;
  daily_rental_price: number;
  status?: string; 
}

interface Vehicle {
    id:number,
    model: string;
    brand: string;
    transmission: string;
    fuel_type: string;
    seats: number;
    doors: number;
    color: string;
    vehicle_type: string;
    year_of_manufacture: number;
    registration_date: number;
    registration_expiry_date: number;
    daily_rental_price: number;
    weekly_rental_price: number;
    monthly_rental_price: number;
    bond_amount: number;
    engine_capacity: string;
    engine_number: string;
    status: string;
    license_plate: string;
    pickup_location: string;
    description: string;
    highlights: string;
    image_urls: object;
     front_image?: File;
     back_image?: File;
     left_image?: File;
     right_image?: File;
     dashboard_image?: File;
     seat_image?: File;
     rc_back_image?: File;
     rc_front_image?: File;
        old_images?: Record<string, string>;
    _method?:string
};

interface VehicleFormProps {
    vehicle?: Vehicle;
}

export interface FlashMessages {
  success?: string;
  error?: string;
}

export interface PageProps extends InertiaPageProps {
  flash: FlashMessages;
}

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filter_columns: string;
}


export interface BackButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** If provided, the button will navigate to this href. Otherwise it calls history.back() */
    href?: string;
    /** Optional callback instead of default navigation */
    onNavigate?: (e?: React.MouseEvent) => void;
    /** Small text label to show next to the icon (default: "Back") */
    label?: string;
    /** Button variant from shadcn (keeps API compatible) */
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
    /** Extra classname to merge */
    className?: string;
}