import { Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NextSubjectProps {
    subject: string | null;
    startTime: string | null;
    teacherName: string | null;
}

export default function NextSubject({ subject, startTime, teacherName }: NextSubjectProps) {
    const [timeUntil, setTimeUntil] = useState('');

    useEffect(() => {
        if (!startTime) return;

        const calculateTimeUntil = () => {
            const now = new Date();
            const [hour, min] = startTime.split(':').map(Number);
            const start = new Date();
            start.setHours(hour, min, 0);

            const diff = start.getTime() - now.getTime();

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (hours > 0) {
                    setTimeUntil(`${hours} jam ${minutes} menit lagi`);
                } else if (minutes > 0) {
                    setTimeUntil(`${minutes} menit ${seconds} detik lagi`);
                } else {
                    setTimeUntil(`${seconds} detik lagi`);
                }
            } else {
                setTimeUntil('Segera dimulai');
            }
        };

        calculateTimeUntil();
        const timer = setInterval(calculateTimeUntil, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    if (!subject) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mata Pelajaran Selanjutnya
                </h3>
                <div className="text-center py-8 text-gray-500">
                    Tidak ada jadwal selanjutnya
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center space-x-3 mb-3">
                <p className="text-sm text-gray-600 font-medium">
                    Selanjutnya
                </p>
                <ArrowRight className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {subject}
            </h3>
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Mulai pukul {startTime}</span>
                </div>
                {teacherName && (
                    <p className="text-sm text-gray-600">
                        Guru: <span className="font-medium">{teacherName}</span>
                    </p>
                )}
                {timeUntil && (
                    <div className="mt-3 inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium">{timeUntil}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
