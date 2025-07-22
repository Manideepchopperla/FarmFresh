import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../utils/cartSlice';
import { toast } from 'sonner';
import { CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('processing');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // This function is called once when the component loads.
        const createOrder = async (sessionId) => {
            try {
                // 1. Send the session ID to the backend to create the order.
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/orders/create-order-from-session`,
                    { sessionId },
                    { withCredentials: true }
                );

                // 2. If the order is created successfully (status 201)
                if (response.status === 201) {
                    setOrders(response.data);
                    setStatus('success');
                    dispatch(clearCart()); // Clear the user's cart in Redux
                    toast.success('Your order has been placed successfully!');
                } else {
                    // Handle cases where the server responds with an error status
                    throw new Error('Failed to create order.');
                }
            } catch (err) {
                // 3. If there's an error, update the UI to show it.
                const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
                console.error('Order creation failed:', err);
                setError(errorMessage);
                setStatus('error');
                toast.error(errorMessage);
            }
        };

        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        if (sessionId) {
            // If a session_id exists in the URL, proceed with creating the order.
            createOrder(sessionId);
        } else {
            // If there's no session_id, the user shouldn't be here. Redirect them.
            toast.error("Invalid session. Redirecting...");
            navigate('/');
        }
    }, [location, dispatch, navigate]); // Dependencies for the useEffect hook

    // This function renders different content based on the current status
    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="text-center">
                        <Loader className="h-12 w-12 text-green-900 animate-spin mx-auto" />
                        <h1 className="mt-4 text-2xl font-bold text-gray-800">Processing Your Order...</h1>
                        <p className="mt-2 text-gray-600">Please wait while we confirm your payment and create your order.</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                        <h1 className="mt-4 text-3xl font-bold text-gray-800">Thank You for Your Order!</h1>
                        <p className="mt-2 text-gray-600">Your payment was successful and your order has been placed.</p>
                        <div className="mt-6 bg-gray-100 p-4 rounded-lg text-left max-w-md mx-auto">
                            <h3 className="font-semibold text-lg mb-2">Order Summary:</h3>
                            {orders.map(order => (
                                <div key={order.orderId} className="mb-2">
                                    <p className="text-sm text-gray-800">Order ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{order.orderId}</span></p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                            <Link to="/track" className="bg-green-900 text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
                                Track Your Order(s)
                            </Link>
                            <Link to="/" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center">
                        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
                        <h1 className="mt-4 text-3xl font-bold text-gray-800">Order Placement Failed</h1>
                        <p className="mt-2 text-red-600">{error}</p>
                        <div className="mt-8">
                            <Link to="/order" className="bg-green-900 text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
                                Try Again
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SuccessPage;
