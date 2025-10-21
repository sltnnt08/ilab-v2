import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Clock, User, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface Jadwal {
    id: number;
    guru_name: string;
    mapel_name: string;
    kelas_name: string;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
}

interface Props {
    jadwals: Jadwal[];
}

export default function Index({ jadwals }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(route('admin.jadwal.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const groupedByDay = jadwals.reduce((acc, jadwal) => {
        if (!acc[jadwal.hari]) {
            acc[jadwal.hari] = [];
        }
        acc[jadwal.hari].push(jadwal);
        return acc;
    }, {} as Record<string, Jadwal[]>);

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <AdminLayout header="Kelola Jadwal">
            <Head title="Kelola Jadwal" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Daftar Jadwal</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola semua jadwal pelajaran di sini
                        </p>
                    </div>
                    <Link
                        href={route('admin.jadwal.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Tambah Jadwal
                    </Link>
                </div>

                {/* Jadwal by Day */}
                <div className="space-y-6">
                    {days.map((day) => {
                        const daySchedules = groupedByDay[day] || [];
                        
                        if (daySchedules.length === 0) return null;

                        return (
                            <div key={day} className="bg-white shadow-sm rounded-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2" />
                                        {day}
                                    </h3>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mata Pelajaran
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Guru
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kelas
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {daySchedules.map((jadwal) => (
                                                <tr key={jadwal.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm">
                                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="font-medium text-gray-900">
                                                                {jadwal.jam_mulai} - {jadwal.jam_selesai}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {jadwal.mapel_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <User className="h-4 w-4 text-green-500 mr-2" />
                                                            <span className="text-sm text-gray-700">
                                                                {jadwal.guru_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {jadwal.kelas_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={route('admin.jadwal.edit', jadwal.id)}
                                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(jadwal.id)}
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
                                </div>
                            </div>
                        );
                    })}
                </div>

                {jadwals.length === 0 && (
                    <div className="bg-white shadow-sm rounded-lg p-12 text-center">
                        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada jadwal</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Mulai dengan menambahkan jadwal baru.
                        </p>
                        <div className="mt-6">
                            <Link
                                href={route('admin.jadwal.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Tambah Jadwal
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
