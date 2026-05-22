import Link from 'next/link';

export default function StatusPage() {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up text-center">
      <div className="w-24 h-24 mb-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>

      <h2 className="text-3xl font-extrabold text-white mb-2">You're Connected!</h2>
      <p className="text-white/70 mb-8 text-lg">
        Your payment was successful and internet access has been activated.
      </p>

      <div className="glass-panel w-full p-6 flex flex-col gap-4 mb-8 text-left">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <span className="text-white/60 text-sm">Package</span>
          <span className="text-white font-medium">Daily Unlimited</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <span className="text-white/60 text-sm">Speed Limit</span>
          <span className="text-white font-medium">10 Mbps</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm">Time Remaining</span>
          <span className="text-emerald-400 font-bold">23h 59m</span>
        </div>
      </div>

      <Link 
        href="#"
        className="text-white/50 hover:text-white text-sm underline transition-colors"
      >
        Disconnect Session
      </Link>
    </div>
  );
}
