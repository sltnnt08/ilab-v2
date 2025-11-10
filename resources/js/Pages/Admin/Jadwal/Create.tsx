import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { ArrowLeft } from "lucide-react";

interface Guru {
    id: number;
    name: string;
}

interface Mapel {
    id: number;
    nama_mapel: string;
}

interface Kelas {
    id: number;
    class: string;
}

interface Ruangan {
    id: number;
    nama_ruangan: string;
}

interface Props {
    gurus: Guru[];
    mapels: Mapel[];
    kelas: Kelas[];
    ruangans: Ruangan[];
}

export default function Create({ gurus, mapels, kelas, ruangans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        mapel_id: "",
        class_id: "",
        ruangan_id: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.jadwal.store"));
    };

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    return (
        <AdminLayout header="Tambah Jadwal">
            <Head title="Tambah Jadwal" />

            <div className="max-w-3xl">
                <Link
                    href={route("admin.jadwal.index")}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Jadwal
                </Link>

                <div className="bg-white shadow-sm rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="user_id"
                                value="Guru Pengajar *"
                            />
                            <select
                                id="user_id"
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                value={data.user_id}
                                onChange={(e) =>
                                    setData("user_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih Guru</option>
                                {gurus.map((guru) => (
                                    <option key={guru.id} value={guru.id}>
                                        {guru.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.user_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="mapel_id"
                                value="Mata Pelajaran *"
                            />
                            <select
                                id="mapel_id"
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                value={data.mapel_id}
                                onChange={(e) =>
                                    setData("mapel_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih Mata Pelajaran</option>
                                {mapels.map((mapel) => (
                                    <option key={mapel.id} value={mapel.id}>
                                        {mapel.nama_mapel}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.mapel_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="class_id" value="Kelas *" />
                            <select
                                id="class_id"
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                value={data.class_id}
                                onChange={(e) =>
                                    setData("class_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih Kelas</option>
                                {kelas.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.class}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.class_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="ruangan_id"
                                value="Ruangan Lab *"
                            />
                            <select
                                id="ruangan_id"
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                value={data.ruangan_id}
                                onChange={(e) =>
                                    setData("ruangan_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih Ruangan</option>
                                {ruangans.map((ruangan) => (
                                    <option key={ruangan.id} value={ruangan.id}>
                                        {ruangan.nama_ruangan}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.ruangan_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="hari" value="Hari *" />
                            <select
                                id="hari"
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                value={data.hari}
                                onChange={(e) =>
                                    setData("hari", e.target.value)
                                }
                                required
                            >
                                <option value="">Pilih Hari</option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.hari}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="jam_mulai"
                                    value="Jam Mulai *"
                                />
                                <TextInput
                                    id="jam_mulai"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={data.jam_mulai}
                                    onChange={(e) =>
                                        setData("jam_mulai", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.jam_mulai}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="jam_selesai"
                                    value="Jam Selesai *"
                                />
                                <TextInput
                                    id="jam_selesai"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={data.jam_selesai}
                                    onChange={(e) =>
                                        setData("jam_selesai", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.jam_selesai}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                href={route("admin.jadwal.index")}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan Jadwal"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
