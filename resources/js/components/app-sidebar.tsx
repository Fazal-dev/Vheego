import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import customer from '@/routes/customer';
import { ownerDashboard } from '@/routes/owner';
import vehicles from '@/routes/owner/vehicles';
import { Auth, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Car, LayoutGrid, Search } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role;

    const allNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: customer.customerDashboard().url,
            icon: LayoutGrid,
            roles: ['customer'],
        },
        {
            title: 'Owner Dashboard',
            href: ownerDashboard(),
            icon: LayoutGrid,
            roles: ['owner'],
        },
        {
            title: 'Vehicles',
            href: vehicles.index().url,
            icon: Car,
            roles: ['owner'],
        },
        {
            title: 'Find a Vehicle',
            href: vehicles.index().url,
            icon: Search,
            roles: ['customer'],
        },
    ];

    const mainNavItems: NavItem[] = allNavItems.filter((item) =>
        item.roles.includes(role),
    );

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={
                                    role == 'owner'
                                        ? ownerDashboard()
                                        : customer.customerDashboard()
                                }
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
