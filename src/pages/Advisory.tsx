import React, { useState, useEffect } from 'react';
import { Droplets, Bug, Sprout, CheckCircle2, AlertTriangle, MapPin, Smartphone, RefreshCw, AlertCircle, Check, Activity } from 'lucide-react';

export interface GroundwaterData {
  depth: number;
  category: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  rainfall: string;
}

export const GROUNDWATER_DATA: Record<string, GroundwaterData> = {
  'rajasthan': { depth: 42.5, category: 'Over-Exploited', rainfall: 'Low Rainfall (350mm)' },
  'jaipur': { depth: 48.2, category: 'Over-Exploited', rainfall: 'Low Rainfall (400mm)' },
  'jaisalmer': { depth: 75.0, category: 'Over-Exploited', rainfall: 'Arid (150mm)' },
  'jodhpur': { depth: 55.4, category: 'Over-Exploited', rainfall: 'Arid (250mm)' },
  'udaipur': { depth: 28.1, category: 'Critical', rainfall: 'Moderate Rainfall (650mm)' },

  'punjab': { depth: 18.5, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (600mm)' },
  'ludhiana': { depth: 22.4, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (650mm)' },
  'amritsar': { depth: 16.8, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (580mm)' },
  'jalandhar': { depth: 19.1, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (600mm)' },

  'meghalaya': { depth: 3.2, category: 'Safe', rainfall: 'Extremely High Rainfall (2800mm)' },
  'shillong': { depth: 2.8, category: 'Safe', rainfall: 'Very High Rainfall (2400mm)' },
  'cherrapunji': { depth: 1.5, category: 'Safe', rainfall: 'Extreme Rainfall (11000mm)' },

  'kerala': { depth: 5.8, category: 'Safe', rainfall: 'High Rainfall (3000mm)' },
  'kochi': { depth: 4.2, category: 'Safe', rainfall: 'High Rainfall (3100mm)' },

  'andhra pradesh': { depth: 14.2, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (900mm)' },
  'andhra': { depth: 14.2, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (900mm)' },
  'guntur': { depth: 12.5, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (850mm)' },
  'telangana': { depth: 15.6, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (950mm)' },
  'hyderabad': { depth: 18.2, category: 'Critical', rainfall: 'Moderate Rainfall (800mm)' },

  'haryana': { depth: 20.1, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (500mm)' },
  'karnal': { depth: 18.3, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (550mm)' },

  'gujarat': { depth: 21.4, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (800mm)' },
  'ahmedabad': { depth: 26.5, category: 'Critical', rainfall: 'Low Rainfall (650mm)' },

  'maharashtra': { depth: 11.2, category: 'Safe', rainfall: 'Moderate Rainfall (1150mm)' },
  'nagpur': { depth: 10.5, category: 'Safe', rainfall: 'Moderate Rainfall (1000mm)' },
  'pune': { depth: 9.8, category: 'Safe', rainfall: 'Moderate Rainfall (750mm)' },

  'karnataka': { depth: 16.5, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (850mm)' },
  'bengaluru': { depth: 28.4, category: 'Over-Exploited', rainfall: 'Moderate Rainfall (900mm)' },

  'tamil nadu': { depth: 17.2, category: 'Semi-Critical', rainfall: 'Moderate Rainfall (950mm)' },
  'chennai': { depth: 12.8, category: 'Critical', rainfall: 'Moderate Rainfall (1200mm)' },

  'uttar pradesh': { depth: 12.4, category: 'Safe', rainfall: 'Moderate Rainfall (1000mm)' },
  'lucknow': { depth: 10.8, category: 'Safe', rainfall: 'Moderate Rainfall (950mm)' },

  'bihar': { depth: 8.5, category: 'Safe', rainfall: 'Moderate Rainfall (1150mm)' },
  'patna': { depth: 7.2, category: 'Safe', rainfall: 'Moderate Rainfall (1100mm)' },
  
  'west bengal': { depth: 6.8, category: 'Safe', rainfall: 'High Rainfall (1750mm)' },
  'kolkata': { depth: 5.4, category: 'Safe', rainfall: 'High Rainfall (1600mm)' },
};

export function getGroundwaterForLocation(locStr: string): GroundwaterData {
  const normalized = (locStr || '').toLowerCase();
  
  for (const [key, data] of Object.entries(GROUNDWATER_DATA)) {
    if (key !== 'india' && key !== 'rajasthan' && key !== 'punjab' && key !== 'meghalaya' && key !== 'kerala' && key !== 'andhra pradesh' && key !== 'andhra' && key !== 'telangana' && key !== 'haryana' && key !== 'gujarat' && key !== 'maharashtra' && key !== 'karnataka' && key !== 'tamil nadu' && key !== 'uttar pradesh' && key !== 'bihar' && key !== 'west bengal') {
      if (normalized.includes(key)) {
        return data;
      }
    }
  }

  const states = [
    'rajasthan', 'punjab', 'meghalaya', 'kerala', 'andhra pradesh', 'andhra', 'telangana', 'haryana', 
    'gujarat', 'maharashtra', 'karnataka', 'tamil nadu', 'uttar pradesh', 'bihar', 'west bengal'
  ];
  for (const state of states) {
    if (normalized.includes(state)) {
      return GROUNDWATER_DATA[state];
    }
  }

  if (normalized.includes('india')) {
    return { depth: 11.5, category: 'Safe', rainfall: 'Moderate Rainfall (1050mm)' };
  }

  return { depth: 12.0, category: 'Safe', rainfall: 'Moderate Rainfall (1000mm)' };
}

const CROP_DATA: Record<string, any> = {
  Wheat: {
    currentStageName: "Tillering",
    stages: [
      {
        name: "Sowing",
        status: "completed",
        desc: "Nov 15 - Seed treatment done."
      },
      {
        name: "Tillering",
        status: "current",
        desc: "Critical stage for root development and tiller formation.",
        advisories: [
          { type: 'irrigation', title: 'Irrigation', desc: 'First irrigation is due. Apply light irrigation to avoid waterlogging.' },
          { type: 'pest', title: 'Pest Watch', desc: 'Monitor for early signs of aphids on lower leaves.' }
        ]
      },
      {
        name: "Jointing",
        status: "upcoming",
        desc: "Expected in ~15 days."
      }
    ],
    images: {
      healthy: {
        url: "https://images.unsplash.com/photo-1592982537447-6f2334992dc8?auto=format&fit=crop&q=80&w=600",
        alt: "Healthy wheat crop",
        label: "Healthy Crop"
      },
      issue: {
        url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600",
        alt: "Stressed wheat crop with yellowing leaves",
        label: "Nitrogen Deficiency"
      }
    }
  },
  Rice: {
    currentStageName: "Transplanting",
    stages: [
      {
        name: "Nursery",
        status: "completed",
        desc: "Jun 1 - Seedlings raised."
      },
      {
        name: "Transplanting",
        status: "current",
        desc: "Optimal time to transplant seedlings to main field.",
        advisories: [
          { type: 'irrigation', title: 'Water Management', desc: 'Maintain 2-3 cm water level for first few days after transplanting.' },
          { type: 'pest', title: 'Weed Control', desc: 'Apply pre-emergence herbicide within 3 days.' }
        ]
      },
      {
        name: "Tillering",
        status: "upcoming",
        desc: "Expected in ~20 days."
      }
    ],
    images: {
      healthy: {
        url: "https://images.unsplash.com/photo-1586771107445-d3af9e15016a?auto=format&fit=crop&q=80&w=600",
        alt: "Healthy rice paddy",
        label: "Healthy Crop"
      },
      issue: {
        url: "https://images.unsplash.com/photo-1535090042247-30387644aec5?auto=format&fit=crop&q=80&w=600",
        alt: "Rice crop with disease",
        label: "Brown Spot Disease"
      }
    }
  },
  Cotton: {
    currentStageName: "Vegetative",
    stages: [
      {
        name: "Sowing",
        status: "completed",
        desc: "May 10 - Seeds planted."
      },
      {
        name: "Vegetative",
        status: "current",
        desc: "Focus on establishing a strong plant framework.",
        advisories: [
          { type: 'irrigation', title: 'Irrigation', desc: 'Water stress during this period can limit potential fruiting sites.' },
          { type: 'pest', title: 'Pest Watch', desc: 'Scout for thrips and early bollworms.' }
        ]
      },
      {
        name: "Squaring",
        status: "upcoming",
        desc: "Expected in ~10 days."
      }
    ],
    images: {
      healthy: {
        url: "https://images.unsplash.com/photo-1595856428987-a22af466f272?auto=format&fit=crop&q=80&w=600",
        alt: "Healthy cotton plant",
        label: "Healthy Crop"
      },
      issue: {
        url: "https://images.unsplash.com/photo-1506450654497-2bf3096b12d5?auto=format&fit=crop&q=80&w=600",
        alt: "Cotton pest damage",
        label: "Bollworm Damage"
      }
    }
  },
  Sugarcane: {
    currentStageName: "Grand Growth",
    stages: [
      {
        name: "Germination",
        status: "completed",
        desc: "Mar 1 - Setts planted."
      },
      {
        name: "Grand Growth",
        status: "current",
        desc: "Period of rapid stalk elongation and canopy closure.",
        advisories: [
          { type: 'irrigation', title: 'Irrigation', desc: 'High water requirement phase. Irrigate at 10-12 day intervals.' },
          { type: 'pest', title: 'Nutrient', desc: 'Apply final dose of nitrogen fertilizer.' }
        ]
      },
      {
        name: "Maturity",
        status: "upcoming",
        desc: "Expected in ~60 days."
      }
    ],
    images: {
      healthy: {
        url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Sugar_cane.jpg",
        alt: "Healthy sugarcane field",
        label: "Healthy Crop"
      },
      issue: {
        url: "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=600", 
        alt: "Sugarcane leaf issue",
        label: "Red Rot Disease"
      }
    }
  }
};

export default function Advisory() {
  const [crop, setCrop] = useState('Wheat');
  const [location, setLocation] = useState('Punjab, India');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [appliedLocation, setAppliedLocation] = useState('Punjab, India');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);

  // Multilingual preference loaded from localStorage
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('kisan_language') || 'en';
  });

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('kisan_language', lang);
  };

  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0); 
  const [recInputs, setRecInputs] = useState(() => {
    return {
      location: localStorage.getItem('kisan_location') || appliedLocation,
      soilType: localStorage.getItem('kisan_soilType') || 'Loamy',
      rainfall: localStorage.getItem('kisan_rainfall') || 'Average (auto)',
      groundwater: localStorage.getItem('kisan_groundwater') || 'Medium',
      season: localStorage.getItem('kisan_season') || 'Rabi (auto)',
      farmSize: Number(localStorage.getItem('kisan_farmSize')) || 2,
    };
  });

  React.useEffect(() => {
    localStorage.setItem('kisan_soilType', recInputs.soilType || 'Loamy');
    localStorage.setItem('kisan_rainfall', recInputs.rainfall || 'Average (auto)');
    localStorage.setItem('kisan_groundwater', recInputs.groundwater || 'Medium');
    localStorage.setItem('kisan_season', recInputs.season || 'Rabi (auto)');
    localStorage.setItem('kisan_farmSize', String(recInputs.farmSize || 2));
    if (recInputs.location) {
      localStorage.setItem('kisan_location', recInputs.location);
    }
  }, [recInputs]);

  const [recResult, setRecResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Real Dry-Spell and SMS Alert pipeline state
  const [pipelineLogs, setPipelineLogs] = useState<any[]>([]);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [pipelineError, setPipelineError] = useState('');
  const [alertSendingState, setAlertSendingState] = useState<Record<string, 'idle' | 'sending' | 'delivered' | 'simulated' | 'failed'>>({});

  const handleSendSpecificAlert = async (cropName: string, advTitle: string) => {
    const key = `${cropName}-${advTitle}`;
    setAlertSendingState(prev => ({ ...prev, [key]: 'sending' }));
    
    try {
      const res = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: cropName,
          farmerName: "Ram Singh",
          location: appliedLocation,
          stage: currentData.currentStageName,
        })
      });
      if (res.ok) {
        const data = await res.json();
        const status = data.smsStatus === 'sent' ? 'delivered' : 'simulated';
        setAlertSendingState(prev => ({ ...prev, [key]: status }));
        fetchPipelineLogs();
      } else {
        setAlertSendingState(prev => ({ ...prev, [key]: 'failed' }));
      }
    } catch (e) {
      setAlertSendingState(prev => ({ ...prev, [key]: 'failed' }));
    }
  };

  const fetchPipelineLogs = async () => {
    try {
      const res = await fetch('/api/dry-spell-logs');
      if (res.ok) {
        const data = await res.json();
        setPipelineLogs(data);
      }
    } catch (e) {
      console.log("Failed to fetch pipeline logs", e);
    }
  };

  const handleTriggerDetection = async () => {
    setIsRunningCheck(true);
    setPipelineError('');
    try {
      const res = await fetch('/api/run-dry-spell-detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.logs) {
          // Update local list
          setPipelineLogs(data.logs);
        }
      } else {
        setPipelineError('Failed to run live dry-spell check. Please try again.');
      }
    } catch (e) {
      setPipelineError('Network error while running dry-spell check.');
    } finally {
      setIsRunningCheck(false);
    }
  };

  useEffect(() => {
    fetchPipelineLogs();
  }, []);

  // Static translations dictionary
  const T: Record<string, Record<string, string>> = {
    en: {
      title: "Crop Advisory",
      subtitle: "Personalized guidance based on your crop's current growth stage.",
      locationTitle: "Farm Location",
      locationPlaceholder: "Enter your location (e.g. Punjab, India)",
      updateBtn: "Update Location",
      recTitle: "Not sure what to plant next season?",
      recSubtitle: "Get AI-powered recommendations based on Earth Engine satellite data, soil, and groundwater.",
      getRecBtn: "Get Recommendation",
      wizardTitle: "Smart Crop Recommendation Engine",
      cancelBtn: "Cancel",
      formLocation: "Location",
      formSeason: "Season",
      formRainfall: "Rainfall (Satellite + Forecast)",
      formGroundwater: "Groundwater Level",
      formSoilType: "Soil Type",
      formLandSize: "Land Size (Acres)",
      analyzeBtn: "Analyze Satellite & Field Data",
      analyzingText: "Pulling Google Earth Engine satellite imagery...",
      confidence: "Confidence",
      sourceNDVI: "Source: Earth Engine NDVI",
      useCropBtn: "Use this crop for my advisory",
      alternativesTitle: "Alternative Options",
      growthStage: "Growth Stage",
      listenBtn: "Listen to Advisory",
      stopBtn: "Stop listening",
      soilMoisture: "Soil Moisture",
      ndvi: "NDVI (Greenness)",
      groundwaterDepth: "Groundwater Depth",
    },
    hi: {
      title: "फसल सलाहकार",
      subtitle: "आपकी फसल के वर्तमान विकास चरण के आधार पर व्यक्तिगत मार्गदर्शन।",
      locationTitle: "खेत का स्थान",
      locationPlaceholder: "अपना स्थान दर्ज करें (उदा. पंजाब, भारत)",
      updateBtn: "स्थान अपडेट करें",
      recTitle: "समझ नहीं आ रहा कि अगली फसल कौन सी लगाएं?",
      recSubtitle: "गूगल अर्थ इंजन उपग्रह डेटा, मिट्टी और भूजल के आधार पर एआई-संचालित सिफारिशें प्राप्त करें।",
      getRecBtn: "सिफारिश प्राप्त करें",
      wizardTitle: "स्मार्ट फसल सिफारिश इंजन",
      cancelBtn: "रद्द करें",
      formLocation: "स्थान",
      formSeason: "मौसम",
      formRainfall: "वर्षा (उपग्रह + पूर्वानुमान)",
      formGroundwater: "भूजल स्तर",
      formSoilType: "मिट्टी का प्रकार",
      formLandSize: "भूमि का आकार (एकड़)",
      analyzeBtn: "उपग्रह और क्षेत्र डेटा का विश्लेषण करें",
      analyzingText: "गूगल अर्थ इंजन सैटेलाइट इमेजरी प्राप्त की जा रही है...",
      confidence: "विश्वास स्तर",
      sourceNDVI: "स्रोत: अर्थ इंजन एनडीवीआई",
      useCropBtn: "इस फसल को अपनी सलाह के लिए उपयोग करें",
      alternativesTitle: "वैकल्पिक विकल्प",
      growthStage: "विकास का चरण",
      listenBtn: "सलाह सुनें",
      stopBtn: "सुनना बंद करें",
      soilMoisture: "मिट्टी की नमी",
      ndvi: "एनडीवीआई (हरापन)",
      groundwaterDepth: "भूजल की गहराई",
    },
    te: {
      title: "పంట సలహా",
      subtitle: "మీ పంట ప్రస్తుత పెరుగుదల దశ ఆధారంగా వ్యక్తిగతీకరించిన మార్గదర్శకత్వం.",
      locationTitle: "వ్యవసాయ స్థానం",
      locationPlaceholder: "మీ స్థానాన్ని నమోదు చేయండి (ఉదా. పంజాబ్, ఇండియా)",
      updateBtn: "స్థానాన్ని నవీకరించు",
      recTitle: "తదుపరి సీజన్‌లో ఏమి నాటాలనే గందరంగోళంలో ఉన్నారా?",
      recSubtitle: "గూగుల్ ఎర్త్ ఇంజిన్ శాటిలైట్ డేటా, నేల మరియు భూగర్భ జలాల ఆధారంగా AI సిఫార్సులను పొందండి.",
      getRecBtn: "సిఫార్సు పొందండి",
      wizardTitle: "స్మార్ట్ పంట సిఫార్సు ఇంజిన్",
      cancelBtn: "రద్దు చేయి",
      formLocation: "స్థానం",
      formSeason: "సీజన్",
      formRainfall: "వర్షపాతం (శాటిలైറ്റ് + సూచన)",
      formGroundwater: "భూగర్భ జల మట్టం",
      formSoilType: "నేల రకం",
      formLandSize: "భూమి పరిమాణం (ఎకరాలు)",
      analyzeBtn: "శాటిలైట్ & క్షేత్ర డేటాను విశ్లేషించు",
      analyzingText: "గూగుల్ ఎర్త్ ఇంజిన్ శాటిలైట్ చిత్రాలను సేకరిస్తోంది...",
      confidence: "నమ్మకమైన శాతం",
      sourceNDVI: "మూలం: ఎర్త్ ఇంజిన్ NDVI",
      useCropBtn: "ఈ పంటను నా సలహా కోసం ఉపయోగించు",
      alternativesTitle: "ప్రత్యామ్నాయ పంటలు",
      growthStage: "పెరుగుదల దశ",
      listenBtn: "సలహా వినండి",
      stopBtn: "ఆపివేయండి",
      soilMoisture: "నేల తేమ",
      ndvi: "NDVI (పచ్చదనం)",
      groundwaterDepth: "భూగర్భ జల లోతు",
    },
    pa: {
      title: "ਫਸਲ ਸਲਾਹਕਾਰ",
      subtitle: "ਤੁਹਾਡੀ ਫਸਲ ਦੇ ਮੌਜੂਦਾ ਵਿਕਾਸ ਪੜਾਅ ਦੇ ਅਧਾਰ ਤੇ ਨਿੱਜੀ ਸਲਾਹ।",
      locationTitle: "ਖੇਤ ਦਾ ਸਥਾਨ",
      locationPlaceholder: "ਆਪਣਾ ਸਥਾਨ ਦਰਜ ਕਰੋ (ਜਿਵੇਂ ਕਿ ਪੰਜਾਬ, ਭਾਰਤ)",
      updateBtn: "ਸਥਾਨ ਅਪਡੇਟ ਕਰੋ",
      recTitle: "ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ ਕਿ ਅਗਲੀ ਫਸਲ ਕਿਹੜੀ ਲਗਾਈਏ?",
      recSubtitle: "ਗੂਗਲ ਅਰਥ ਇੰਜਣ ਸੈਟੇਲਾਈਟ ਡੇਟਾ, ਮਿੱਟੀ ਅਤੇ ਭੂਮੀਗਤ ਪਾਣੀ ਦੇ ਅਧਾਰ ਤੇ ਏਆਈ-ਸੰਚਾਲਿਤ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।",
      getRecBtn: "ਸਿਫਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ",
      wizardTitle: "ਸਮਾਰਟ ਫਸਲ ਸਿਫਾਰਸ਼ ਇੰਜਣ",
      cancelBtn: "ਰੱਦ ਕਰੋ",
      formLocation: "ਸਥਾਨ",
      formSeason: "ਮੌਸਮ",
      formRainfall: "ਮੀਂਹ (ਸੈਟੇਲਾਈਟ + ਭਵਿੱਖਬਾਣੀ)",
      formGroundwater: "ਭੂਮੀਗਤ ਪਾਣੀ ਦਾ ਪੱਧਰ",
      formSoilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
      formLandSize: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਏਕੜ)",
      analyzeBtn: "ਸੈਟੇਲਾਈਟ ਅਤੇ ਖੇਤਰੀ ਡੇਟਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
      analyzingText: "ਗੂਗਲ ਅਰਥ ਇੰਜਣ ਸੈਟੇਲਾਈਟ ਚਿੱਤਰ ਪ੍ਰਾਪਤ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...",
      confidence: "ਭਰੋਸਾ ਪੱਧਰ",
      sourceNDVI: "ਸਰੋਤ: ਅਰਥ ਇੰਜਣ NDVI",
      useCropBtn: "ਇਸ ਫਸਲ ਨੂੰ ਆਪਣੀ ਸਲਾਹ ਲਈ ਵਰਤੋਂ",
      alternativesTitle: "ਵਿਕਲਪਿਕ ਫਸਲਾਂ",
      growthStage: "ਵਿਕਾਸ ਪੜਾਅ",
      listenBtn: "ਸਲਾਹ ਸੁਣੋ",
      stopBtn: "ਸੁਣਨਾ ਬੰਦ ਕਰੋ",
      soilMoisture: "ਮਿੱਟੀ ਦੀ ਨਮੀ",
      ndvi: "NDVI (ਹਰਿਆਵਲ)",
      groundwaterDepth: "ਭੂਮੀਗਤ ਪਾਣੀ ਦੀ ਡੂੰਘਾਈ",
    }
  };

  const labels = T[language] || T['en'];

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'te') utterance.lang = 'te-IN';
        else if (language === 'pa') utterance.lang = 'pa-IN';
        else utterance.lang = 'en-IN';
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Text-to-speech not supported on your browser.");
        setIsSpeaking(false);
      }
    }
  };

  const calculateAutoParams = (loc: string, d: string) => {
    const month = new Date(d).getMonth();
    const season = (month >= 5 && month <= 9) ? 'Kharif (auto)' : 'Rabi (auto)';
    
    let soilType = 'Loamy';
    const locLower = loc.toLowerCase();
    if (locLower.includes('maharashtra') || locLower.includes('gujarat') || locLower.includes('madhya pradesh')) {
      soilType = 'Black Cotton';
    } else if (locLower.includes('punjab') || locLower.includes('haryana')) {
      soilType = 'Loamy';
    } else if (locLower.includes('rajasthan')) {
      soilType = 'Sandy';
    } else if (locLower.includes('south') || locLower.includes('tamil') || locLower.includes('kerala') || locLower.includes('andhra') || locLower.includes('telangana')) {
      soilType = 'Red';
    } else if (locLower.includes('bengal') || locLower.includes('bihar') || locLower.includes('patna')) {
      soilType = 'Clay';
    }

    const gw = getGroundwaterForLocation(loc);
    let groundwater = 'Medium';
    if (gw.category === 'Over-Exploited' || gw.category === 'Critical') {
      groundwater = 'Low';
    } else if (gw.category === 'Safe') {
      groundwater = 'High';
    }

    return { season, soilType, groundwater };
  };

  React.useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.region) {
          const locStr = `${data.city}, ${data.region}`;
          setLocation(locStr);
          setAppliedLocation(locStr);
          
          const { season, soilType, groundwater } = calculateAutoParams(locStr, date);
          setRecInputs(prev => ({ 
            ...prev, 
            location: locStr,
            season,
            soilType,
            groundwater
          }));
        }
      })
      .catch(() => {});
  }, []);

  const updateLocationData = () => {
    setAppliedLocation(location);
    setAppliedDate(date);
    
    const { season, soilType, groundwater } = calculateAutoParams(location, date);

    setRecInputs(prev => ({ 
      ...prev, 
      location: location,
      season,
      soilType,
      groundwater
    }));
  };

  const baseData = CROP_DATA[crop] || CROP_DATA['Wheat'];
  
  const currentData = React.useMemo(() => {
    const data = JSON.parse(JSON.stringify(baseData)); 
    const stagesCount = data.stages.length;
    let currentIdx = 0;
    
    const month = new Date(appliedDate).getMonth();
    
    if (crop === 'Wheat') {
      if (month >= 10) currentIdx = 0; 
      else if (month <= 1) currentIdx = 1; 
      else currentIdx = 2; 
    } else if (crop === 'Rice') {
      if (month >= 5 && month <= 6) currentIdx = 0;
      else if (month >= 7 && month <= 8) currentIdx = 1;
      else currentIdx = 2; 
    } else if (crop === 'Cotton') {
      if (month >= 5 && month <= 7) currentIdx = 0;
      else if (month >= 8 && month <= 9) currentIdx = 1;
      else currentIdx = 2;
    } else if (crop === 'Sugarcane') {
      if (month <= 3) currentIdx = 0;
      else if (month <= 8) currentIdx = 1;
      else currentIdx = 2;
    }

    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx >= stagesCount) currentIdx = stagesCount - 1;
    
    data.currentStageName = data.stages[currentIdx].name;
    
    data.stages.forEach((stage: any, idx: number) => {
      if (idx < currentIdx) stage.status = 'completed';
      else if (idx === currentIdx) stage.status = 'current';
      else stage.status = 'upcoming';
    });
    return data;
  }, [baseData, crop, appliedDate]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Top Language Select Toolbar */}
      <div className="flex justify-end gap-2 mb-6">
        {[
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'हिन्दी' },
          { code: 'te', name: 'తెలుగు' },
          { code: 'pa', name: 'ਪੰਜਾਬੀ' }
        ].map(l => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              language === l.code 
              ? 'bg-[#3C8B5C] text-white border-[#3C8B5C] shadow-sm' 
              : 'bg-white dark:bg-[#1E1E1E] text-[#6B7268] dark:text-[#9CA3AF] border-[#6B7268]/20 hover:bg-[#3C8B5C]/5'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">{labels.title}</h1>
        <p className="text-[#6B7268] dark:text-[#9CA3AF] mt-2">{labels.subtitle}</p>
      </header>

      {/* Location Feed */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 mb-8">
        <h2 className="font-semibold text-lg mb-4 text-[#1E2320] dark:text-[#FAFAF7]">{labels.locationTitle}</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input 
            type="text" 
            placeholder={labels.locationPlaceholder}
            className="flex-1 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] transition-colors dark:text-[#FAFAF7]"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="date"
              className="bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] transition-colors dark:text-[#FAFAF7]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button 
              onClick={updateLocationData}
              className="px-6 py-3 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] rounded-xl font-medium hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors shrink-0"
            >
              {labels.updateBtn}
            </button>
          </div>
        </div>
        <div className="h-64 rounded-xl overflow-hidden border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 bg-[#FAFAF7] dark:bg-[#121212]">
          {appliedLocation ? (
            <iframe 
              title="Map"
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              loading="lazy" 
              allowFullScreen 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(appliedLocation)}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#6B7268] dark:text-[#9CA3AF]">
              <MapPin className="w-8 h-8 mb-2 opacity-50" />
              <span>Enter a location to view map</span>
            </div>
          )}
        </div>
      </div>

      {/* Smart Crop Recommendation Card */}
      {!showWizard ? (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 mb-8 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2 text-[#1E2320] dark:text-[#FAFAF7]">
                 {labels.recTitle}
              </h2>
              <p className="text-[#6B7268] dark:text-[#9CA3AF] text-sm mt-1">{labels.recSubtitle}</p>
            </div>
            <button 
              onClick={() => setShowWizard(true)}
              className="px-6 py-3 bg-[#1E2320] dark:bg-[#FAFAF7] text-white dark:text-[#1E2320] rounded-xl font-medium shrink-0 hover:bg-[#2c332f] dark:hover:bg-[#E5E7EB] transition-colors"
            >
              {labels.getRecBtn}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 mb-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-[#1E2320] dark:text-[#FAFAF7]">{labels.wizardTitle}</h2>
            <button onClick={() => { setShowWizard(false); setWizardStep(0); }} className="text-[#6B7268] dark:text-[#9CA3AF] hover:text-[#1E2320] dark:hover:text-[#FAFAF7] font-medium text-sm">{labels.cancelBtn}</button>
          </div>
          
          {wizardStep === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                     <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-1">{labels.formLocation}</label>
                     <input type="text" value={recInputs.location} onChange={(e) => setRecInputs({...recInputs, location: e.target.value})} className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-1">{labels.formSeason}</label>
                     <input type="text" value={recInputs.season} onChange={(e) => setRecInputs({...recInputs, season: e.target.value})} className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-1">{labels.formRainfall}</label>
                     <input type="text" value={recInputs.rainfall} onChange={(e) => setRecInputs({...recInputs, rainfall: e.target.value})} className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-1">{labels.formGroundwater}</label>
                     <select value={recInputs.groundwater} onChange={(e) => setRecInputs({...recInputs, groundwater: e.target.value})} className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]">
                       <option>Low</option>
                       <option>Medium</option>
                       <option>High</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-1">{labels.formLandSize}</label>
                     <input 
                       type="number" 
                       min="1" 
                       max="100" 
                       value={recInputs.farmSize} 
                       onChange={(e) => setRecInputs({...recInputs, farmSize: parseFloat(e.target.value) || 2})} 
                       className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]" 
                     />
                  </div>
                  <div className="sm:col-span-2">
                     <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-2">{labels.formSoilType}</label>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {['Sandy', 'Loamy', 'Clay', 'Silty', 'Black Cotton', 'Red'].map(soil => (
                         <button key={soil} onClick={() => setRecInputs({...recInputs, soilType: soil})} className={`py-2 px-3 rounded-lg border text-sm text-left flex items-center gap-2 ${recInputs.soilType === soil ? 'border-[#3C8B5C] dark:border-[#6EE7B7] bg-[#3C8B5C]/5 dark:bg-[#6EE7B7]/10 text-[#3C8B5C] dark:text-[#6EE7B7]' : 'border-[#6B7268]/20 dark:border-[#FAFAF7]/20 text-[#6B7268] dark:text-[#9CA3AF]'}`}>
                           <div className={`w-3 h-3 rounded-full ${recInputs.soilType === soil ? 'bg-[#3C8B5C] dark:bg-[#6EE7B7]' : 'bg-[#6B7268]/30 dark:bg-[#FAFAF7]/30'}`}></div>
                           {soil}
                         </button>
                       ))}
                     </div>
                  </div>
              </div>
              <button 
                onClick={async () => {
                  setWizardStep(1);
                  try {
                    const res = await fetch('/api/recommend-crop', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...recInputs, language })
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setRecResult(data);
                    } else {
                      throw new Error();
                    }
                  } catch (e) {
                    setRecResult({
                      crop: language === 'hi' ? 'गेहूं (Wheat)' : language === 'te' ? 'వరి (Rice)' : language === 'pa' ? 'ਕਣਕ (Wheat)' : 'Wheat',
                      reason: language === 'hi' ? 'दोमट मिट्टी और अनुकूल तापमान के आधार पर उत्कृष्ट विकल्प।' : 'Suitable soil and local climate fits this crop beautifully.',
                      confidence: 'Medium',
                      satellite: { soilMoisture: 23, ndvi: 0.61, groundwaterDepth: 8.4 },
                      alternatives: [
                        { name: language === 'hi' ? 'सरसों' : 'Mustard', reason: 'Very low water demand.' }
                      ]
                    });
                  }
                  setWizardStep(2);
                }}
                className="w-full mt-4 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] px-6 py-3 rounded-xl font-semibold hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-all"
              >
                {labels.analyzeBtn}
              </button>
            </div>
          )}

          {wizardStep === 1 && (
             <div className="flex flex-col items-center justify-center py-12 space-y-4 text-[#6B7268] dark:text-[#9CA3AF]">
                <div className="w-12 h-12 rounded-full border-4 border-[#6B7268]/20 dark:border-[#FAFAF7]/20 border-t-[#3C8B5C] dark:border-t-[#6EE7B7] animate-spin"></div>
                <p className="font-medium">{labels.analyzingText}</p>
             </div>
          )}

          {wizardStep === 2 && recResult && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Simulated Satellite Metrics Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-[#FAFAF7] dark:bg-[#121212] rounded-2xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
                    <div className="text-xs font-semibold text-[#6B7268] dark:text-[#9CA3AF] uppercase tracking-wider">{labels.soilMoisture}</div>
                    <div className="text-2xl font-bold text-[#3C8B5C] dark:text-[#6EE7B7] mt-1">
                      {recResult.satellite?.soilMoisture || 24}%
                    </div>
                    <div className="w-full bg-[#6B7268]/10 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#3C8B5C] dark:bg-[#6EE7B7] h-full rounded-full" style={{ width: `${recResult.satellite?.soilMoisture || 24}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#FAFAF7] dark:bg-[#121212] rounded-2xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
                    <div className="text-xs font-semibold text-[#6B7268] dark:text-[#9CA3AF] uppercase tracking-wider">{labels.ndvi}</div>
                    <div className="text-2xl font-bold text-[#E0A93A] mt-1">
                      {recResult.satellite?.ndvi || 0.62}
                    </div>
                    <div className="w-full bg-[#6B7268]/10 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#E0A93A] h-full rounded-full" style={{ width: `${(recResult.satellite?.ndvi || 0.62) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#FAFAF7] dark:bg-[#121212] rounded-2xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
                    <div className="text-xs font-semibold text-[#6B7268] dark:text-[#9CA3AF] uppercase tracking-wider">{labels.groundwaterDepth}</div>
                    <div className="text-2xl font-bold text-[#3C8B5C] mt-1">
                      {recResult.satellite?.groundwaterDepth || 8.2}m
                    </div>
                    <p className="text-xs text-[#6B7268] dark:text-[#9CA3AF] mt-2">
                      Category: <span className={`font-semibold ${
                        (recResult.satellite?.groundwaterCategory || 'Safe') === 'Over-Exploited' ? 'text-red-500' :
                        (recResult.satellite?.groundwaterCategory || 'Safe') === 'Critical' ? 'text-orange-500' :
                        (recResult.satellite?.groundwaterCategory || 'Safe') === 'Semi-Critical' ? 'text-yellow-600' : 'text-green-600'
                      }`}>{recResult.satellite?.groundwaterCategory || 'Safe'}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#3C8B5C]/5 border border-[#3C8B5C]/20 rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white dark:bg-[#1E1E1E] rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Sprout className="w-6 h-6 text-[#3C8B5C] dark:text-[#6EE7B7]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">{recResult.crop}</h3>
                        <span className="inline-block px-2 py-0.5 bg-[#1E2320]/5 dark:bg-[#FAFAF7]/10 text-[#1E2320] dark:text-[#FAFAF7] text-xs rounded mt-1 font-medium">{labels.confidence}: {recResult.confidence}</span>
                      </div>
                    </div>

                    {/* Speaker Button + Pulse wave */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {isSpeaking && (
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-3 bg-[#3C8B5C] dark:bg-[#6EE7B7] rounded-full animate-pulse"></span>
                          <span className="w-1 h-5 bg-[#3C8B5C] dark:bg-[#6EE7B7] rounded-full animate-pulse delay-75"></span>
                          <span className="w-1 h-2 bg-[#3C8B5C] dark:bg-[#6EE7B7] rounded-full animate-pulse delay-150"></span>
                        </div>
                      )}
                      <button 
                        onClick={() => handleSpeak(`${recResult.crop}. ${recResult.reason}`)}
                        className={`p-2.5 rounded-full flex items-center gap-1.5 text-xs font-medium border shadow-sm transition-all ${isSpeaking ? 'bg-[#D95F4B] border-[#D95F4B] text-white animate-pulse' : 'bg-white dark:bg-[#1E1E1E] border-[#6B7268]/20 text-[#3C8B5C] dark:text-[#6EE7B7]'}`}
                      >
                        {isSpeaking ? labels.stopBtn : labels.listenBtn}
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-[#1E2320] dark:text-[#FAFAF7] leading-relaxed">{recResult.reason}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                     <span className="px-2 py-1 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium">{labels.sourceNDVI}</span>
                     <span className="px-2 py-1 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium">Soil: {recInputs.soilType}</span>
                     <span className="px-2 py-1 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium">Size: {recInputs.farmSize} Ac</span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => {
                        const standardCropName = recResult.crop.split(' ')[0].replace(/[()]/g, '');
                        setCrop(CROP_DATA[standardCropName] ? standardCropName : 'Wheat');
                        setShowWizard(false);
                        setWizardStep(0);
                      }}
                      className="bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors flex-1 text-center"
                    >
                      {labels.useCropBtn}
                    </button>
                  </div>
                </div>

                {recResult.alternatives && recResult.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-3 text-sm uppercase tracking-wider">{labels.alternativesTitle}</h4>
                    <div className="space-y-3">
                      {recResult.alternatives.map((alt: any) => (
                        <div key={alt.name} className="flex items-center justify-between p-4 border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-xl bg-[#FAFAF7] dark:bg-[#121212]">
                          <div>
                            <div className="font-bold text-[#1E2320] dark:text-[#FAFAF7] flex items-center gap-1.5">
                              <Sprout className="w-4 h-4 text-[#3C8B5C]" />
                              {alt.name}
                            </div>
                            <div className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mt-1">{alt.reason}</div>
                          </div>
                          <button 
                            onClick={() => {
                              const standardCropName = alt.name.split(' ')[0].replace(/[()]/g, '');
                              setCrop(CROP_DATA[standardCropName] ? standardCropName : 'Wheat');
                              setShowWizard(false);
                              setWizardStep(0);
                            }}
                            className="px-4 py-2 text-sm font-semibold text-[#3C8B5C] dark:text-[#6EE7B7] bg-[#3C8B5C]/10 dark:bg-[#6EE7B7]/10 rounded-lg hover:bg-[#3C8B5C]/20 dark:hover:bg-[#6EE7B7]/20 transition-all shrink-0"
                          >
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          )}
        </div>
      )}
      
      {/* Selectors */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['Wheat', 'Rice', 'Cotton', 'Sugarcane'].map(c => (
          <button 
            key={c}
            onClick={() => setCrop(c)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-colors ${
              crop === c 
              ? 'bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212]' 
              : 'bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 text-[#6B7268] dark:text-[#9CA3AF]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 mb-8">
        <h2 className="font-bold text-lg mb-6 text-[#1E2320] dark:text-[#FAFAF7]">{labels.growthStage}: {currentData.currentStageName}</h2>
        
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-[#6B7268]/10 dark:bg-[#FAFAF7]/10"></div>
          
          <div className="space-y-8 relative">
            {currentData.stages.map((stage: any, index: number) => (
              <div key={index} className={`flex gap-4 ${stage.status === 'completed' ? 'opacity-50' : stage.status === 'upcoming' ? 'opacity-40' : ''}`}>
                {stage.status === 'completed' && (
                  <div className="w-10 h-10 rounded-full bg-[#3C8B5C] dark:bg-[#6EE7B7] flex items-center justify-center shrink-0 z-10 text-white dark:text-[#121212]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {stage.status === 'current' && (
                  <div className="w-10 h-10 rounded-full border-4 border-white dark:border-[#1E1E1E] bg-[#E0A93A] shadow-[0_0_0_2px_#E0A93A] flex items-center justify-center shrink-0 z-10 text-white">
                    <Sprout className="w-5 h-5" />
                  </div>
                )}
                {stage.status === 'upcoming' && (
                  <div className="w-10 h-10 rounded-full bg-[#6B7268]/20 dark:bg-[#FAFAF7]/20 flex items-center justify-center shrink-0 z-10">
                    <div className="w-3 h-3 bg-white dark:bg-[#1E1E1E] rounded-full"></div>
                  </div>
                )}
                <div className="pt-2 flex-1">
                  <h3 className={`font-bold ${stage.status === 'current' ? 'text-[#E0A93A]' : 'text-[#1E2320] dark:text-[#FAFAF7]'}`}>
                    {stage.name} ({stage.status === 'completed' ? 'Completed' : stage.status === 'current' ? 'Current' : 'Upcoming'})
                  </h3>
                  <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mt-1">{stage.desc}</p>
                  
                  {stage.status === 'current' && stage.advisories && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {stage.advisories.map((adv: any, i: number) => {
                        const isWaterWarning = adv.type === 'irrigation' || adv.title.toLowerCase().includes('water') || adv.title.toLowerCase().includes('irrigation') || adv.title.toLowerCase().includes('dry');
                        const key = `${crop}-${adv.title}`;
                        const sendState = alertSendingState[key] || 'idle';
                        return (
                          <div key={i} className={`p-4 rounded-xl flex flex-col justify-between ${adv.type === 'irrigation' ? 'bg-[#3C8B5C]/5 border border-[#3C8B5C]/20 dark:border-[#6EE7B7]/30' : 'bg-[#E0A93A]/5 border border-[#E0A93A]/20'}`}>
                            <div>
                              <div className={`flex items-center gap-2 mb-2 font-semibold ${adv.type === 'irrigation' ? 'text-[#3C8B5C] dark:text-[#6EE7B7]' : 'text-[#E0A93A]'}`}>
                                {adv.type === 'irrigation' ? <Droplets className="w-4 h-4" /> : <Bug className="w-4 h-4" />}
                                {adv.title}
                              </div>
                              <p className="text-sm text-[#1E2320] dark:text-[#FAFAF7] leading-relaxed">
                                {adv.desc}
                              </p>
                            </div>
                            
                            {isWaterWarning && (
                              <div className="mt-4 pt-3 border-t border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex items-center justify-between">
                                <span className="text-[10px] text-[#6B7268] dark:text-[#9CA3AF] uppercase font-mono">Demo Dispatcher:</span>
                                <button
                                  onClick={() => handleSendSpecificAlert(crop, adv.title)}
                                  disabled={sendState === 'sending'}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                                    sendState === 'sending'
                                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                      : sendState === 'delivered'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : sendState === 'simulated'
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                      : sendState === 'failed'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-[#3C8B5C] text-white hover:bg-[#2c6b45] dark:bg-[#6EE7B7] dark:text-[#121212] dark:hover:bg-[#34D399]'
                                  }`}
                                >
                                  {sendState === 'sending' ? 'Sending...' : 
                                   sendState === 'delivered' ? '✓ Delivered' :
                                   sendState === 'simulated' ? '✓ Simulated' :
                                   sendState === 'failed' ? '✗ Failed' :
                                   'Send Alert'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Real-time SMS & Dry-Spell Alert Delivery Pipeline */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#6B7268]/10 pb-4 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#D95F4B] dark:text-[#F87171] font-bold text-xs uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 animate-pulse" /> Live Transmission Pipeline Active
            </div>
            <h2 className="font-bold text-xl text-[#1E2320] dark:text-[#FAFAF7]">SMS & Dry-Spell Alert Pipeline</h2>
            <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mt-1">
              Automated risk assessment: checks satellite forecasts against specific farmer crop stages.
            </p>
          </div>
          <button
            onClick={handleTriggerDetection}
            disabled={isRunningCheck}
            className={`px-5 py-3 rounded-xl font-semibold text-sm shadow-sm flex items-center gap-2 transition-all shrink-0 ${
              isRunningCheck 
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' 
                : 'bg-[#3C8B5C] text-white hover:bg-[#2c6b45] dark:bg-[#6EE7B7] dark:text-[#121212] dark:hover:bg-[#34D399]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRunningCheck ? 'animate-spin' : ''}`} />
            {isRunningCheck ? 'Auditing Fields...' : 'Trigger Dry-Spell Check'}
          </button>
        </div>

        {pipelineError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {pipelineError}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-[#FAFAF7] dark:bg-[#121212] p-5 rounded-2xl border border-[#6B7268]/10 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs text-[#1E2320] dark:text-[#FAFAF7] uppercase tracking-wider mb-3">Pipeline Parameters</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex justify-between pb-2 border-b border-[#6B7268]/5">
                  <span className="text-[#6B7268] dark:text-[#9CA3AF]">Checked Farmers:</span>
                  <span className="font-bold">4 Active Hubs</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-[#6B7268]/5">
                  <span className="text-[#6B7268] dark:text-[#9CA3AF]">Satellite Forecast:</span>
                  <span className="font-bold text-[#3C8B5C]">Open-Meteo REST</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-[#6B7268]/5">
                  <span className="text-[#6B7268] dark:text-[#9CA3AF]">Risk Threshold:</span>
                  <span className="font-bold text-amber-500">&lt; 2.0 mm / 7 days</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-[#6B7268]/5">
                  <span className="text-[#6B7268] dark:text-[#9CA3AF]">Dry-Spell Status:</span>
                  <span className="font-bold text-red-500">Live Scanned</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-1">
              <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF] block mb-1.5">SMS Carrier Endpoint:</span>
              <div className="p-2.5 bg-white dark:bg-black/30 rounded border border-[#6B7268]/15 font-mono text-[10px]">
                {pipelineLogs.some(log => log.smsStatus === 'sent') ? (
                  <span className="text-[#3C8B5C] font-semibold">● SMS_API_KEY Active (sent via carrier)</span>
                ) : (
                  <span className="text-amber-500 font-semibold">● [SIMULATED SMS] Mode (credentials unset)</span>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 max-h-[360px] overflow-y-auto pr-1">
            <h3 className="font-bold text-xs text-[#1E2320] dark:text-[#FAFAF7] uppercase tracking-wider mb-2">Transmission Log Stream</h3>
            {pipelineLogs.length === 0 ? (
              <div className="text-center py-12 text-[#6B7268] dark:text-[#9CA3AF] text-sm italic">
                No logs generated yet. Trigger a check to start the pipeline!
              </div>
            ) : (
              pipelineLogs.map((log) => (
                <div key={log.id} className="p-4 bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#6B7268]/15 dark:border-[#FAFAF7]/15 shadow-sm hover:border-[#3C8B5C]/30 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${log.hasRisk ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <span className="font-bold text-xs">{log.id}</span>
                      <span className="text-[10px] text-gray-400 font-mono">({new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        log.hasRisk 
                          ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                          : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {log.riskType === 'None' ? 'No Risk' : log.riskType}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 ${
                        log.smsStatus === 'sent' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : log.smsStatus === 'simulated'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        <Smartphone className="w-3 h-3" />
                        {log.smsStatus === 'sent' ? 'Sent (Live)' : log.smsStatus === 'simulated' ? 'Simulated SMS' : 'Failed'}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#3C8B5C] dark:text-[#6EE7B7]">{log.farmerName}</span>
                    <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF]"> ({log.location}) • {log.crop} ({log.stage})</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 bg-[#FAFAF7] dark:bg-[#121212] p-2 rounded border border-[#6B7268]/5 font-mono whitespace-pre-wrap leading-normal">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Crop Image */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 shadow-sm max-w-2xl mx-auto mb-8 !mt-[55px]">
        <img src={currentData.images.healthy.url} alt={currentData.images.healthy.alt} className="w-full h-64 object-cover" />
        <div className="p-4 flex items-center gap-2 bg-[#FAFAF7]/30 dark:bg-[#121212]/30">
          <CheckCircle2 className="text-[#3C8B5C] dark:text-[#6EE7B7] w-5 h-5 shrink-0" />
          <span className="font-semibold text-[#1E2320] dark:text-[#FAFAF7] text-sm">{currentData.images.healthy.label}</span>
        </div>
      </div>
    </div>
  );
}
