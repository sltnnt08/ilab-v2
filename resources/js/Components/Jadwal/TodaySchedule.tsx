import { Clock, User } from 'lucide-react';

export interface Schedule {
    id: number;
    mapel: {
        nama_mapel: string;
    };
    guru: {
        name: string;
        avatar?: string;
    };
    kelas: {
        name: string;
    };
    jam_mulai: string;
    jam_selesai: string;
    is_current?: boolean;
}

interface TodayScheduleProps {
    schedules: Schedule[];
    currentDay: string;
}

export default function TodaySchedule({ schedules, currentDay }: TodayScheduleProps) {
    if (schedules.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Jadwal Hari Ini ({currentDay})
                </h3>
                <div className="text-center py-8 text-gray-500">
                    Tidak ada jadwal untuk hari ini
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Jadwal Lengkap Hari Ini ({currentDay})
            </h3>
            <div className="space-y-3">
                {schedules.map((schedule) => (
                    <div
                        key={schedule.id}
                        className={`p-4 rounded-lg border transition-all ${
                            schedule.is_current
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    {schedule.is_current && (
                                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                                            Sedang Berlangsung
                                        </span>
                                    )}
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {schedule.mapel.nama_mapel}
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {schedule.jam_mulai} - {schedule.jam_selesai}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{schedule.guru.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                            {schedule.kelas.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {schedule.guru.avatar ? (
                                <img
                                    src={schedule.guru.avatar}
                                    alt={schedule.guru.name}
                                    className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                    <span className="text-lg font-semibold text-gray-600">
                                        {schedule.guru.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
