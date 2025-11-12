import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Clock } from "lucide-react";

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
    breakTime: BreakTime;
}

const hariOptions = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
];

export default function Edit({ breakTime }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: breakTime.nama,
        jam_mulai: breakTime.jam_mulai,
        jam_selesai: breakTime.jam_selesai,
        hari: breakTime.hari || ([] as string[]),
        is_active: breakTime.is_active,
        urutan: breakTime.urutan,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.break-time.update", breakTime.id));
    };

    const handleHariToggle = (hari: string) => {
        if (data.hari.includes(hari)) {
            setData(
                "hari",
                data.hari.filter((h) => h !== hari)
            );
        } else {
            setData("hari", [...data.hari, hari]);
        }
    };

    const handleSelectAll = () => {
        setData("hari", hariOptions);
    };

    const handleClearAll = () => {
        setData("hari", []);
    };

    return (
        <AdminLayout>
            <Head title="Edit Waktu Istirahat" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("admin.break-time.index")}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-800">
                            ⏰ Edit Waktu Istirahat
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Edit jadwal waktu istirahat
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Waktu Istirahat
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    placeholder="Contoh: Istirahat Pagi, Istirahat Siang"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.nama && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Jam Mulai & Selesai */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jam Mulai
                                    </label>
                                    <input
                                        type="time"
                                        value={data.jam_mulai}
                                        onChange={(e) =>
                                            setData("jam_mulai", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {errors.jam_mulai && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.jam_mulai}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jam Selesai
                                    </label>
                                    <input
                                        type="time"
                                        value={data.jam_selesai}
                                        onChange={(e) =>
                                            setData(
                                                "jam_selesai",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {errors.jam_selesai && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.jam_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Hari */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hari (Kosongkan untuk semua hari)
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Pilih Semua
                                        </button>
                                        <span className="text-xs text-gray-400">
                                            |
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleClearAll}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Hapus Semua
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {hariOptions.map((hari) => (
                                        <button
                                            key={hari}
                                            type="button"
                                            onClick={() =>
                                                handleHariToggle(hari)
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                data.hari.includes(hari)
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {hari}
                                        </button>
                                    ))}
                                </div>
                                {errors.hari && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.hari}
                                    </p>
                                )}
                            </div>

                            {/* Urutan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Urutan (Prioritas)
                                </label>
                                <input
                                    type="number"
                                    value={data.urutan}
                                    onChange={(e) =>
                                        setData(
                                            "urutan",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Semakin kecil angka, semakin tinggi
                                    prioritas
                                </p>
                                {errors.urutan && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.urutan}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700">
                                        Status Waktu Istirahat
                                    </span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    "is_active",
                                                    e.target.checked
                                                )
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>
                                <p className="mt-1 text-xs text-gray-500">
                                    {data.is_active ? "Aktif" : "Nonaktif"}
                                </p>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Link
                                    href={route("admin.break-time.index")}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Clock className="w-4 h-4" />
                                    {processing ? "Menyimpan..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
