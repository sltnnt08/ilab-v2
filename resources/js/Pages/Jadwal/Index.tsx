import { Head, Link, router } from "@inertiajs/react";
import {
    Calendar,
    RefreshCw,
    Clock,
    User as UserIcon,
    BookOpen,
    Video as VideoIcon,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Teacher {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Ruangan {
    id: number;
    nama_ruangan: string;
    keterangan?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Schedule {
    id: number | string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    is_current: boolean;
    kelas: string;
    is_break?: boolean;
}

interface Video {
    id: number;
    judul: string;
    deskripsi: string | null;
    file_url: string;
    thumbnail_url: string | null;
}

interface JadwalPageProps {
    currentSchedule: {
        teacher: Teacher | null;
        subject: string | null;
        startTime: string | null;
        endTime: string | null;
    };
    nextSchedule: {
        subject: string | null;
        startTime: string | null;
        teacherName: string | null;
    };
    todaySchedules: Schedule[];
    currentDay: string;
    ruangans: Ruangan[];
    selectedRuanganId: number | null;
    selectedRuangan: Ruangan | null;
    isBreakTime: boolean;
    videos: Video[];
    auth: {
        user: User | null;
    };
}

export default function Index({
    currentSchedule,
    nextSchedule,
    todaySchedules,
    currentDay,
    ruangans,
    selectedRuanganId,
    selectedRuangan,
    isBreakTime,
    videos,
    auth,
}: JadwalPageProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [justRefreshed, setJustRefreshed] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedRuang, setSelectedRuang] = useState<number | null>(
        selectedRuanganId
    );
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    // Reset video index when break time ends
    useEffect(() => {
        if (!isBreakTime) {
            setCurrentVideoIndex(0);
        }
    }, [isBreakTime]);

    // Update waktu setiap detik
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Handle notification fade out animation
    useEffect(() => {
        if (justRefreshed) {
            setIsClosing(false);
            // Start fade out animation after 1.7 seconds
            const fadeOutTimer = setTimeout(() => {
                setIsClosing(true);
            }, 1700);

            // Remove notification completely after animation finishes
            const removeTimer = setTimeout(() => {
                setJustRefreshed(false);
                setIsClosing(false);
            }, 2000);

            return () => {
                clearTimeout(fadeOutTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [justRefreshed]);

    // Auto-refresh data setiap 30 detik - include isBreakTime and videos
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            setIsRefreshing(true);
            router.reload({
                only: [
                    "currentSchedule",
                    "nextSchedule",
                    "todaySchedules",
                    "isBreakTime",
                    "videos",
                ],
                onFinish: () => {
                    setIsRefreshing(false);
                    setJustRefreshed(true);
                },
            });
        }, 30000);

        return () => clearInterval(refreshInterval);
    }, []);

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: [
                "currentSchedule",
                "nextSchedule",
                "todaySchedules",
                "isBreakTime",
                "videos",
            ],
            onFinish: () => {
                setIsRefreshing(false);
                setJustRefreshed(true);
            },
        });
    };

    const handleRuanganChange = (ruanganId: string) => {
        const newRuanganId = parseInt(ruanganId);
        setSelectedRuang(newRuanganId);

        router.get(
            route("jadwal"),
            { ruangan_id: newRuanganId },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const calculateProgress = () => {
        if (!currentSchedule.startTime || !currentSchedule.endTime) return 0;

        const now = new Date();
        const [startHour, startMinute] = currentSchedule.startTime
            .split(":")
            .map(Number);
        const [endHour, endMinute] = currentSchedule.endTime
            .split(":")
            .map(Number);

        const start = new Date(now);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(now);
        end.setHours(endHour, endMinute, 0);

        const total = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();

        return Math.min(100, Math.max(0, (elapsed / total) * 100));
    };

    const progress = calculateProgress();

    return (
        <>
            <Head title="Jadwal" />

            {/* Modern Bento-Style Layout for Smart TV */}
            <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden p-6 flex flex-col gap-4">
                {/* Top Bar - Minimalist */}
                <div className="flex items-center justify-between flex-shrink-0">
                    {/* Logo & Room Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedRuangan?.nama_ruangan || "Jadwal Lab"}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {currentDay} • Pembaruan Otomatis
                            </p>
                        </div>
                    </div>

                    {/* Room Selector & Refresh */}
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedRuang || ""}
                            onChange={(e) =>
                                handleRuanganChange(e.target.value)
                            }
                            className="pl-4 pr-10 py-3 text-sm font-semibold bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%232563eb' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1.5em 1.5em",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            {ruangans.map((ruangan) => (
                                <option key={ruangan.id} value={ruangan.id}>
                                    {ruangan.nama_ruangan}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-all group"
                        >
                            <RefreshCw
                                className={`w-5 h-5 text-blue-600 dark:text-blue-400 ${
                                    isRefreshing
                                        ? "animate-spin"
                                        : "group-hover:rotate-180"
                                } transition-transform duration-500`}
                            />
                        </button>
                    </div>
                </div>

                {/* Main Bento Grid Layout */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Top Row - 3 Info Cards with Fixed Height */}
                    <div className="grid grid-cols-12 gap-4 h-[200px]">
                        {/* Clock Card */}
                        <div className="col-span-4 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Waktu Saat Ini
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent tabular-nums mb-2">
                                        {currentTime.toLocaleTimeString(
                                            "id-ID",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-lg font-semibold">
                                            {currentTime.toLocaleDateString(
                                                "id-ID",
                                                {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    {/* Invisible spacer to match other cards' height */}
                                    <div className="mt-4">
                                        <div className="h-2 opacity-0"></div>
                                        <p className="text-xs opacity-0 mt-2">
                                            Spacer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Schedule Card */}
                        <div className="col-span-4 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Sedang Berlangsung
                                    </span>
                                </div>

                                {currentSchedule.subject ? (
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {currentSchedule.subject}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-lg font-semibold">
                                                {currentSchedule.startTime} -{" "}
                                                {currentSchedule.endTime}
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">
                                            Tidak ada kelas
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-lg font-semibold">
                                                --:-- - --:--
                                            </span>
                                        </div>
                                        {/* Empty Progress Bar */}
                                        <div className="mt-4">
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-300 dark:bg-gray-600 w-0"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Schedule Card */}
                        <div className="col-span-4 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Jadwal Berikutnya
                                    </span>
                                </div>

                                {nextSchedule.subject ? (
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {nextSchedule.subject}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-lg font-semibold">
                                                {nextSchedule.startTime}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">
                                            Belum ada jadwal
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600 mb-4">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-lg font-semibold">
                                                --:--
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 dark:text-gray-600 font-semibold invisible">
                                            Placeholder text
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - Teacher/PIC & Schedule/Video */}
                    <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                        {/* Teacher/PIC Card - FULL PHOTO Display */}
                        <div className="col-span-4 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden relative">
                            {currentSchedule.teacher ? (
                                <>
                                    {/* Badge - Floating on top */}
                                    <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-xl rounded-2xl shadow-xl">
                                        <Sparkles className="w-4 h-4 text-white" />
                                        <span className="text-sm font-bold text-white">
                                            Penanggung Jawab
                                        </span>
                                    </div>

                                    {/* Full Photo - Fill entire card */}
                                    {currentSchedule.teacher.avatar ? (
                                        <img
                                            src={
                                                currentSchedule.teacher.avatar.startsWith(
                                                    "http"
                                                )
                                                    ? currentSchedule.teacher
                                                          .avatar
                                                    : `/storage/${currentSchedule.teacher.avatar}`
                                            }
                                            alt={currentSchedule.teacher.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center">
                                            <UserIcon className="w-32 h-32 text-white" />
                                        </div>
                                    )}

                                    {/* Name overlay - Bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
                                        <h3 className="text-3xl font-bold text-white mb-1">
                                            {currentSchedule.teacher.name}
                                        </h3>
                                        {currentSchedule.subject && (
                                            <p className="text-lg text-blue-300 font-semibold">
                                                {currentSchedule.subject}
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-6">
                                        <UserIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                                    </div>
                                    <p className="text-xl text-gray-500 dark:text-gray-400">
                                        Tidak ada jadwal
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Bottom - Schedule List or Video */}
                        <div className="col-span-8 min-h-0">
                            {isBreakTime && videos.length > 0 ? (
                                /* Video Player - Bento Style */
                                <div className="h-full bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl relative">
                                    {/* Video Header */}
                                    <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                                    <VideoIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg">
                                                        Video Waktu Istirahat
                                                    </h3>
                                                    <p className="text-gray-300 text-sm">
                                                        {videos[
                                                            currentVideoIndex
                                                        ]?.judul ||
                                                            "Sedang Diputar"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl">
                                                <span className="text-white font-semibold">
                                                    {currentVideoIndex + 1} /{" "}
                                                    {videos.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video */}
                                    <video
                                        key={videos[currentVideoIndex]?.id}
                                        src={
                                            videos[currentVideoIndex]?.file_url
                                        }
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-contain"
                                        onEnded={() => {
                                            const nextIndex =
                                                (currentVideoIndex + 1) %
                                                videos.length;
                                            setCurrentVideoIndex(nextIndex);
                                        }}
                                    />

                                    {/* Bottom Gradient */}
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"></div>
                                </div>
                            ) : (
                                /* Schedule List - Bento Style */
                                <div className="h-full bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg flex flex-col relative">
                                    {/* Header */}
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    Jadwal Hari Ini
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {currentDay} •{" "}
                                                    {todaySchedules.length}{" "}
                                                    Kelas
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule Items - Scrollable */}
                                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative min-h-0">
                                        {todaySchedules.length > 0 ? (
                                            <div className="space-y-3">
                                                {todaySchedules.map(
                                                    (schedule) => (
                                                        <div
                                                            key={schedule.id}
                                                            className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                                                                schedule.is_break
                                                                    ? schedule.is_current
                                                                        ? "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-300 dark:border-orange-600 shadow-lg scale-[1.02]"
                                                                        : "bg-orange-50/50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md"
                                                                    : schedule.is_current
                                                                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-300 dark:border-blue-600 shadow-lg scale-[1.02]"
                                                                    : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md"
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                {/* Time Badge */}
                                                                <div
                                                                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center min-w-[80px] ${
                                                                        schedule.is_break
                                                                            ? schedule.is_current
                                                                                ? "bg-gradient-to-br from-orange-600 to-amber-600 text-white"
                                                                                : "bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300"
                                                                            : schedule.is_current
                                                                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                                    }`}
                                                                >
                                                                    <div className="text-lg font-bold leading-tight">
                                                                        {
                                                                            schedule.startTime
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs opacity-90">
                                                                        {
                                                                            schedule.endTime
                                                                        }
                                                                    </div>
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                                        <h4
                                                                            className={`text-xl font-bold ${
                                                                                schedule.is_break
                                                                                    ? "text-orange-900 dark:text-orange-100"
                                                                                    : "text-gray-900 dark:text-white"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                schedule.subject
                                                                            }
                                                                        </h4>
                                                                        {!schedule.is_break && (
                                                                            <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                                                                                {
                                                                                    schedule.kelas
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p
                                                                        className={`${
                                                                            schedule.is_break
                                                                                ? "text-orange-600 dark:text-orange-400 italic"
                                                                                : "text-gray-600 dark:text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            schedule.teacher
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center">
                                                <Calendar className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
                                                <p className="text-xl text-gray-500 dark:text-gray-400">
                                                    Tidak ada jadwal hari ini
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Blur Indicator */}
                                    {todaySchedules.length > 3 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent pointer-events-none rounded-b-3xl"></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Success Notification - Floating with fade in/out animation */}
                {justRefreshed && (
                    <div
                        className={`fixed top-24 right-6 z-50 transition-all duration-300 ${
                            isClosing
                                ? "animate-out slide-out-to-top-4 fade-out"
                                : "animate-in slide-in-from-top-4 fade-in"
                        }`}
                    >
                        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-2xl">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="font-semibold">
                                Berhasil diperbarui
                            </span>
                        </div>
                    </div>
                )}

                {/* Admin Link - Floating Button */}
                {auth.user && (
                    <Link
                        href={route("admin.dashboard")}
                        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 flex items-center justify-center shadow-2xl shadow-blue-500/50 transition-all hover:scale-110 group"
                        title="Admin Dashboard"
                    >
                        <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                    </Link>
                )}
            </div>
        </>
    );
}
