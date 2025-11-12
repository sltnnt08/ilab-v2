import { Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeft, Upload, Video as VideoIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";

interface Video {
    id: number;
    judul: string;
    deskripsi: string | null;
    durasi: number | null;
    urutan: number;
    is_active: boolean;
    file_url: string;
    thumbnail_url: string | null;
}

interface Props {
    video: Video;
}

export default function Edit({ video }: Props) {
    const { data, setData, processing, errors } = useForm({
        judul: video.judul,
        deskripsi: video.deskripsi || "",
        video: null as File | null,
        thumbnail: null as File | null,
        urutan: video.urutan,
        is_active: video.is_active,
    });

    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null
    );

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("video", file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        } else {
            setData("video", null);
            setVideoPreview(null);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("thumbnail", file);
            const url = URL.createObjectURL(file);
            setThumbnailPreview(url);
        } else {
            setData("thumbnail", null);
            setThumbnailPreview(null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(
            route("admin.video.update", video.id),
            {
                _method: "put",
                ...data,
            },
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    // Cleanup object URLs
                    if (videoPreview) URL.revokeObjectURL(videoPreview);
                    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                },
                onError: (errors) => {
                    console.error("Update errors:", errors);
                },
            }
        );
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="mb-6">
                    <Link
                        href={route("admin.video.index")}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Video Istirahat
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="judul"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Judul Video *
                            </label>
                            <input
                                id="judul"
                                type="text"
                                value={data.judul}
                                onChange={(e) =>
                                    setData("judul", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            />
                            {errors.judul && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.judul}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="deskripsi"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Deskripsi
                            </label>
                            <textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Video Saat Ini
                            </label>
                            <video
                                src={video.file_url}
                                controls
                                className="w-full max-w-md h-48 rounded-lg"
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Upload file baru untuk mengganti video
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                File Video Baru{" "}
                                <span className="text-gray-500 text-xs">
                                    (opsional - biarkan kosong jika tidak ingin
                                    mengganti)
                                </span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                <div className="space-y-1 text-center w-full">
                                    {videoPreview ? (
                                        <div className="mb-4">
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="mx-auto h-48 rounded"
                                            />
                                            <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                                ✓ Video baru: {data.video?.name}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData("video", null);
                                                    setVideoPreview(null);
                                                    // Reset input
                                                    const input =
                                                        document.getElementById(
                                                            "video"
                                                        ) as HTMLInputElement;
                                                    if (input) input.value = "";
                                                }}
                                                className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Batalkan perubahan video
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="video"
                                                    className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    <span className="px-3 py-2 inline-block">
                                                        Pilih video baru
                                                    </span>
                                                    <input
                                                        id="video"
                                                        type="file"
                                                        accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                                                        onChange={
                                                            handleVideoChange
                                                        }
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Upload untuk mengganti video
                                                saat ini
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.video && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.video}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Thumbnail Baru{" "}
                                <span className="text-gray-500 text-xs">
                                    (opsional)
                                </span>
                            </label>
                            {video.thumbnail_url && !thumbnailPreview && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Thumbnail saat ini:
                                    </p>
                                    <img
                                        src={video.thumbnail_url}
                                        alt="Current thumbnail"
                                        className="h-32 rounded border border-gray-300"
                                    />
                                </div>
                            )}
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                <div className="space-y-1 text-center w-full">
                                    {thumbnailPreview ? (
                                        <div className="mb-4">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="mx-auto h-32 rounded"
                                            />
                                            <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                                ✓ Thumbnail baru:{" "}
                                                {data.thumbnail?.name}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData("thumbnail", null);
                                                    setThumbnailPreview(null);
                                                    // Reset input
                                                    const input =
                                                        document.getElementById(
                                                            "thumbnail"
                                                        ) as HTMLInputElement;
                                                    if (input) input.value = "";
                                                }}
                                                className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Batalkan perubahan thumbnail
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="thumbnail"
                                                    className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    <span className="px-3 py-2 inline-block">
                                                        Pilih thumbnail baru
                                                    </span>
                                                    <input
                                                        id="thumbnail"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleThumbnailChange
                                                        }
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Upload untuk mengganti thumbnail
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.thumbnail && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.thumbnail}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="urutan"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Urutan Pemutaran *
                                </label>
                                <input
                                    id="urutan"
                                    type="number"
                                    min="1"
                                    value={data.urutan}
                                    onChange={(e) =>
                                        setData(
                                            "urutan",
                                            parseInt(e.target.value) || 1
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status Video
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
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {data.is_active ? "Aktif" : "Nonaktif"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Menyimpan..." : "Update Video"}
                            </button>
                            <Link
                                href={route("admin.video.index")}
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
