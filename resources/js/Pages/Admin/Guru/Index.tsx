import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, User, Mail, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Guru {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    jadwals_count: number;
}

interface Props {
    gurus: Guru[];
}

export default function Index({ gurus }: Props) {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Guru;
        direction: 'asc' | 'desc';
    } | null>(null);

    const sortedGurus = [...gurus].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key: keyof Guru) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                if (current.direction === 'asc') {
                    return { key, direction: 'desc' };
                }
                return null; // Reset to unsorted
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key: keyof Guru) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ArrowUp className="h-4 w-4 text-blue-600" />
            : <ArrowDown className="h-4 w-4 text-blue-600" />;
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus guru ini?')) {
            router.delete(route('admin.guru.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout header="Kelola Guru">
            <Head title="Kelola Guru" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Daftar Guru</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola semua data guru di sini
                        </p>
                    </div>
                    <Link
                        href={route('admin.guru.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Tambah Guru
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Nama Guru
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-2">
                                        Email
                                        {getSortIcon('email')}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('jadwals_count')}
                                >
                                    <div className="flex items-center gap-2">
                                        Jumlah Jadwal
                                        {getSortIcon('jadwals_count')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedGurus.map((guru, index) => (
                                <tr key={guru.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {guru.avatar ? (
                                                    <img
                                                        src={guru.avatar.startsWith('http') 
                                                            ? guru.avatar 
                                                            : `/storage/${guru.avatar}`
                                                        }
                                                        alt={guru.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-purple-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {guru.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {guru.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {guru.jadwals_count} jadwal
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={route('admin.guru.edit', guru.id)}
                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(guru.id)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {gurus.length === 0 && (
                        <div className="text-center py-12">
                            <User className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada guru</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Mulai dengan menambahkan guru baru.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.guru.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Tambah Guru
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
