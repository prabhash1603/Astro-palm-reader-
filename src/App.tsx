import React, { useState } from 'react';
import CameraCaptureModal from './components/CameraCaptureModal';
import PaymentModal from './components/PaymentModal';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import { HandIcon, CameraIcon, StarIcon } from './components/Icons'; 

// DUMMY DATA FOR ANALYSIS
const DUMMY_ANALYSIS_CONTENT = `
### Your Life Line (जीवन रेखा)

The life line appears strong and deeply etched, indicating a robust physical constitution and a zest for life. It suggests you have strong reserves of energy and are likely to live a long, healthy life. A noticeable upward sweep in the middle suggests a period of significant positive change around your late 30s.

### Your Head Line (मस्तिष्क रेखा)

Your head line is long and clear, slightly sloping downwards. This reveals a highly intellectual and imaginative nature. You are a deep thinker, preferring to analyze situations thoroughly before making decisions. The slight curve suggests you are creative and can thrive in roles requiring original thought.

### Your Heart Line (हृदय रेखा)

The heart line is prominent, starting beneath the index finger and sweeping gracefully towards the edge. This placement indicates that you are a highly idealistic and stable person in relationships. You lead with compassion and value deep, emotional connections over superficial ones. You are not easily swayed but give your all once committed.

Disclaimer: This analysis is based on ancient palmistry principles and is for entertainment and curiosity purposes only. It should not be used as a substitute for professional advice.
`;

type AppState = 'initial' | 'camera_open' | 'captured' | 'payment_required' | 'processing' | 'analysis_ready';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('initial');
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const handleInitialCaptureClick = () => {
        setAppState('camera_open');
    };

    const handleImageCapture = (file: File) => {
        setCapturedFile(file);
        setAppState('captured');
    };

    const handleAnalyzeRequest = () => {
        setAppState('payment_required');
    };

    const handlePaymentConfirm = () => {
        setAppState('processing');
        
        setTimeout(() => {
            setAnalysisResult(DUMMY_ANALYSIS_CONTENT);
            setAppState('analysis_ready');
        }, 5000); 
    };

    const handleReset = () => {
        setAppState('initial');
        setCapturedFile(null);
        setAnalysisResult(null);
    };

    if (appState === 'camera_open') {
        return <CameraCaptureModal 
                    onCapture={handleImageCapture} 
                    onClose={() => setAppState('initial')} 
                />
    }

    if (appState === 'payment_required') {
        return <PaymentModal 
                    onConfirm={handlePaymentConfirm} 
                    onClose={() => setAppState('captured')}
                />
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
            <header className="text-center mb-10 mt-4">
                <h1 className="text-5xl font-extrabold text-purple-400 flex items-center justify-center space-x-3">
                    <HandIcon className="w-10 h-10 text-yellow-500" />
                    <span>Astro Palm Reader</span>
                    <StarIcon className="w-6 h-6 text-yellow-500" />
                </h1>
                <p className="text-gray-400 mt-2 text-xl">Your destiny is in your hands. Let the AI reveal it.</p>
            </header>

            <main className="w-full max-w-4xl">
                {appState === 'processing' && (
                    <div className="flex justify-center py-20">
                        <Loader />
                    </div>
                )}
                
                {appState === 'analysis_ready' && analysisResult && (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-purple-500/50">
                        <h2 className="text-3xl font-bold text-center text-purple-300 mb-6 border-b border-purple-600 pb-3">Your Personalized Palm Analysis</h2>
                        <AnalysisDisplay content={analysisResult} />
                        <div className="text-center mt-8">
                            <button 
                                onClick={handleReset}
                                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Start New Analysis
                            </button>
                        </div>
                    </div>
                )}

                {(appState === 'initial' || appState === 'captured') && (
                    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-purple-500/50 text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Step 1: Capture Your Palm</h2>
                        
                        {capturedFile ? (
                            <div className="mb-6">
                                <p className="text-green-400 font-medium mb-3 flex items-center justify-center">
                                    <CameraIcon className="w-5 h-5 mr-2" />
                                    Image Captured Successfully!
                                </p>
                                <img 
                                    src={URL.createObjectURL(capturedFile)} 
                                    alt="Captured Palm" 
                                    className="max-h-60 max-w-full mx-auto rounded-lg object-contain border-2 border-green-500"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <HandIcon className="w-20 h-20 text-purple-500 mb-4 animate-pulse" />
                                <p className="text-gray-400 mb-6">Click the button below to open your camera and capture a clear image of your palm.</p>
                            </div>
                        )}
                        
                        <div className="flex justify-center space-x-4">
                            <button 
                                onClick={handleInitialCaptureClick}
                                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center"
                            >
                                <CameraIcon className="w-6 h-6 mr-2" />
                                {capturedFile ? 'Recapture Image' : 'Open Camera'}
                            </button>
                            {capturedFile && (
                                <button 
                                    onClick={handleAnalyzeRequest}
                                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                                >
                                    Analyze My Palm
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
