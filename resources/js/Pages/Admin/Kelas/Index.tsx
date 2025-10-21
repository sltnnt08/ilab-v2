import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Trash2 } from 'lucide-react';

interface Kelas {
    id: number;
    class: string;
    jadwals_count: number;
}

interface Props {
    kelas: Kelas[];
    error?: string;
}

export default function Index({ kelas, error }: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kelas ${nama}?`)) {
            router.delete(route('admin.kelas.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Kelola Kelas
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Daftar semua kelas
                        </p>
                    </div>
                    <Link
                        href={route('admin.kelas.create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        + Tambah Kelas
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Nama Kelas
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Jumlah Jadwal
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {kelas.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        Belum ada data kelas
                                    </td>
                                </tr>
                            ) : (
                                kelas.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                            {item.class}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {item.jadwals_count} jadwal
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link
                                                    href={route('admin.kelas.edit', item.id)}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id, item.class)
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
