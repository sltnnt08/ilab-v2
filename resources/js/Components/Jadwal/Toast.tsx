import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

export default function Toast({ show, message, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            
            // Auto-dismiss after 5 seconds
            const dismissTimer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            // Call onClose after fade out animation
            const closeTimer = setTimeout(() => {
                onClose();
            }, 5300);

            return () => {
                clearTimeout(dismissTimer);
                clearTimeout(closeTimer);
            };
        } else {
            setIsVisible(false);
        }
    }, [show, onClose]);

    if (!show && !isVisible) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-3 min-w-[300px]">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-gray-900 flex-1">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
