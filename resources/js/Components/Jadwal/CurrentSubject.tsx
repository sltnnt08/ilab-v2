import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CurrentSubjectProps {
    subject: string | null;
    startTime: string | null;
    endTime: string | null;
}

export default function CurrentSubject({ subject, startTime, endTime }: CurrentSubjectProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!startTime || !endTime) return;

        const calculateProgress = () => {
            const now = new Date();
            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);

            const start = new Date();
            start.setHours(startHour, startMin, 0);

            const end = new Date();
            end.setHours(endHour, endMin, 0);

            const total = end.getTime() - start.getTime();
            const elapsed = now.getTime() - start.getTime();

            const progressPercent = Math.min(Math.max((elapsed / total) * 100, 0), 100);
            setProgress(progressPercent);
        };

        calculateProgress();
        const timer = setInterval(calculateProgress, 1000);

        return () => clearInterval(timer);
    }, [startTime, endTime]);

    if (!subject) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mata Pelajaran Saat Ini
                </h3>
                <div className="text-center py-8 text-gray-500">
                    Tidak ada mata pelajaran saat ini
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-2">
                        Sedang Berlangsung
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {subject}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                            {startTime} - {endTime}
                        </span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progres</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
