import { Head, Link, router } from '@inertiajs/react';
import { Calendar, RefreshCw, LayoutDashboard, Clock, User as UserIcon, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Teacher {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Class {
    id: number;
    class: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Schedule {
    id: number;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    is_current: boolean;
    kelas: string;
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
    classes: Class[];
    selectedClassId: number | null;
    auth: {
        user: User | null;
    };
}

export default function Index({
    currentSchedule,
    nextSchedule,
    todaySchedules,
    currentDay,
    classes,
    selectedClassId,
    auth,
}: JadwalPageProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [justRefreshed, setJustRefreshed] = useState(false);
    const [selectedClass, setSelectedClass] = useState<number | null>(selectedClassId);

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
                    setJustRefreshed(true);
                    // Hide indicator after 2 seconds
                    setTimeout(() => setJustRefreshed(false), 2000);
                },
            });
        }, 30000);

        return () => clearInterval(refreshInterval);
    }, []);

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['currentSchedule', 'nextSchedule', 'todaySchedules'],
            onFinish: () => {
                setIsRefreshing(false);
                setJustRefreshed(true);
                // Hide indicator after 2 seconds
                setTimeout(() => setJustRefreshed(false), 2000);
            },
        });
    };

    const handleClassChange = (classId: string) => {
        const newClassId = parseInt(classId);
        setSelectedClass(newClassId);
        
        router.get(
            route('jadwal'),
            { class_id: newClassId },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const calculateProgress = () => {
        if (!currentSchedule.startTime || !currentSchedule.endTime) return 0;
        
        const now = new Date();
        const [startHour, startMinute] = currentSchedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = currentSchedule.endTime.split(':').map(Number);
        
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

            {/* Full viewport container */}
            <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
                {/* Compact Header */}
                <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 flex-shrink-0">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex h-14 justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-blue-300" />
                                <h1 className="text-lg font-bold text-white">
                                    Jadwal Pelajaran
                                </h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <select
                                    value={selectedClass || ''}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    className="px-3 py-1.5 text-sm font-medium bg-white/20 text-white border border-white/30 rounded-lg backdrop-blur-sm hover:bg-white/30 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                >
                                    {classes.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id} className="text-gray-900">
                                            {kelas.class}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleManualRefresh}
                                    disabled={isRefreshing}
                                    className="p-1.5 text-white bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 disabled:opacity-50 backdrop-blur-sm"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </button>

                                {auth.user && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="p-1.5 text-white bg-blue-500/30 border border-blue-400/30 rounded-lg hover:bg-blue-500/40 backdrop-blur-sm"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content - Single viewport, no scroll */}
                <div className="flex-1 overflow-hidden px-6 py-4">
                    <div className="h-full mx-auto max-w-7xl flex flex-col gap-4">
                        {/* Top Row: Clock & Current/Next */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
                            {/* Live Clock */}
                            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center relative">
                                {/* Refresh Success Indicator */}
                                {justRefreshed && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full animate-in fade-in slide-in-from-top-2 duration-300">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span className="font-medium">Updated</span>
                                    </div>
                                )}
                                
                                <div className="text-white/80 text-xs mb-1">
                                    {currentTime.toLocaleDateString('id-ID', { 
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="text-white text-4xl font-bold tabular-nums mb-1">
                                    {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-green-300">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    Auto-refresh 30s
                                </div>
                            </div>

                            {/* Current Subject */}
                            <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/20 backdrop-blur-lg rounded-2xl p-4 border border-blue-400/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="font-medium">SEDANG BERLANGSUNG</span>
                                    </div>
                                    {currentSchedule.subject ? (
                                        <>
                                            <h3 className="text-white text-xl font-bold mb-1">{currentSchedule.subject}</h3>
                                            <div className="text-blue-200 text-sm flex items-center gap-2 mb-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                {currentSchedule.startTime} - {currentSchedule.endTime}
                                            </div>
                                            {/* Progress bar */}
                                            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-white/60 text-sm">Tidak ada jadwal saat ini</p>
                                    )}
                                </div>
                            </div>

                            {/* Next Subject */}
                            <div className="bg-gradient-to-br from-purple-500/30 to-pink-600/20 backdrop-blur-lg rounded-2xl p-4 border border-purple-400/30">
                                <div className="flex items-center gap-2 text-purple-200 text-sm mb-2">
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="font-medium">SELANJUTNYA</span>
                                </div>
                                {nextSchedule.subject ? (
                                    <>
                                        <h3 className="text-white text-xl font-bold mb-1">{nextSchedule.subject}</h3>
                                        <div className="text-purple-200 text-sm flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {nextSchedule.startTime}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-white/60 text-sm">Tidak ada jadwal selanjutnya</p>
                                )}
                            </div>
                        </div>

                        {/* Bottom Section: Teacher Image + Schedule List */}
                        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 flex-1 overflow-hidden">
                            {/* Teacher Image - No Box, Same Height as Schedule */}
                            <div className="relative flex flex-col items-center justify-start h-full">
                                {/* Title Above Image */}
                                <div className="mb-3 px-4 py-2 bg-emerald-500/30 backdrop-blur-sm rounded-xl border border-emerald-400/30">
                                    <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap">
                                        Penanggung Jawab Ruangan
                                    </div>
                                </div>

                                {/* Teacher Image Container */}
                                <div className="relative flex-1 w-full flex items-end justify-center overflow-hidden">
                                    {currentSchedule.teacher ? (
                                        <>
                                            {currentSchedule.teacher.avatar ? (
                                                <div className="relative h-full flex items-end justify-center">
                                                    {/* Full Body Image - Auto scale to fill height */}
                                                    <img
                                                        src={currentSchedule.teacher.avatar.startsWith('http') 
                                                            ? currentSchedule.teacher.avatar 
                                                            : `/storage/${currentSchedule.teacher.avatar}`
                                                        }
                                                        alt={currentSchedule.teacher.name}
                                                        className="h-full w-auto min-h-full object-cover object-bottom drop-shadow-2xl"
                                                        style={{ 
                                                            minWidth: '200px',
                                                            maxWidth: '300px'
                                                        }}
                                                    />
                                                    
                                                    {/* Overlaying Name Badge */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 via-slate-900/85 to-transparent backdrop-blur-md rounded-t-2xl pt-20 pb-4 px-4">
                                                        <h2 className="text-white text-xl font-bold text-center drop-shadow-lg leading-tight">
                                                            {currentSchedule.teacher.name}
                                                        </h2>
                                                        <p className="text-emerald-300 text-xs text-center mt-1.5 truncate">
                                                            {currentSchedule.teacher.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3 border-2 border-emerald-400/30">
                                                        <UserIcon className="w-12 h-12 text-emerald-300/60" />
                                                    </div>
                                                    <h2 className="text-white text-lg font-bold text-center px-4">
                                                        {currentSchedule.teacher.name}
                                                    </h2>
                                                    <p className="text-emerald-200 text-xs text-center mt-1 px-4">
                                                        {currentSchedule.teacher.email}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-3 border-2 border-white/20">
                                                <UserIcon className="w-12 h-12 text-white/40" />
                                            </div>
                                            <p className="text-white/50 text-center text-sm px-4">Tidak ada guru saat ini</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Today's Schedule List */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-white/20 flex-shrink-0">
                                    <h3 className="text-white font-bold text-lg">Jadwal Hari Ini - {currentDay}</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {todaySchedules.length > 0 ? (
                                        todaySchedules.map((schedule) => (
                                            <div
                                                key={schedule.id}
                                                className={`p-3 rounded-xl border transition-all ${
                                                    schedule.is_current
                                                        ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40 border-blue-400/50 shadow-lg shadow-blue-500/20'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-white font-bold text-sm">
                                                                {schedule.startTime}
                                                            </div>
                                                            <div className="text-white/60 text-xs">
                                                                {schedule.endTime}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-white font-semibold text-sm truncate">
                                                                {schedule.subject}
                                                            </div>
                                                            <div className="text-white/70 text-xs truncate">
                                                                {schedule.teacher}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {schedule.is_current && (
                                                        <div className="flex-shrink-0 ml-2">
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/30 border border-green-400/50 text-green-200 text-xs font-medium">
                                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                                                LIVE
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-white/60">
                                            Tidak ada jadwal untuk hari ini
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}