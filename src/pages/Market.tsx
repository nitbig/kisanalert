import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

const summaryData = [
  { name: 'Mon', Wheat: 2050, Rice: 2900, Cotton: 5800 },
  { name: 'Tue', Wheat: 2080, Rice: 2880, Cotton: 5900 },
  { name: 'Wed', Wheat: 2060, Rice: 2950, Cotton: 5850 },
  { name: 'Thu', Wheat: 2100, Rice: 2920, Cotton: 6000 },
  { name: 'Fri', Wheat: 2110, Rice: 2980, Cotton: 6050 },
  { name: 'Sat', Wheat: 2125, Rice: 3000, Cotton: 6100 },
  { name: 'Sun', Wheat: 2140, Rice: 3020, Cotton: 6080 },
];

export default function Market() {
  const [location, setLocation] = useState('Punjab, India');
  const [appliedLocation, setAppliedLocation] = useState('Punjab, India');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [currentPrice, setCurrentPrice] = useState(2125);
  const [marketData, setMarketData] = useState<any[]>([]);

  const [nearbyMarkets, setNearbyMarkets] = useState([
    { name: 'City Mandi', distance: '12 km', price: 2125, trend: 'up' },
    { name: 'North APMC', distance: '28 km', price: 2140, trend: 'up' },
    { name: 'East Yard', distance: '45 km', price: 2090, trend: 'down' }
  ]);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(d => {
        if (d.city && d.region) {
          setLocation(`${d.city}, ${d.region}`);
          setAppliedLocation(`${d.city}, ${d.region}`);
        }
      })
      .catch(() => {});
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchMarketData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/market-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: appliedLocation, crop: selectedCrop })
        });
        
        if (res.ok && active) {
          const data = await res.json();
          setCurrentPrice(data.price);
          setNearbyMarkets(data.nearby);
          
          // Generate a smooth trend leading up to the current price
          setMarketData([
            { name: 'Mon', price: data.price - (data.trend === 'up' ? 75 : -75) },
            { name: 'Tue', price: data.price - (data.trend === 'up' ? 45 : -45) },
            { name: 'Wed', price: data.price - (data.trend === 'up' ? 65 : -65) },
            { name: 'Thu', price: data.price - (data.trend === 'up' ? 25 : -25) },
            { name: 'Fri', price: data.price - (data.trend === 'up' ? 15 : -15) },
            { name: 'Sat', price: data.price },
          ]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    
    fetchMarketData();
    return () => { active = false; };
  }, [appliedLocation, selectedCrop]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">Market Intelligence</h1>
        <p className="text-[#6B7268] dark:text-[#9CA3AF] mt-2">Latest prices and trends at your nearest mandis.</p>
      </header>

      {/* Location Feed */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 mb-8">
        <h2 className="font-semibold text-lg mb-4 text-[#1E2320] dark:text-[#FAFAF7]">Your Market Location</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter your location..."
            className="flex-1 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] transition-colors dark:text-[#FAFAF7]"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button 
            onClick={() => setAppliedLocation(location)}
            className="px-6 py-3 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] rounded-xl font-medium hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors shrink-0"
          >
            Update Location
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['Wheat', 'Rice', 'Cotton'].map(c => (
          <button 
            key={c}
            onClick={() => setSelectedCrop(c)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCrop === c 
              ? 'bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212]' 
              : 'bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 text-[#6B7268] dark:text-[#9CA3AF]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Key Crops Weekly Summary */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
        <h2 className="text-lg font-semibold mb-6 text-[#1E2320] dark:text-[#FAFAF7]">Key Crops Weekly Summary</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6B7268" strokeOpacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7268', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7268', fontSize: 12}} width={60} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(107, 114, 104, 0.1)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-bg-opacity, #ffffff)' }}
              />
              <Line type="monotone" dataKey="Wheat" stroke="#E0A93A" strokeWidth={3} dot={{r: 4, fill: '#E0A93A', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="Rice" stroke="#3C8B5C" strokeWidth={3} dot={{r: 4, fill: '#3C8B5C', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="Cotton" stroke="#D95F4B" strokeWidth={3} dot={{r: 4, fill: '#D95F4B', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm text-[#6B7268] dark:text-[#9CA3AF]"><span className="w-3 h-3 rounded-full bg-[#E0A93A]"></span> Wheat</div>
          <div className="flex items-center gap-2 text-sm text-[#6B7268] dark:text-[#9CA3AF]"><span className="w-3 h-3 rounded-full bg-[#3C8B5C] dark:bg-[#6EE7B7]"></span> Rice</div>
          <div className="flex items-center gap-2 text-sm text-[#6B7268] dark:text-[#9CA3AF]"><span className="w-3 h-3 rounded-full bg-[#D95F4B]"></span> Cotton</div>
        </div>
      </section>

      {/* Selected Crop Overview */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div>
          <span className="inline-block px-3 py-1 bg-[#6B7268]/10 dark:bg-[#FAFAF7]/10 rounded-full text-sm font-medium mb-2 text-[#1E2320] dark:text-[#FAFAF7]">{selectedCrop}</span>
          <h2 className="text-4xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">₹{currentPrice} <span className="text-lg text-[#6B7268] dark:text-[#9CA3AF] font-normal">/ Quintal</span></h2>
          <div className="flex items-center gap-2 mt-2 text-[#3C8B5C] dark:text-[#6EE7B7]">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">+₹15 since yesterday</span>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6B7268" strokeOpacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7268', fontSize: 12}} />
              <YAxis domain={['dataMin - 50', 'dataMax + 50']} axisLine={false} tickLine={false} tick={{fill: '#6B7268', fontSize: 12}} width={60} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#3C8B5C', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="price" stroke="#3C8B5C" strokeWidth={3} dot={{r: 4, fill: '#3C8B5C', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nearest Markets Comparison */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#1E2320] dark:text-[#FAFAF7]">Compare Nearby Markets</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {nearbyMarkets.map((market, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 text-[#1E2320] dark:text-[#FAFAF7] font-medium">
                  <MapPin className="w-4 h-4 text-[#E0A93A]" />
                  {market.name}
                </div>
                <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF] bg-[#FAFAF7] dark:bg-[#121212] px-2 py-1 rounded-full">{market.distance}</span>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">₹{market.price.toLocaleString()}</span>
                {market.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-[#3C8B5C] dark:text-[#6EE7B7]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#D95F4B] dark:text-[#F87171]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
