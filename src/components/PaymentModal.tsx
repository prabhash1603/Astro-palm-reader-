import React, { useState } from 'react';

interface PaymentModalProps {
    onConfirm: () => void;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onConfirm, onClose }) => {
    const upiId = "6200016035@ybl";
    const paymentAmount = "5";
    const payeeName = "Astro Analysis";
    const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${paymentAmount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`;
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);


    const handlePay = () => {
        setPaymentInitiated(true);
        window.location.href = upiDeepLink;
        setTimeout(() => {
            setIsConfirmEnabled(true);
        }, 4000); // 4-second delay
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center text-white border border-purple-500/50">
                <h2 className="text-2xl font-bold text-purple-300 mb-2">Unlock Your Destiny</h2>
                <p className="text-gray-300 mb-6">Pay ₹{paymentAmount} to receive your personalized palm reading.</p>
                
                <div className="bg-white p-2 rounded-lg inline-block mb-6">
                    <img src={qrCodeUrl} alt="UPI QR Code" width="180" height="180" />
                </div>
                
                <p className="text-gray-400 mb-2">Scan QR or click below to pay</p>
                <p className="text-lg font-mono bg-gray-900/50 py-2 px-4 rounded-md inline-block mb-6">{upiId}</p>
                
                {paymentInitiated && (
                    <p className="text-sm text-yellow-300 bg-yellow-900/30 rounded-md p-2 my-4">
                        After completing payment in your UPI app, return here and press the confirmation button below.
                    </p>
                )}
                
                <div className="flex flex-col space-y-3">
                     {!paymentInitiated ? (
                         <button 
                            onClick={handlePay}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                         >
                            Pay ₹{paymentAmount} with UPI App
                         </button>
                     ) : (
                         <button 
                            onClick={onConfirm}
                            disabled={!isConfirmEnabled}
                            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-wait disabled:animate-none"
                         >
                            {isConfirmEnabled ? 'I Have Paid, Show My Reading' : 'Waiting for Payment...'}
                         </button>
                     )}
                     <button 
                        onClick={onClose}
                        className="w-full bg-transparent text-gray-400 py-2 px-6 rounded-lg hover:bg-gray-700/50 transition-colors"
                     >
                        Cancel
                     </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
