import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Clock, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

interface BreakTime {
    id: number;
    nama: string;
    jam_mulai: string;
    jam_selesai: string;
    hari: string[] | null;
    is_active: boolean;
    urutan: number;
}

interface Props {
    breakTimes: BreakTime[];
}

export default function Index({ breakTimes }: Props) {
    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus waktu istirahat ini?")) {
            router.delete(route("admin.break-time.destroy", id));
        }
    };

    const formatHari = (hari: string[] | null) => {
        if (!hari || hari.length === 0) {
            return "Semua Hari";
        }
        if (hari.length === 7) {
            return "Semua Hari";
        }
        return hari.join(", ");
    };

    return (
        <AdminLayout>
            <Head title="Waktu Istirahat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                ⏰ Waktu Istirahat
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Kelola jadwal waktu istirahat untuk menampilkan
                                video
                            </p>
                        </div>
                        <Link
                            href={route("admin.break-time.create")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Waktu Istirahat
                        </Link>
                    </div>

                    {/* Info Alert */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">
                                    Cara kerja waktu istirahat:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>
                                        Video akan ditampilkan pada layar publik
                                        saat waktu istirahat aktif
                                    </li>
                                    <li>
                                        Anda bisa set berbeda per hari (contoh:
                                        Jumat istirahat lebih panjang)
                                    </li>
                                    <li>
                                        Kosongkan hari untuk berlaku semua hari
                                    </li>
                                    <li>
                                        Urutan menentukan prioritas pengecekan
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jam Mulai
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jam Selesai
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hari
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {breakTimes.length > 0 ? (
                                    breakTimes.map((breakTime, index) => (
                                        <tr
                                            key={breakTime.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {breakTime.nama}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {breakTime.jam_mulai}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {breakTime.jam_selesai}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs">
                                                    {formatHari(breakTime.hari)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        breakTime.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {breakTime.is_active ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Nonaktif
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {breakTime.urutan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.break-time.edit",
                                                            breakTime.id
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                breakTime.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-12 text-center"
                                        >
                                            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 mb-4">
                                                Belum ada waktu istirahat yang
                                                ditambahkan
                                            </p>
                                            <Link
                                                href={route(
                                                    "admin.break-time.create"
                                                )}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Tambah Waktu Istirahat Pertama
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
