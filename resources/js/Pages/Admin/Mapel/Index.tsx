import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, BookOpen, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Mapel {
    id: number;
    nama_mapel: string;
    jadwals_count: number;
}

interface Props {
    mapels: Mapel[];
}

export default function Index({ mapels }: Props) {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Mapel;
        direction: 'asc' | 'desc';
    } | null>(null);

    const sortedMapels = [...mapels].sort((a, b) => {
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

    const handleSort = (key: keyof Mapel) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                if (current.direction === 'asc') {
                    return { key, direction: 'desc' };
                }
                return null;
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key: keyof Mapel) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ArrowUp className="h-4 w-4 text-blue-600" />
            : <ArrowDown className="h-4 w-4 text-blue-600" />;
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
            router.delete(route('admin.mapel.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout header="Kelola Mata Pelajaran">
            <Head title="Kelola Mata Pelajaran" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Daftar Mata Pelajaran</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola semua mata pelajaran di sini
                        </p>
                    </div>
                    <Link
                        href={route('admin.mapel.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Tambah Mata Pelajaran
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
                                    onClick={() => handleSort('nama_mapel')}
                                >
                                    <div className="flex items-center gap-2">
                                        Nama Mata Pelajaran
                                        {getSortIcon('nama_mapel')}
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
                            {sortedMapels.map((mapel, index) => (
                                <tr key={mapel.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {mapel.nama_mapel}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {mapel.jadwals_count} jadwal
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={route('admin.mapel.edit', mapel.id)}
                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(mapel.id)}
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

                    {mapels.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada mata pelajaran</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Mulai dengan menambahkan mata pelajaran baru.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.mapel.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Tambah Mata Pelajaran
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
