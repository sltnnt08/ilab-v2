import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeft } from "lucide-react";
import { FormEventHandler } from "react";

interface Ruangan {
    id: number;
    nama_ruangan: string;
    keterangan: string | null;
    default_pic_id: number | null;
}

interface User {
    id: number;
    name: string;
}

interface Props {
    ruangan: Ruangan;
    users: User[];
}

export default function Edit({ ruangan, users }: Props) {
    const { data, setData, processing, errors } = useForm({
        nama_ruangan: ruangan.nama_ruangan,
        keterangan: ruangan.keterangan || "",
        default_pic_id: ruangan.default_pic_id?.toString() || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.put(
            route("admin.ruangan.update", ruangan.id),
            {
                nama_ruangan: data.nama_ruangan,
                keterangan: data.keterangan || null,
                default_pic_id:
                    data.default_pic_id === ""
                        ? null
                        : parseInt(data.default_pic_id),
            },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="mb-6">
                    <Link
                        href={route("admin.ruangan.index")}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Ruangan Lab
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="nama_ruangan"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Nama Ruangan
                            </label>
                            <input
                                id="nama_ruangan"
                                type="text"
                                value={data.nama_ruangan}
                                onChange={(e) =>
                                    setData("nama_ruangan", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Contoh: Lab Komputer 1"
                                autoFocus
                            />
                            {errors.nama_ruangan && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.nama_ruangan}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="keterangan"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Keterangan{" "}
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    (opsional)
                                </span>
                            </label>
                            <textarea
                                id="keterangan"
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData("keterangan", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Deskripsi ruangan"
                                rows={3}
                            />
                            {errors.keterangan && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.keterangan}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="default_pic_id"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Penanggung Jawab Lab (PIC){" "}
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    (opsional)
                                </span>
                            </label>
                            <select
                                id="default_pic_id"
                                value={data.default_pic_id}
                                onChange={(e) =>
                                    setData("default_pic_id", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">
                                    -- Pilih Penanggung Jawab --
                                </option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.default_pic_id && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.default_pic_id}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                PIC akan muncul saat tidak ada guru yang sedang
                                mengajar di ruangan ini
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                            <Link
                                href={route("admin.ruangan.index")}
                                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
