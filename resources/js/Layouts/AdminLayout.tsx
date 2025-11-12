import { useState, PropsWithChildren, ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Calendar,
    BookOpen,
    Users,
    LayoutDashboard,
    Menu,
    X,
    LogOut,
    ChevronDown,
    School,
    DoorOpen,
    Video,
} from "lucide-react";

export default function AdminLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props as any;

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Jadwal", href: "/admin/jadwal", icon: Calendar },
        { name: "Mata Pelajaran", href: "/admin/mapel", icon: BookOpen },
        { name: "Guru", href: "/admin/guru", icon: Users },
        { name: "Kelas", href: "/admin/kelas", icon: School },
        { name: "Ruangan Lab", href: "/admin/ruangan", icon: DoorOpen },
        { name: "Video Istirahat", href: "/admin/video", icon: Video },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar Mobile */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${
                    sidebarOpen ? "block" : "hidden"
                }`}
            >
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75"
                    onClick={() => setSidebarOpen(false)}
                ></div>

                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <h2 className="text-xl font-bold text-gray-900">
                            Admin Panel
                        </h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const isActive = route().current(
                                item.href.replace("/admin/", "admin.") + "*"
                            );
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Sidebar Desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
                    <div className="flex items-center h-16 px-4 border-b">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <h2 className="ml-2 text-xl font-bold text-gray-900">
                            Admin Panel
                        </h2>
                    </div>

                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const isActive = route().current(
                                item.href.replace("/admin/", "admin.") + "*"
                            );
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex-shrink-0 border-t p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-700">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {auth.user.email}
                                </p>
                            </div>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="ml-3 text-gray-400 hover:text-gray-600"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Top Bar */}
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
                    <button
                        type="button"
                        className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1 items-center">
                            {header && (
                                <div className="text-xl font-semibold text-gray-900">
                                    {header}
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <Link
                                href="/jadwal"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                Lihat Jadwal Publik
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
