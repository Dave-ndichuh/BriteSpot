import Link from 'next/link';

const packages = [
  { id: '1', name: '1 Hour Pass', price: '20', speed: '5 Mbps', duration: '1 Hour', popular: false },
  { id: '2', name: 'Daily Unlimited', price: '50', speed: '10 Mbps', duration: '24 Hours', popular: true },
  { id: '3', name: 'Weekly Pass', price: '300', speed: '10 Mbps', duration: '7 Days', popular: false },
];

export default function PackagesPage() {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
      <div className="w-full flex justify-between items-center mb-8">
        <Link href="/" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-xl font-bold">Select a Package</h2>
        <div className="w-6" /> {/* Spacer */}
      </div>

      <div className="w-full flex flex-col gap-4">
        {packages.map((pkg) => (
          <Link 
            href={`/payment/${pkg.id}`} 
            key={pkg.id}
            className={`w-full glass-panel p-6 flex flex-col relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${pkg.popular ? 'border-indigo-400/50 shadow-indigo-500/20' : ''}`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </span>
            )}
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
              <div className="text-right">
                <span className="text-xs text-white/60 font-medium">KES</span>
                <span className="text-2xl font-bold ml-1 text-indigo-300">{pkg.price}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-white/70 mt-2">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {pkg.speed}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {pkg.duration}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
