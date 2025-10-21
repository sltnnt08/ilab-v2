import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';

interface Mapel {
    id: number;
    nama_mapel: string;
}

interface Props {
    mapel: Mapel;
}

export default function Edit({ mapel }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_mapel: mapel.nama_mapel,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.mapel.update', mapel.id));
    };

    return (
        <AdminLayout header="Edit Mata Pelajaran">
            <Head title="Edit Mata Pelajaran" />

            <div className="max-w-2xl">
                <Link
                    href={route('admin.mapel.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Mata Pelajaran
                </Link>

                <div className="bg-white shadow-sm rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_mapel" value="Nama Mata Pelajaran *" />
                            <TextInput
                                id="nama_mapel"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.nama_mapel}
                                onChange={(e) => setData('nama_mapel', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.nama_mapel} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                href={route('admin.mapel.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Update Mata Pelajaran'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
