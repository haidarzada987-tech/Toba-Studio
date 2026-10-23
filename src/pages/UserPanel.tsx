import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen pt-32 px-6 flex items-center justify-center">
      <div className="glass max-w-xl rounded-[32px] border border-white/10 p-10 text-center space-y-5">
        <h1 className="text-4xl font-black">Customer login has been removed</h1>
        <p className="text-gray-400">Customers can place orders without an account and track them with a tracking code plus contact information.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/checkout" className="rounded-2xl bg-primary px-6 py-4 font-black text-dark">Checkout</Link>
          <Link to="/track-order" className="rounded-2xl border border-white/10 px-6 py-4 font-black">Track order</Link>
        </div>
      </div>
    </div>
  );
}
