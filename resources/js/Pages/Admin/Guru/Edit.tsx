import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react';

interface Guru {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Props {
    guru: Guru;
}

export default function Edit({ guru }: Props) {
    const { data, setData, put, post, processing, errors } = useForm<{
        name: string;
        email: string;
        avatar: File | string;
        avatar_url?: string;
        password: string;
        password_confirmation: string;
        _method: string;
    }>({
        name: guru.name,
        email: guru.email,
        avatar: guru.avatar || '',
        avatar_url: '',
        password: '',
        password_confirmation: '',
        _method: 'PUT',
    });

    // Determine initial avatar method and preview URL
    const getInitialPreviewUrl = () => {
        if (!guru.avatar) return '';
        if (guru.avatar.startsWith('http')) return guru.avatar;
        return `/storage/${guru.avatar}`;
    };

    // State for avatar method selection
    const [avatarMethod, setAvatarMethod] = useState<'upload' | 'url'>(
        guru.avatar && guru.avatar.startsWith('http') ? 'url' : 'upload'
    );
    const [previewUrl, setPreviewUrl] = useState<string>(getInitialPreviewUrl());

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setData('avatar_url', '');
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle URL input
    const handleUrlChange = (url: string) => {
        setData('avatar_url', url);
        setData('avatar', '');
        setPreviewUrl(url);
    };

    // Handle method switch
    const handleMethodSwitch = (method: 'upload' | 'url') => {
        setAvatarMethod(method);
        
        // If switching back to original method and there's an existing avatar, restore it
        if (method === 'upload' && guru.avatar && !guru.avatar.startsWith('http')) {
            setPreviewUrl(getInitialPreviewUrl());
            setData('avatar', guru.avatar);
            setData('avatar_url', '');
        } else if (method === 'url' && guru.avatar && guru.avatar.startsWith('http')) {
            setPreviewUrl(guru.avatar);
            setData('avatar_url', guru.avatar);
            setData('avatar', '');
        } else {
            // Clear preview if switching to different method without existing data
            if (method === 'upload' && !guru.avatar) {
                setPreviewUrl('');
                setData('avatar', '');
            } else if (method === 'url' && !data.avatar_url) {
                setPreviewUrl('');
                setData('avatar_url', '');
            }
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // If uploading file, use post with _method spoofing for multipart/form-data
        if (avatarMethod === 'upload' && data.avatar instanceof File) {
            post(route('admin.guru.update', guru.id), {
                forceFormData: true,
            });
        } else {
            put(route('admin.guru.update', guru.id));
        }
    };

    return (
        <AdminLayout header="Edit Guru">
            <Head title="Edit Guru" />

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
                            <InputLabel htmlFor="avatar" value="Foto Profil (Opsional)" />
                            
                            {/* Method Selection Buttons */}
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleMethodSwitch('upload')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        avatarMethod === 'upload'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMethodSwitch('url')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        avatarMethod === 'url'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <LinkIcon className="h-4 w-4" />
                                    Link URL
                                </button>
                            </div>

                            {/* Conditional Input Based on Method */}
                            <div className="mt-3">
                                {avatarMethod === 'upload' ? (
                                    <div>
                                        <input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 
                                                file:mr-4 file:py-2 file:px-4 
                                                file:rounded-md file:border-0 
                                                file:text-sm file:font-semibold 
                                                file:bg-indigo-50 file:text-indigo-700 
                                                hover:file:bg-indigo-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF hingga 2MB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <TextInput
                                            id="avatar_url"
                                            type="url"
                                            className="block w-full"
                                            value={data.avatar_url || ''}
                                            onChange={(e) => handleUrlChange(e.target.value)}
                                            placeholder="https://example.com/foto.jpg"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Masukkan URL foto profil</p>
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {previewUrl && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-700 mb-2">Preview:</p>
                                    <img
                                        src={previewUrl}
                                        alt="Avatar preview"
                                        className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                            )}
                            
                            <InputError message={errors.avatar} className="mt-2" />
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">
                                Ubah Password (Opsional)
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Kosongkan jika tidak ingin mengubah password
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="password" value="Password Baru" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Minimal 8 karakter</p>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                href={route('admin.guru.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Update Guru'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
