import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your order. Your transaction was completed successfully.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}