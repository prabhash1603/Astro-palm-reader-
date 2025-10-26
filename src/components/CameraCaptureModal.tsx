import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon } from './Icons';

interface CameraCaptureModalProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Camera API is not supported by your browser.");
                }
                 let stream;
                try {
                    // Prefer the back camera
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } });
                } catch (e) {
                    console.warn("Back camera not found or failed to start, trying any available camera.");
                    // Fallback to any available camera
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please check permissions and try again.");
            }
        };
        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
                        onCapture(file);
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl h-auto rounded-lg shadow-2xl" />
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            <div className="flex items-center space-x-4 mt-6">
                <button onClick={handleCapture} className="bg-purple-600 text-white font-bold p-4 rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-110 transition-all" aria-label="Capture image">
                    <CameraIcon className="w-8 h-8"/>
                </button>
                <button onClick={onClose} className="bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
};

export default CameraCaptureModal;
