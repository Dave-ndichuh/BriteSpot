'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate STK Push delay
    setTimeout(() => {
      router.push('/status');
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
      <div className="w-full flex justify-between items-center mb-8">
        <Link href="/packages" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-xl font-bold">M-Pesa Payment</h2>
        <div className="w-6" />
      </div>

      <div className="glass-panel w-full p-8 mb-6">
        <div className="text-center mb-6">
          <p className="text-white/60 text-sm mb-1">You are purchasing</p>
          <h3 className="text-2xl font-bold text-white mb-2">Daily Unlimited</h3>
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            KES 50
          </div>
        </div>

        <form onSubmit={handlePayment} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">M-Pesa Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">+254</span>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="7XX XXX XXX"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-14 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || phone.length < 9}
            className="w-full bg-[#52B520] hover:bg-[#469e1b] disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              'Pay with M-Pesa'
            )}
          </button>
        </form>
      </div>

      <p className="text-xs text-center text-white/50 px-4">
        Enter your number and wait for the STK prompt on your phone to complete payment.
      </p>
    </div>
  );
}
