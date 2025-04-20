import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, ShoppingBag, Plus, Edit, Trash2, Search, X, Clock, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const navigate = useNavigate();

  const user = useSelector(store => store.user.user);

  if (!user) {
    navigate("/login");
  }

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formatted =
    String(date.getDate()).padStart(2, '0') + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    date.getFullYear();

  const todayDate = new Date();
  const formattedToday =
    String(todayDate.getDate()).padStart(2, '0') + '-' +
    String(todayDate.getMonth() + 1).padStart(2, '0') + '-' +
    todayDate.getFullYear();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/orders', { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/products/my-products', { withCredentials: true });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(import.meta.env.VITE_BASE_URL + `/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      setOrders(prevOrders => prevOrders.map(order => order.orderId === orderId ? { ...order, status: newStatus } : order));
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setOrderModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'vegetable'
    });
    setIsNewProduct(true);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsNewProduct(false);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(import.meta.env.VITE_BASE_URL + `/products/${productId}`, { withCredentials: true });
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (isNewProduct) {
        const response = await axios.post(import.meta.env.VITE_BASE_URL + '/products', selectedProduct, { withCredentials: true });
        setProducts(prevProducts => [...prevProducts, response.data]);
        toast.success("Product added successfully");
      } else {
        await axios.put(import.meta.env.VITE_BASE_URL + `/products/${selectedProduct._id}`, selectedProduct, { withCredentials: true });
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === selectedProduct._id ? selectedProduct : product
          )
        );
        toast.success("Product updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setProductModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value, type } = e.target;
    setSelectedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : name === 'price' ? parseFloat(value) : value
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="mb-6 border-b border-gray-200">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`mr-2 inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-green-900 text-green-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <Package className="h-5 w-5 mr-2" />
                Orders
              </button>
              <button
                className={`mr-2 inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'products'
                    ? 'border-green-900 text-green-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('products')}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Products
              </button>
            </div>
          </div>

          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block h-8 text-black w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Search orders..."
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(orders) && orders.filter(order =>
                        order.orderId.toLowerCase().includes(orderSearchTerm.toLowerCase())
                      ).length > 0 ? (
                        orders
                          .filter(order =>
                            order.orderId.toLowerCase().includes(orderSearchTerm.toLowerCase())
                          )
                          .map((order) => (
                            <tr key={order.orderId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customerName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-green-100 text-green-800'}`}>
                                  {order.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                  {order.status === 'in_progress' && <Truck className="h-3 w-3 mr-1" />}
                                  {order.status === 'delivered' && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className="text-green-900 hover:text-green-900-dark"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setOrderModalOpen(true);
                                  }}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-gray-500">
                            No orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab Content */}
          {activeTab === 'products' && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block h-8 text-black w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Search products..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-900 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={handleAddProduct}
                    >
                                            <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(products) && products.filter(product =>
                        product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                      ).length > 0 ? (
                        products
                          .filter(product =>
                            product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                          )
                          .map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteProduct(product._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-6 text-gray-500">
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Order Details Modal */}
          {orderModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Order #{selectedOrder.orderId}</h2>
                    <button
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => {
                        setOrderModalOpen(false);
                        setSelectedOrder(null);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Order details content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-700">{selectedOrder.customerName}</p>
                        <p className="text-gray-600">{selectedOrder.contactNumber}</p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="font-medium text-gray-700">Delivery Address</p>
                          <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Order Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-gray-700">Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              selectedOrder.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {selectedOrder.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {selectedOrder.status === 'in_progress' && <Truck className="h-3 w-3 mr-1" />}
                            {selectedOrder.status === 'delivered' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between mb-3">
                          <p className="text-gray-600">Delivery Date</p>
                          <p className="font-medium text-gray-700">{selectedOrder.status === "delivered" ? formattedToday : formatted}</p>
                        </div>
                        <div className="flex justify-between mb-3">
                          <p className="text-gray-600">Total Items</p>
                          <p className="font-medium text-gray-700">{selectedOrder.items.length}</p>
                        </div>
                        <div className="flex justify-between mb-3">
                          <p className="text-gray-600">Order Total</p>
                          <p className="font-medium text-gray-700">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Order Items</h3>
                    <div className="bg-gray-50 rounded-lg overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.productId.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{item.quantity} kg</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">₹{item.productId.price.toFixed(2)}/kg</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-right">₹{(item.productId.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50">
                            <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">Total</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900 text-right">₹{selectedOrder.totalAmount.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
                    <button                       className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={() => {
                        setOrderModalOpen(false);
                        setSelectedOrder(null);
                      }}
                    >
                      Close
                    </button>
                    {selectedOrder.status === 'pending' && (
                      <button
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, 'in_progress')}
                      >
                        Mark as In Progress
                      </button>
                    )}
                    {selectedOrder.status === 'in_progress' && (
                      <button
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, 'delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Modal */}
          {productModalOpen && selectedProduct && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {isNewProduct ? 'Add New Product' : 'Edit Product'}
                    </h2>
                    <button
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => {
                        setProductModalOpen(false);
                        setSelectedProduct(null);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="block h-8 text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                          value={selectedProduct.name}
                          onChange={handleProductInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          className="block text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                          value={selectedProduct.description}
                          onChange={handleProductInputChange}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price (per kg)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                              type="number"
                              id="price"
                              name="price"
                              min="0"
                              step="0.01"
                              required
                              className="block h-8 text-black w-full pl-7 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              value={selectedProduct.price}
                              onChange={handleProductInputChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            required
                            className="block h-8 text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                            value={selectedProduct.category}
                            onChange={handleProductInputChange}
                          >
                            <option value="vegetable">Vegetable</option>
                            <option value="fruit">Fruit</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          id="image"
                          name="image"
                          required
                          className="block h-8 text-black w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                          value={selectedProduct.image}
                          onChange={handleProductInputChange}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
                        onClick={() => {
                          setProductModalOpen(false);
                          setSelectedProduct(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-900 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        {isNewProduct ? 'Add Product' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;