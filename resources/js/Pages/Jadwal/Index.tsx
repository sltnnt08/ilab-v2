import { Head, Link, router } from '@inertiajs/react';
import { Calendar, RefreshCw } from 'lucide-react';
import CurrentTeacher from '@/Components/Jadwal/CurrentTeacher';
import CurrentSubject from '@/Components/Jadwal/CurrentSubject';
import NextSubject from '@/Components/Jadwal/NextSubject';
import TodaySchedule, { Schedule } from '@/Components/Jadwal/TodaySchedule';
import Toast from '@/Components/Jadwal/Toast';
import { useEffect, useState } from 'react';

interface Teacher {
    id: number;
    name: string;
    email: string;
    avatar?: string;
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
}

export default function Index({
    currentSchedule,
    nextSchedule,
    todaySchedules,
    currentDay,
}: JadwalPageProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Update waktu setiap detik
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-refresh data setiap 30 detik
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            setIsRefreshing(true);
            router.reload({
                only: ['currentSchedule', 'nextSchedule', 'todaySchedules'],
                onFinish: () => {
                    setIsRefreshing(false);
                    setShowToast(true);
                },
            });
        }, 30000); // 30 detik

        return () => clearInterval(refreshInterval);
    }, []);

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['currentSchedule', 'nextSchedule', 'todaySchedules'],
            onFinish: () => {
                setIsRefreshing(false);
                setShowToast(true);
            },
        });
    };

    return (
        <>
            <Head title="Jadwal" />

            <Toast
                show={showToast}
                message="Data jadwal berhasil diperbarui"
                onClose={() => setShowToast(false)}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header/Navbar */}
                <nav className="bg-white shadow-sm border-b border-gray-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                <h1 className="text-xl font-bold text-gray-900">
                                    Jadwal Pelajaran
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={isRefreshing}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                                    />
                                    <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
                                </button>
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    ← Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Current Time Display */}
                        <div className="mb-6">
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    {currentTime.toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                                <p className="text-5xl font-bold text-gray-900 mb-1 tabular-nums">
                                    {currentTime.toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </p>
                                <div className="flex items-center justify-center space-x-2 mt-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="text-xs text-gray-500">
                                        Data diperbarui otomatis setiap 30 detik
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid Layout untuk konten utama */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Guru Pengajar (Full width on mobile, half on desktop) */}
                            <div className="lg:col-span-2">
                                <CurrentTeacher
                                    teacher={currentSchedule.teacher}
                                    subject={currentSchedule.subject}
                                />
                            </div>

                            {/* Mata Pelajaran Saat Ini */}
                            <CurrentSubject
                                subject={currentSchedule.subject}
                                startTime={currentSchedule.startTime}
                                endTime={currentSchedule.endTime}
                            />

                            {/* Mata Pelajaran Selanjutnya */}
                            <NextSubject
                                subject={nextSchedule.subject}
                                startTime={nextSchedule.startTime}
                                teacherName={nextSchedule.teacherName}
                            />
                        </div>

                        {/* Jadwal Lengkap Hari Ini */}
                        <TodaySchedule
                            schedules={todaySchedules}
                            currentDay={currentDay}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}