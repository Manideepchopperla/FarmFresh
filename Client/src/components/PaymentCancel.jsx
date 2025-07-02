import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <XCircle className="text-red-600 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          Your payment was cancelled. You can try again or browse other products.
        </p>
        <Link
          to="/order"
          className="inline-block bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}