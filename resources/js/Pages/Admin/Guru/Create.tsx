import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        avatar: File | string;
        avatar_url: string;
    }>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: '',
        avatar_url: '',
    });

    const [avatarMethod, setAvatarMethod] = useState<'upload' | 'url'>('url');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setData('avatar_url', '');
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (url: string) => {
        setData('avatar_url', url);
        setData('avatar', '');
        setPreviewUrl(url);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Use FormData for file upload
        if (avatarMethod === 'upload' && data.avatar) {
            post(route('admin.guru.store'), {
                forceFormData: true,
            });
        } else {
            post(route('admin.guru.store'));
        }
    };

    return (
        <AdminLayout header="Tambah Guru">
            <Head title="Tambah Guru" />

            <div className="max-w-2xl">
                <Link
                    href={route('admin.guru.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Guru
                </Link>

                <div className="bg-white shadow-sm rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap *" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email *" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="avatar_method" value="Metode Foto Profil" />
                            <div className="mt-2 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAvatarMethod('upload')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                        avatarMethod === 'upload'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAvatarMethod('url')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                        avatarMethod === 'url'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    Link URL
                                </button>
                            </div>
                        </div>

                        {avatarMethod === 'upload' ? (
                            <div>
                                <InputLabel htmlFor="avatar" value="Upload Foto" />
                                <input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG, GIF (Maks. 2MB)</p>
                                <InputError message={errors.avatar} className="mt-2" />
                            </div>
                        ) : (
                            <div>
                                <InputLabel htmlFor="avatar_url" value="URL Foto" />
                                <TextInput
                                    id="avatar_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    value={data.avatar_url}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                    placeholder="https://example.com/foto.jpg"
                                />
                                <p className="mt-1 text-xs text-gray-500">Masukkan URL foto profil guru</p>
                                <InputError message={errors.avatar_url} className="mt-2" />
                            </div>
                        )}

                        {previewUrl && (
                            <div>
                                <InputLabel value="Preview Foto" />
                                <div className="mt-2">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="password" value="Password *" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Minimal 8 karakter</p>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password *" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                href={route('admin.guru.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Guru'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
