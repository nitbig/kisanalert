import React, { useState, useEffect } from 'react';
import { User, Map, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function Profile() {
  const [location, setLocation] = useState('Punjab, India');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.region) {
          setLocation(`${data.city}, ${data.region}`);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex items-center gap-6">
        <div className="w-20 h-20 bg-[#3C8B5C]/10 dark:bg-[#6EE7B7]/10 rounded-full flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-[#3C8B5C] dark:text-[#6EE7B7]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">Ram Singh</h1>
          <p className="text-[#6B7268] dark:text-[#9CA3AF] flex items-center gap-1 mt-1">
            <Map className="w-4 h-4" />
            {location}
          </p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-[#FAFAF7] dark:bg-[#121212] rounded-full text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">12 Acres</span>
            <span className="px-3 py-1 bg-[#FAFAF7] dark:bg-[#121212] rounded-full text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">Loamy Soil</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 overflow-hidden">
        <div className="p-4 border-b border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
          <h2 className="font-semibold text-[#6B7268] dark:text-[#9CA3AF] px-2 uppercase text-xs tracking-wider">Farm Profile</h2>
        </div>
        <div className="divide-y divide-[#6B7268]/10 dark:divide-[#FAFAF7]/10">
          {[
            { label: 'Active Crops', value: 'Wheat, Mustard' },
            { label: 'Irrigation Type', value: 'Canal, Borewell' },
            { label: 'Sowing Date (Wheat)', value: '15 Nov 2025' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex justify-between items-center hover:bg-[#FAFAF7] dark:hover:bg-[#121212] transition-colors cursor-pointer px-6">
              <span className="text-[#1E2320] dark:text-[#FAFAF7] font-medium">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#6B7268] dark:text-[#9CA3AF]">{item.value}</span>
                <ChevronRight className="w-5 h-5 text-[#6B7268]/50 dark:text-[#9CA3AF]/50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 overflow-hidden">
        <div className="p-4 border-b border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
          <h2 className="font-semibold text-[#6B7268] dark:text-[#9CA3AF] px-2 uppercase text-xs tracking-wider">Settings & Help</h2>
        </div>
        <div className="divide-y divide-[#6B7268]/10 dark:divide-[#FAFAF7]/10">
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAFAF7] dark:hover:bg-[#121212] transition-colors cursor-pointer px-6">
            <div className="w-8 h-8 rounded-full bg-[#6B7268]/10 dark:bg-[#FAFAF7]/10 flex items-center justify-center text-[#1E2320] dark:text-[#FAFAF7]">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-medium flex-1 dark:text-[#FAFAF7]">App Settings</span>
            <ChevronRight className="w-5 h-5 text-[#6B7268]/50 dark:text-[#9CA3AF]/50" />
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAFAF7] dark:hover:bg-[#121212] transition-colors cursor-pointer px-6">
            <div className="w-8 h-8 rounded-full bg-[#6B7268]/10 dark:bg-[#FAFAF7]/10 flex items-center justify-center text-[#1E2320] dark:text-[#FAFAF7]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-medium flex-1 dark:text-[#FAFAF7]">Help & Support</span>
            <ChevronRight className="w-5 h-5 text-[#6B7268]/50 dark:text-[#9CA3AF]/50" />
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAFAF7] dark:hover:bg-[#121212] transition-colors cursor-pointer px-6 text-[#D95F4B] dark:text-[#F87171]">
            <div className="w-8 h-8 rounded-full bg-[#D95F4B]/10 dark:bg-[#F87171]/10 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium flex-1">Log Out</span>
          </div>
        </div>
      </div>

    </div>
  );
}
