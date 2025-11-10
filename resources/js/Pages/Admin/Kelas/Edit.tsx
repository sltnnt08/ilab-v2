import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeft } from "lucide-react";
import { FormEventHandler } from "react";

interface Kelas {
    id: number;
    class: string;
}

interface Props {
    kelas: Kelas;
}

export default function Edit({ kelas }: Props) {
    const { data, setData, processing, errors } = useForm({
        class: kelas.class,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.put(
            route("admin.kelas.update", kelas.id),
            {
                class: data.class,
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
                        href={route("admin.kelas.index")}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Kelas
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="class"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Nama Kelas
                            </label>
                            <input
                                id="class"
                                type="text"
                                value={data.class}
                                onChange={(e) =>
                                    setData("class", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Contoh: X RPL 1"
                                autoFocus
                            />
                            {errors.class && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.class}
                                </p>
                            )}
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
                                href={route("admin.kelas.index")}
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
