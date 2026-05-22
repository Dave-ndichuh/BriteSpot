import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
      {/* Dynamic Tenant Logo Placeholder */}
      <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <span className="text-3xl font-bold tracking-tighter">BS</span>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-3 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Britespot</span>
      </h1>
      
      <p className="text-slate-300 text-center mb-10 text-lg leading-relaxed">
        Connect to high-speed, reliable internet instantly.
      </p>

      <div className="w-full glass-panel p-8 flex flex-col gap-5">
        <Link 
          href="/packages"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/30"
        >
          View Internet Packages
        </Link>
        
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-white/40 text-sm">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <Link 
          href="/voucher"
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-4 px-6 rounded-xl text-center transition-all duration-300"
        >
          Redeem a Voucher
        </Link>
      </div>

      <p className="text-xs text-white/40 mt-12">
        Powered by Britespot Billing Infrastructure
      </p>
    </div>
  );
}
