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

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
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
    image_urls: string[];
    status: string;
    license_plate: string;
    image_urls: Array [];
}

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