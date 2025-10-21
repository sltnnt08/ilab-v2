import LiveIndicator from './LiveIndicator';

interface Teacher {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface CurrentTeacherProps {
    teacher: Teacher | null;
    subject: string | null;
}

export default function CurrentTeacher({ teacher, subject }: CurrentTeacherProps) {
    if (!teacher || !subject) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Guru Pengajar
                </h3>
                <div className="text-center py-8 text-gray-500">
                    Tidak ada jadwal saat ini
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold opacity-90">
                    Guru Pengajar Saat Ini
                </h3>
                <LiveIndicator />
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    {teacher.avatar ? (
                        <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-blue-400 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">
                                {teacher.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="text-2xl font-bold">{teacher.name}</h4>
                    <p className="text-blue-100 mt-1">{teacher.email}</p>
                    <div className="mt-3 inline-block bg-white/20 rounded-full px-4 py-1">
                        <span className="text-sm font-medium">{subject}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
