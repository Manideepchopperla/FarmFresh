import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Truck, Plus, Minus, X } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, setDeliveryDetails } from '../utils/cartSlice';

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get('product');

  const user = useSelector(store => store.user.user);
  const { items: selectedProducts, deliveryDetails } = useSelector(store => store.cart);

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(deliveryDetails);

  const hasAddedProduct = useRef(false); // 🧠 prevents re-adding product

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`, { withCredentials: true });
        setProducts(response.data);

        if (productId && !hasAddedProduct.current) {
          const alreadyInCart = selectedProducts.some(item => item.product._id === productId);
          if (!alreadyInCart) {
            const product = response.data.find(p => p._id === productId);
            if (product) {
              handleAddProduct(product);
              hasAddedProduct.current = true;

              // optional: remove productId from URL
              navigate(location.pathname, { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [productId, selectedProducts, navigate, location.pathname]);

  const handleAddProduct = (product) => {
    dispatch(addToCart({ product, quantity: 5 }));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeFromCart(productId));
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
    return selectedProducts.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    if(formData.phone.length != 10 ) {
      toast.error("Please enter valid phone number")
      return;
    }

    const order = {
      customerName: formData.fullName,
      contactNumber: formData.phone,
      deliveryAddress: formData.address,
      items: selectedProducts.map(item => ({
        productId: item.product._id,
        adminId: item.product.user,
        quantity: item.quantity,
        price: item.product.price
      })),
      status: 'pending',
      totalAmount: calculateTotal(),
      orderId: "ORD" + Math.floor(10000000 + Math.random() * 90000000)
    };

    try {
      await axios.post(import.meta.env.VITE_BASE_URL + "/orders/", order, { withCredentials: true });
      toast.success(`Order placed successfully!`);
      // navigate(`/track?orderId=${order.orderId}`);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to place order. Please try again.");
    }
  };

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
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-green-900" />
                  Select Products
                </h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Your Order</h3>
                  {selectedProducts.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded">
                      No products selected yet. Add some products below!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedProducts.map(item => (
                        <div
                          key={item.product._id}
                          className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-lg gap-3 sm:gap-4 bg-white shadow-sm"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <div className="flex-grow w-full">
                            <div className="flex justify-between items-start sm:items-center w-full">
                              <h4 className="font-medium text-gray-800 text-base">{item.product.name}</h4>
                              <button
                                onClick={() => handleRemoveProduct(item.product._id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">₹{item.product.price.toFixed(2)}/kg</p>
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Minus className="h-4 w-4 text-black" />
                              </button>
                              <span className="mx-2 w-10 text-center text-black">{item.quantity} kg</span>
                              <button
                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="h-4 w-4 text-black" />
                              </button>
                            </div>

                            <div className="ml-auto sm:ml-6 text-right font-medium text-black text-sm sm:text-base">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
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

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Available Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map(product => (
                      <div key={product._id} className="border rounded-lg p-3 flex space-x-3 hover:border-primary hover:bg-gray-50 cursor-pointer" onClick={() => handleAddProduct(product)}>
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          <p className="text-sm text-gray-500">₹{product.price.toFixed(2)}/kg</p>
                          <div className="mt-1 flex items-center text-green-900 hover:text-green-900-dark text-sm">
                            <Plus className="h-4 w-4 mr-1" />
                            <span>Add to Order</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-green-900" />
                  Delivery Details
                </h2>
                <form onSubmit={handleSubmitOrder}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" id="fullName" placeholder='Full Name' name="fullName" required className="pl-4 block h-8 text-gray-800 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" value={formData.fullName} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" id="phone" name="phone" placeholder='phone No' required className="pl-4 h-8 block text-gray-800 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                      <textarea id="address" name="address" placeholder='Address' rows="4" required className="pl-4 block text-gray-800 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="w-full bg-green-900 hover:bg-primary-dark text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
                        Place Order
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
