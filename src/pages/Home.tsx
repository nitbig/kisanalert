import React from 'react';
import { ArrowRight, CloudSun, AlertTriangle, Leaf, DollarSign, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden rounded-b-[2rem] bg-transparent pt-12 pb-16 md:pt-20 md:pb-24 min-h-[400px]">
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-[#3C8B5C]/10 dark:bg-[#6EE7B7]/10 text-[#3C8B5C] dark:text-[#6EE7B7] text-base font-medium mb-4">
            Smart Crop Advisory
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1E2320] dark:text-[#FAFAF7] tracking-tight leading-tight md:leading-tight">
            Farm smarter with <br/> real-time intelligence.
          </h1>
          <p className="text-[#6B7268] dark:text-[#9CA3AF] text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Get personalized alerts, weather forecasts, and market prices tailored to your crops and region.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/advisory" 
              className="inline-flex items-center justify-center gap-2 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors shadow-lg shadow-[#3C8B5C]/20 dark:shadow-[#6EE7B7]/10 w-full sm:w-auto"
            >
              Advisory
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link to="/assistant" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1E1E1E] text-[#3C8B5C] dark:text-[#6EE7B7] px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors shadow-lg shadow-black/5 border border-[#3C8B5C]/20 dark:border-[#6EE7B7]/20 group w-full sm:w-auto">
              <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Ask Me
            </Link>
          </div>
        </div>
      </section>

      {/* At a glance cards */}
      <section className="p-4 md:p-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          
          <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex flex-col items-start gap-3">
            <div className="p-2.5 bg-[#E0A93A]/10 text-[#E0A93A] rounded-xl">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mb-1">Weather</p>
              <p className="text-lg md:text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">28°C, Clear</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex flex-col items-start gap-3">
            <div className="p-2.5 bg-[#D95F4B]/10 text-[#D95F4B] dark:text-[#F87171] rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mb-1">Alerts</p>
              <p className="text-lg md:text-xl font-bold text-[#D95F4B] dark:text-[#F87171]">2 Warnings</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex flex-col items-start gap-3">
            <div className="p-2.5 bg-[#3C8B5C]/10 dark:bg-[#6EE7B7]/10 text-[#3C8B5C] dark:text-[#6EE7B7] rounded-xl">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mb-1">Crop Health</p>
              <p className="text-lg md:text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">Good</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex flex-col items-start gap-3">
            <div className="p-2.5 bg-[#6B7268]/10 dark:bg-[#9CA3AF]/10 text-[#6B7268] dark:text-[#9CA3AF] rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mb-1">Market (Wheat)</p>
              <p className="text-lg md:text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">₹2,125 / Qtl</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Updates Section */}
      <section className="p-4 md:p-8 pt-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Latest Updates</h2>
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 shadow-sm flex gap-5 items-start">
            <div className="bg-[#E0A93A]/10 p-4 rounded-full mt-1">
              <AlertTriangle className="w-6 h-6 text-[#E0A93A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7] mb-2">Pest Advisory: Aphids</h3>
              <p className="text-[#6B7268] dark:text-[#9CA3AF] text-base leading-relaxed">High risk of aphid infestation detected in nearby wheat fields. Consider preventative spray within 48 hours.</p>
              <p className="text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mt-3">2 hours ago</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 shadow-sm flex gap-5 items-start">
             <div className="bg-[#3C8B5C]/10 dark:bg-[#6EE7B7]/10 p-4 rounded-full mt-1">
              <CloudSun className="w-6 h-6 text-[#3C8B5C] dark:text-[#6EE7B7]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7] mb-2">Favorable Weather Ahead</h3>
              <p className="text-[#6B7268] dark:text-[#9CA3AF] text-base leading-relaxed">Clear skies expected for the next 3 days. Ideal window for fertilizer application.</p>
              <p className="text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mt-3">5 hours ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
