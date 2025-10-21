import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, BookOpen, Users, School } from 'lucide-react';

interface Stats {
    totalJadwal: number;
    totalMapel: number;
    totalGuru: number;
    totalKelas: number;
}

interface Props {
    stats: Stats;
}

export default function Dashboard({ stats }: Props) {
    const statsData = [
        {
            name: 'Total Jadwal',
            value: stats.totalJadwal.toString(),
            icon: Calendar,
            color: 'bg-blue-500',
        },
        {
            name: 'Mata Pelajaran',
            value: stats.totalMapel.toString(),
            icon: BookOpen,
            color: 'bg-green-500',
        },
        {
            name: 'Total Guru',
            value: stats.totalGuru.toString(),
            icon: Users,
            color: 'bg-purple-500',
        },
        {
            name: 'Total Kelas',
            value: stats.totalKelas.toString(),
            icon: School,
            color: 'bg-orange-500',
        },
    ];

    return (
        <AdminLayout header="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat) => (
                        <div
                            key={stat.name}
                            className="bg-white overflow-hidden shadow-sm rounded-lg"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="text-3xl font-bold text-gray-900">
                                                {stat.value}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Link
                                href={route('admin.jadwal.create')}
                                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                <Calendar className="h-5 w-5 mr-2" />
                                Tambah Jadwal
                            </Link>
                            <Link
                                href={route('admin.mapel.index')}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <BookOpen className="h-5 w-5 mr-2" />
                                Kelola Mata Pelajaran
                            </Link>
                            <Link
                                href={route('admin.guru.index')}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <Users className="h-5 w-5 mr-2" />
                                Kelola Guru
                            </Link>
                            <Link
                                href={route('admin.kelas.index')}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <School className="h-5 w-5 mr-2" />
                                Kelola Kelas
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm rounded-lg">
                    <div className="p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">
                            Selamat Datang di Admin Panel! 👋
                        </h2>
                        <p className="text-blue-100">
                            Kelola jadwal pelajaran, mata pelajaran, dan guru dengan mudah.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
