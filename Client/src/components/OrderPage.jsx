import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Truck, Plus, Minus, X } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, setDeliveryDetails } from '../utils/cartSlice';
import { loadStripe } from '@stripe/stripe-js';

const OrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector(store => store.user);
    const { items: selectedProducts, deliveryDetails } = useSelector(store => store.cart);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: deliveryDetails?.fullName || user?.user?.name || '',
        phone: deliveryDetails?.phone || '',
        address: deliveryDetails?.address || '',
    });
    
    // Fetch all available products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`, { withCredentials: true });
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again.');
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = (product) => {
        if (!product?._id || !product.name || typeof product.price !== 'number' || !product.user) {
            toast.error('Cannot add product with invalid data.');
            return;
        }
        if (selectedProducts.some(item => item.product?._id === product._id)) {
            toast.info(`${product.name} is already in your cart.`);
            return;
        }
        dispatch(addToCart({ product, quantity: 5 }));
        toast.success(`${product.name} added to cart`);
    };

    const handleRemoveProduct = (productId) => {
        dispatch(removeFromCart(productId));
        toast.success('Product removed from cart');
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        dispatch(setDeliveryDetails({ [name]: value }));
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);
    };

    const validateForm = () => {
        if (!formData.fullName?.trim()) {
            toast.error("Please enter your full name");
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone?.trim())) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }
        if (!formData.address?.trim()) {
            toast.error("Please enter your delivery address");
            return false;
        }
        return true;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (selectedProducts.length === 0) {
            toast.error("Please select at least one product.");
            return;
        }
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

            // The body now includes deliveryDetails, which will be stored in Stripe's metadata
            const checkoutData = {
                products: selectedProducts,
                deliveryDetails: formData,
            };

            // 1. Create a checkout session on the backend
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/checkout`, checkoutData, {
                withCredentials: true
            });

            const session = response.data;

            // 2. Redirect to Stripe's hosted checkout page
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                console.error('Stripe checkout error:', result.error.message);
                toast.error(result.error.message);
                setLoading(false);
            }
            // Order creation is now handled by the backend and the /success page
            // No more code will execute here after the redirect.

        } catch (err) {
            console.error('Order submission error:', err);
            const errorMessage = err.response?.data?.message || "Failed to initiate payment. Please try again.";
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow bg-gray-50 py-10 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800">
                            Retry
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow bg-gray-50 py-10">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Place Bulk Order</h1>
                        <p className="text-gray-600 mt-2">Order fresh produce directly from local farms</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Product Selection UI */}
                            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <ShoppingBag className="h-5 w-5 mr-2 text-green-900" />
                                    Select Products
                                </h2>
                                {/* Your Order Section */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 mb-3">Your Order</h3>
                                    {selectedProducts.length === 0 ? (
                                        <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded">
                                            No products selected yet. Add some products below!
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedProducts.map(item => item.product && (
                                                <div key={item.product._id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-lg gap-3 sm:gap-4 bg-white shadow-sm">
                                                    <img src={item.product.image || '/placeholder-image.jpg'} alt={item.product.name} className="w-20 h-20 rounded object-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} />
                                                    <div className="flex-grow w-full">
                                                        <div className="flex justify-between items-start sm:items-center w-full">
                                                            <h4 className="font-medium text-gray-800 text-base">{item.product.name}</h4>
                                                            <button onClick={() => handleRemoveProduct(item.product._id)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="h-5 w-5" /></button>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mt-1">₹{(item.product.price || 0).toFixed(2)}/kg</p>
                                                    </div>
                                                    <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                                                        <div className="flex items-center">
                                                            <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors" disabled={item.quantity <= 1}><Minus className="h-4 w-4 text-black" /></button>
                                                            <span className="mx-2 w-10 text-center text-black">{item.quantity} kg</span>
                                                            <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"><Plus className="h-4 w-4 text-black" /></button>
                                                        </div>
                                                        <div className="ml-auto sm:ml-6 text-right font-medium text-black text-sm sm:text-base">
                                                            ₹{((item.product.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Total:</span>
                                                <span className="font-bold text-lg text-green-900">₹{calculateTotal().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Available Products Section */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-3">Available Products</h3>
                                    {loading ? (
                                        <div className="text-center py-4"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div><p className="mt-2 text-gray-600">Loading products...</p></div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {products.slice(0, 10).filter(p => !selectedProducts.some(item => item.product?._id === p._id)).map(product => (
                                                <div key={product._id} className="border rounded-lg p-3 flex space-x-3 hover:border-green-900 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleAddProduct(product)}>
                                                    <img src={product.image || '/placeholder-image.jpg'} alt={product.name} className="w-16 h-16 rounded object-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                                                        <p className="text-sm text-gray-500 capitalize">{product.category || 'General'}</p>
                                                        <p className="text-sm font-medium text-green-900">₹{product.price.toFixed(2)}/kg</p>
                                                        <div className="mt-1 flex items-center text-green-900 hover:text-green-800 text-sm"><Plus className="h-4 w-4 mr-1" /><span>Add to Order</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Details Form */}
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <Truck className="h-5 w-5 mr-2 text-green-900" />
                                    Delivery Details
                                </h2>
                                <form onSubmit={handleSubmitOrder}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                            <input type="text" id="fullName" placeholder="Enter your full name" name="fullName" required className="pl-4 block h-10 text-gray-800 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 sm:text-sm" value={formData.fullName} onChange={handleInputChange} />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                            <input type="tel" id="phone" name="phone" placeholder="Enter 10-digit phone number" required maxLength="10" pattern="[0-9]{10}" className="pl-4 h-10 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 sm:text-sm" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                                            <textarea id="address" name="address" placeholder="Enter complete delivery address" rows="4" required className="pl-4 pt-2 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-900 focus:border-green-900 sm:text-sm" value={formData.address} onChange={handleInputChange} />
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" disabled={loading || selectedProducts.length === 0} className="w-full bg-green-900 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 transition-colors duration-200">
                                                {loading ? 'Processing...' : `Place Order (₹${calculateTotal().toFixed(2)})`}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderPage;
