import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Cloud, AlertTriangle, CloudLightning, CloudSnow, MapPin, Smartphone, Database, CheckCircle2 } from 'lucide-react';

const WMO_CODES: Record<number, { icon: any, desc: string }> = {
  0: { icon: Sun, desc: 'Clear sky' },
  1: { icon: Sun, desc: 'Mainly clear' },
  2: { icon: Cloud, desc: 'Partly cloudy' },
  3: { icon: Cloud, desc: 'Overcast' },
  45: { icon: Cloud, desc: 'Fog' },
  48: { icon: Cloud, desc: 'Depositing rime fog' },
  51: { icon: CloudRain, desc: 'Light drizzle' },
  53: { icon: CloudRain, desc: 'Moderate drizzle' },
  55: { icon: CloudRain, desc: 'Dense drizzle' },
  56: { icon: CloudRain, desc: 'Light freezing drizzle' },
  57: { icon: CloudRain, desc: 'Dense freezing drizzle' },
  61: { icon: CloudRain, desc: 'Slight rain' },
  63: { icon: CloudRain, desc: 'Moderate rain' },
  65: { icon: CloudRain, desc: 'Heavy rain' },
  66: { icon: CloudRain, desc: 'Light freezing rain' },
  67: { icon: CloudRain, desc: 'Heavy freezing rain' },
  71: { icon: CloudSnow, desc: 'Slight snow fall' },
  73: { icon: CloudSnow, desc: 'Moderate snow fall' },
  75: { icon: CloudSnow, desc: 'Heavy snow fall' },
  77: { icon: CloudSnow, desc: 'Snow grains' },
  80: { icon: CloudRain, desc: 'Slight rain showers' },
  81: { icon: CloudRain, desc: 'Moderate rain showers' },
  82: { icon: CloudRain, desc: 'Violent rain showers' },
  85: { icon: CloudSnow, desc: 'Slight snow showers' },
  86: { icon: CloudSnow, desc: 'Heavy snow showers' },
  95: { icon: CloudLightning, desc: 'Thunderstorm' },
  96: { icon: CloudLightning, desc: 'Thunderstorm with slight hail' },
  99: { icon: CloudLightning, desc: 'Thunderstorm with heavy hail' },
};

export default function Weather() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Delhi, India');
  const [coordinates, setCoordinates] = useState({ lat: 28.61, lon: 77.23 });

  // Load language from localstorage (same as Advisory)
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('kisan_language') || 'en';
  });

  // Track if we have speaking active
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Field Logging and Sensor Inputs
  const [soilMoisture, setSoilMoisture] = useState<number>(35);
  const [isReadingSensor, setIsReadingSensor] = useState(false);
  const [sensorStatus, setSensorStatus] = useState<string>('idle');
  const [sensorSuccessMsg, setSensorSuccessMsg] = useState<string>('');

  // Localized string dictionary
  const T: Record<string, Record<string, string>> = {
    en: {
      title: "Weather & Advisory Alerts",
      subtitle: "7-day real-time forecast paired with ground sensor insights.",
      searchPlaceholder: "Search location (e.g., Punjab, India)",
      updateBtn: "Update",
      alertZones: "Alert Risk Zones",
      activeAlerts: "Active Advisory Alerts",
      groundSensors: "Ground Moisture Sensors Active",
      forecast7Day: "7-Day Weather Trend",
      howAlerts: "Choose Alert Delivery Mode",
      alertLanguage: "Alert Message Language",
      quietHours: "Quiet Hours (No SMS/Voice)",
      msgPreview: "Proactive Alert Preview",
      smsFallbackTitle: "Simulated SMS Alert Fallback (Feature Phones)",
      smsFallbackDesc: "Offline farmers with basic 2G feature phones receive this formatted alert automatically:",
      smsSentText: "Sent via SMS, WhatsApp",
      logFieldTitle: "Log Actual Field Conditions",
      logFieldSubtitle: "Refine satellite-derived parameters by entering your direct observations or connecting ground sensors.",
      soilMoistureLabel: "Observed Soil Moisture (%)",
      sensorBtn: "Simulate Bluetooth Sensor Scan",
      sensorIdle: "Ready to pair with LoRa field probe...",
      sensorScanning: "Connecting to probe via Bluetooth BLE...",
      sensorDone: "Connected! Soil probe returned live metrics.",
      applyBtn: "Apply Field Updates & Refine Advisory",
      listenBtn: "Listen to Alert",
      stopBtn: "Stop Listening",
      sourceForecast: "Source: Live Forecast",
      sourceSensor: "Source: Ground Sensor + Forecast",
      refinedAlertTitleDry: "Refined Advisory: Low Moisture Warning",
      refinedAlertDescDry: "No rain in forecast & soil moisture is dry at {val}%. ACTION Required: Apply light irrigation tonight.",
      refinedAlertTitleWet: "Refined Advisory: Skip Irrigation",
      refinedAlertDescWet: "Soil moisture is excellent at {val}%. You can safely SKIP today's irrigation cycle to conserve water.",
      refinedAlertTitleNormal: "Refined Advisory: Favorable Status",
      refinedAlertDescNormal: "Soil moisture is stable at {val}%. Maintain current schedules.",
    },
    hi: {
      title: "मौसम और सलाहकार चेतावनी",
      subtitle: "ग्राउंड सेंसर अंतर्दृष्टि के साथ वास्तविक समय का 7-दिवसीय पूर्वानुमान।",
      searchPlaceholder: "स्थान खोजें (उदा., पंजाब, भारत)",
      updateBtn: "अपडेट करें",
      alertZones: "चेतावनी जोखिम क्षेत्र",
      activeAlerts: "सक्रिय सलाहकार अलर्ट",
      groundSensors: "ग्राउंड नमी सेंसर सक्रिय",
      forecast7Day: "7-दिवसीय मौसम का रुख",
      howAlerts: "अलर्ट वितरण का तरीका चुनें",
      alertLanguage: "अलर्ट संदेश की भाषा",
      quietHours: "शांत समय (कोई एसएमएस/आवाज नहीं)",
      msgPreview: "सक्रिय अलर्ट पूर्वावलोकन",
      smsFallbackTitle: "सिम्युलेटेड एसएमएस अलर्ट फॉलबैक (साधारण फोन)",
      smsFallbackDesc: "साधारण 2जी फीचर फोन वाले ऑफलाइन किसानों को यह अनुकूलित संदेश मिलता है:",
      smsSentText: "एसएमएस, व्हाट्सएप द्वारा भेजा गया",
      logFieldTitle: "वास्तविक खेत की स्थिति दर्ज करें",
      logFieldSubtitle: "अपने प्रत्यक्ष अवलोकनों को दर्ज करके या सेंसर जोड़कर उपग्रह मापदंडों को संशोधित करें।",
      soilMoistureLabel: "देखी गई मिट्टी की नमी (%)",
      sensorBtn: "ब्लूटूथ सेंसर स्कैन सिम्युलेट करें",
      sensorIdle: "लोरा (LoRa) फील्ड प्रोब के साथ पेयर करने के लिए तैयार...",
      sensorScanning: "ब्लूटूथ बीएलई के माध्यम से प्रोब से जुड़ रहा है...",
      sensorDone: "कनेक्ट हो गया! सॉइल प्रोब ने लाइव रीडिंग दी।",
      applyBtn: "फ़ील्ड अपडेट लागू करें और परामर्श को बेहतर करें",
      listenBtn: "अलर्ट सुनें",
      stopBtn: "सुनना बंद करें",
      sourceForecast: "स्रोत: लाइव पूर्वानुमान",
      sourceSensor: "स्रोत: ग्राउंड सेंसर + पूर्वानुमान",
      refinedAlertTitleDry: "संशोधित सलाह: कम नमी की चेतावनी",
      refinedAlertDescDry: "मौसम पूर्वानुमान में बारिश नहीं है और मिट्टी की नमी {val}% पर सूखी है। कार्रवाई: आज रात हल्की सिंचाई करें।",
      refinedAlertTitleWet: "संशोधित सलाह: सिंचाई छोड़ें",
      refinedAlertDescWet: "मिट्टी की नमी {val}% पर उत्कृष्ट है। पानी बचाने के लिए आप आज की सिंचाई सुरक्षित रूप से छोड़ सकते हैं।",
      refinedAlertTitleNormal: "संशोधित सलाह: अनुकूल स्थिति",
      refinedAlertDescNormal: "मिट्टी की नमी {val}% पर स्थिर है। वर्तमान समय-सारिणी बनाए रखें।",
    },
    te: {
      title: "వాతావరణం & సలహా హెచ్చరికలు",
      subtitle: "నేల తేమ సెన్సార్లతో అనుసంధానించబడిన 7-రోజుల నిజ-సమయ వాతావరణ సూచన.",
      searchPlaceholder: "స్థానాన్ని శోధించండి (ఉదా., పంజాబ్, ఇండియా)",
      updateBtn: "నవీకరించు",
      alertZones: "హెచ్చరిక మండల ప్రమాదాలు",
      activeAlerts: "సక్రియ సలహా హెచ్చరికలు",
      groundSensors: "నేల తేమ సెన్సార్లు పనిచేస్తున్నాయి",
      forecast7Day: "7-రోజుల వాతావరణ ప్రవృత్తి",
      howAlerts: "సందేశాల పంపిణీ పద్ధతిని ఎంచుకోండి",
      alertLanguage: "హెచ్చరికల భాష",
      quietHours: "నిశ్శబ్ద గంటలు (SMS/వాయిస్ లేదు)",
      msgPreview: "ముందస్తు హెచ్చరిక పరిదృశ్యం",
      smsFallbackTitle: "SMS అలర్ట్ ఫాల్‌బ్యాక్ సిమ్యులేషన్ (సాధారణ మొబైల్స్)",
      smsFallbackDesc: "ఇంటర్నెట్ లేని రైతులు వారి సాధారణ ఫోన్లలో ఆటోమేటిక్ గా ఈ అలర్ట్ పొందుతారు:",
      smsSentText: "SMS, WhatsApp ద్వారా పంపబడింది",
      logFieldTitle: "వాస్తవ క్షేత్ర పరిస్థితులను నమోదు చేయండి",
      logFieldSubtitle: "మీ ప్రత్యక్ష పరిశీలనలను నమోదు చేయడం ద్వారా లేదా సెన్సార్లను కనెక్ట్ చేయడం ద్వారా సలహాలను మెరుగుపరచండి.",
      soilMoistureLabel: "నేల తేమ శాతం (%)",
      sensorBtn: "బ్లూటూత్ సెన్సార్ స్కానింగ్",
      sensorIdle: "ఫీల్డ్ ప్రోబ్‌తో కనెక్ట్ కావడానికి సిద్ధంగా ఉంది...",
      sensorScanning: "బ్లూటూత్ BLE ద్వారా ప్రోబ్‌కు కనెక్ట్ అవుతోంది...",
      sensorDone: "కనెక్ట్ అయింది! లైవ్ రీడింగ్ లభించింది.",
      applyBtn: "ఫీల్డ్ అప్‌డేట్స్ వర్తింపజేయి & సలహా సవరించు",
      listenBtn: "హెచ్చరిక వినండి",
      stopBtn: "ఆపివేయండి",
      sourceForecast: "మూలం: లైవ్ వాతావరణ సూచన",
      sourceSensor: "మూలం: గ్రౌండ్ సెన్సార్ + వాతావరణ సూచన",
      refinedAlertTitleDry: "సవరించిన సలహా: తక్కువ నేల తేమ హెచ్చరిక",
      refinedAlertDescDry: "వాతావరణంలో వర్షం లేదు మరియు నేల తేమ {val}% వద్ద చాలా తక్కువగా ఉంది. చర్య: ఈ రాత్రి తేలికపాటి తడులు ఇవ్వండి.",
      refinedAlertTitleWet: "సవరించిన సలహా: నీటి తడులు అవసరం లేదు",
      refinedAlertDescWet: "నేలలో తేమ {val}% వద్ద చాలా బాగుంది. నీటిని ఆదా చేయడానికి ఈ రోజు నీటి తడులు ఇవ్వడం సురక్షితంగా నిలిపివేయవచ్చు.",
      refinedAlertTitleNormal: "సవరించిన సలహా: అనుకూలమైన పరిస్థితి",
      refinedAlertDescNormal: "నేలలో తేమ {val}% వద్ద స్థిరంగా ఉంది. ప్రస్తుత షెడ్యూల్స్ అనుసరించండి.",
    },
    pa: {
      title: "ਮੌਸਮ ਅਤੇ ਸਲਾਹਕਾਰੀ ਅਲਰਟ",
      subtitle: "ਗਰਾਊਂਡ ਸੈਂਸਰਾਂ ਦੇ ਨਾਲ 7-ਦਿਨਾਂ ਦਾ ਅਸਲ-ਸਮੇਂ ਦਾ ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ।",
      searchPlaceholder: "ਸਥਾਨ ਖੋਜੋ (ਜਿਵੇਂ ਕਿ ਪੰਜਾਬ, ਭਾਰਤ)",
      updateBtn: "ਅਪਡੇਟ ਕਰੋ",
      alertZones: "ਖਤਰੇ ਵਾਲੇ ਅਲਰਟ ਜ਼ੋਨ",
      activeAlerts: "ਸਰਗਰਮ ਸਲਾਹਕਾਰੀ ਅਲਰਟ",
      groundSensors: "ਗਰਾਊਂਡ ਨਮੀ ਸੈਂਸਰ ਸਰਗਰਮ",
      forecast7Day: "7-ਦਿਨਾਂ ਦਾ ਮੌਸਮੀ ਰੁਝਾਨ",
      howAlerts: "ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰਨ ਦਾ ਤਰੀਕਾ ਚੁਣੋ",
      alertLanguage: "ਅਲਰਟ ਸੁਨੇਹੇ ਦੀ ਭਾਸ਼ਾ",
      quietHours: "ਸ਼ਾਂਤ ਘੰਟੇ (ਕੋਈ SMS/ਵੌਇਸ ਨਹੀਂ)",
      msgPreview: "ਅਲਰਟ ਪੂਰਵਦਰਸ਼ਨ",
      smsFallbackTitle: "ਐਸਐਮਐਸ ਅਲਰਟ ਫਾਲਬੈਕ (ਸਧਾਰਨ ਫੋਨ)",
      smsFallbackDesc: "ਬਿਨਾਂ ਇੰਟਰਨੈਟ ਵਾਲੇ ਕਿਸਾਨ ਆਪਣੇ ਸਧਾਰਨ ਫੋਨ 'ਤੇ ਆਪਣੇ ਆਪ ਇਹ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰਦੇ ਹਨ:",
      smsSentText: "SMS, WhatsApp ਰਾਹੀਂ ਭੇਜਿਆ ਗਿਆ",
      logFieldTitle: "ਖੇਤ ਦੀ ਅਸਲ ਸਥਿਤੀ ਦਰਜ ਕਰੋ",
      logFieldSubtitle: "ਆਪਣੇ ਖੁਦ ਦੇ ਨਿਰੀਖਣ ਜਾਂ ਸੈਂਸਰ ਜੋੜ ਕੇ ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਨੂੰ ਹੋਰ ਸਟੀਕ ਬਣਾਓ।",
      soilMoistureLabel: "ਮਿੱਟੀ ਦੀ ਨਮੀ (%)",
      sensorBtn: "ਬਲੂਟੁੱਥ ਸੈਂਸਰ ਸਕੈਨ ਸਿਮੂਲੇਟ ਕਰੋ",
      sensorIdle: "ਲੋਰਾ (LoRa) ਫੀਲਡ ਪ੍ਰੋਬ ਨਾਲ ਪੇਅਰ ਕਰਨ ਲਈ ਤਿਆਰ...",
      sensorScanning: "ਬਲੂਟੁੱਥ BLE ਰਾਹੀਂ ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
      sensorDone: "ਕਨੈਕਟ ਹੋ ਗਿਆ! ਸੈਂਸਰ ਨੇ ਅਸਲ ਰੀਡਿੰਗ ਵਾਪਸ ਭੇਜੀ।",
      applyBtn: "ਫੀਲਡ ਅਪਡੇਟ ਲਾਗੂ ਕਰੋ ਅਤੇ ਸਲਾਹ ਸੁਧਾਰੋ",
      listenBtn: "ਅਲਰਟ ਸੁਣੋ",
      stopBtn: "ਸੁਣਨਾ ਬੰਦ ਕਰੋ",
      sourceForecast: "ਸਰੋਤ: ਲਾਈਵ ਪੂਰਵ-ਅਨੁਮਾਨ",
      sourceSensor: "ਸਰੋਤ: ਗਰਾਊਂਡ ਸੈਂਸਰ + ਪੂਰਵ-ਅਨੁਮਾਨ",
      refinedAlertTitleDry: "ਸੋਧੀ ਹੋਈ ਸਲਾਹ: ਘੱਟ ਨਮੀ ਦੀ ਚੇਤਾਵਨੀ",
      refinedAlertDescDry: "ਮੀਂਹ ਦੀ ਕੋਈ ਸੰਭਾਵਨਾ ਨਹੀਂ ਹੈ ਅਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ {val}% 'ਤੇ ਸੁੱਕੀ ਹੈ। ਕਾਰਵਾਈ: ਅੱਜ ਰਾਤ ਹਲਕੀ ਸਿੰਚਾਈ ਕਰੋ।",
      refinedAlertTitleWet: "ਸੋਧੀ ਹੋਈ ਸਲਾਹ: ਸਿੰਚਾਈ ਛੱਡੋ",
      refinedAlertDescWet: "ਮਿੱਟੀ ਦੀ ਨਮੀ {val}% 'ਤੇ ਬਹੁਤ ਵਧੀਆ ਹੈ। ਪਾਣੀ ਬਚਾਉਣ ਲਈ ਤੁਸੀਂ ਅੱਜ ਸਿੰਚਾਈ ਨੂੰ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਛੱਡ ਸਕਦੇ ਹੋ।",
      refinedAlertTitleNormal: "ਸੋਧੀ ਹੋਈ ਸਲਾਹ: ਅਨੁਕੂਲ ਸਥਿਤੀ",
      refinedAlertDescNormal: "ਮਿੱਟੀ ਦੀ ਨਮੀ {val}% 'ਤੇ ਸਥਿਰ ਹੈ। ਮੌਜੂਦਾ ਸਮਾਂ-ਸਾਰਣੀ ਜਾਰੀ ਰੱਖੋ।",
    }
  };

  const labels = T[language] || T['en'];

  useEffect(() => {
    // Keep local language updated when toggled in localStorage
    const interval = setInterval(() => {
      const stored = localStorage.getItem('kisan_language') || 'en';
      if (stored !== language) {
        setLanguage(stored);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const [alertInfo, setAlertInfo] = useState({
    title: 'Analyzing weather...',
    desc: 'Waiting for latest forecast data.',
    level: 'INFO',
    color: 'text-[#6B7268] dark:text-[#9CA3AF]',
    bg: 'bg-[#6B7268]/10',
    source: ''
  });
  
  // Simulated sensor readout handler
  const handleSensorRead = () => {
    setIsReadingSensor(true);
    setSensorStatus('scanning');
    setSensorSuccessMsg('');
    setTimeout(() => {
      // simulate Bluetooth scanning and return a moisture code
      const generatedMoisture = Math.floor(Math.random() * 55) + 15; // 15% to 70%
      setSoilMoisture(generatedMoisture);
      setSensorStatus('done');
      setIsReadingSensor(false);
      setSensorSuccessMsg(`${labels.sensorDone} (${generatedMoisture}%)`);
    }, 1500);
  };

  // Text to speech voice playback for weather alerts
  const handleVoicePlay = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${alertInfo.title}. ${alertInfo.desc}`);
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'te') utterance.lang = 'te-IN';
        else if (language === 'pa') utterance.lang = 'pa-IN';
        else utterance.lang = 'en-IN';
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Speech synthesis is not supported in this browser.");
        setIsSpeaking(false);
      }
    }
  };

  const handleUpdateLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('kisan_language', lang);
  };

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
      const data = await res.json();
      
      if (data.daily) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const formattedForecast = data.daily.time.map((timeStr: string, index: number) => {
          const date = new Date(timeStr);
          const isToday = new Date().toDateString() === date.toDateString();
          const dayName = isToday ? 'Today' : days[date.getDay()];
          const code = data.daily.weathercode[index];
          const weatherInfo = WMO_CODES[code] || { icon: Sun, desc: 'Clear' };
          
          return {
            day: dayName,
            icon: weatherInfo.icon,
            temp: `${Math.round(data.daily.temperature_2m_max[index])}°`,
            min: `${Math.round(data.daily.temperature_2m_min[index])}°`,
            desc: weatherInfo.desc
          };
        });
        setForecast(formattedForecast);
        
        const todayCode = data.daily.weathercode[0];
        const tomorrowCode = data.daily.weathercode[1];
        
        // Formulate core alert based on Forecast and physical soil moisture sensor
        let newAlert = {
           title: 'Optimal Weather Conditions',
           desc: 'Weather is favorable for farming activities. Normal irrigation and spraying can proceed.',
           level: 'NORMAL',
           color: 'text-[#3C8B5C] dark:text-[#6EE7B7]',
           bg: 'bg-[#3C8B5C]/10',
           source: labels.sourceForecast
        };

        if ([95, 96, 99].includes(todayCode) || [95, 96, 99].includes(tomorrowCode)) {
             newAlert = {
                title: language === 'hi' ? 'आंधी-तूफान की चेतावनी' : language === 'te' ? 'పిడుగులతో కూడిన తుఫాను హెచ్చరిక' : language === 'pa' ? 'ਝੱਖੜ ਦੀ ਚੇਤਾਵਨੀ' : 'Thunderstorm Warning',
                desc: language === 'hi' ? 'तेज आंधी-तूफान की आशंका। ढीले उपकरणों को सुरक्षित करें और सुरक्षित स्थान पर शरण लें।' : language === 'te' ? 'ఉరుములు మెరుపులతో కూడిన తుఫాను వచ్చే అవకాశం ఉంది. పొలాల్లో పనులు నిలిపివేయండి.' : language === 'pa' ? 'ਤੇਜ਼ ਝੱਖੜ ਅਤੇ ਗਰਜ ਚਮਕ ਦੀ ਸੰਭਾਵਨਾ। ਖੁੱਲ੍ਹੇ ਖੇਤਾਂ ਵਿੱਚ ਕੰਮ ਕਰਨ ਤੋਂ ਬਚੋ।' : 'Thunderstorm expected. Secure any loose equipment and seek shelter. Avoid working in open fields.',
                level: 'CRITICAL',
                color: 'text-[#D95F4B] dark:text-[#F87171]',
                bg: 'bg-[#D95F4B]/10',
                source: labels.sourceForecast
            };
        } else if ([55, 63, 65, 73, 75, 81, 82].includes(todayCode) || [55, 63, 65, 73, 75, 81, 82].includes(tomorrowCode)) {
             newAlert = {
                title: language === 'hi' ? 'भारी बारिश की संभावना' : language === 'te' ? 'భారీ వర్షపాతం సూచన' : language === 'pa' ? 'ਭਾਰੀ ਮੀਂਹ ਦੀ ਚੇਤਾਵਨੀ' : 'Heavy Rainfall Expected',
                desc: language === 'hi' ? 'आपके क्षेत्र में महत्वपूर्ण वर्षा की संभावना है। जलभराव को रोकने के लिए खेतों में जल निकासी सुनिश्चित करें।' : language === 'te' ? 'పంట పొలాలలో నీరు నిల్వ ఉండకుండా తగిన మురుగునీటి కాల్వలు ఏర్పాటు చేయండి.' : language === 'pa' ? 'ਤੁਹਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਨਿਕਾਸੀ ਦਾ ਪ੍ਰਬੰਧ ਰੱਖੋ।' : 'Significant rainfall expected. Ensure proper drainage in fields to prevent waterlogging. Delay spraying.',
                level: 'WARNING',
                color: 'text-[#D95F4B] dark:text-[#F87171]',
                bg: 'bg-[#D95F4B]/10',
                source: labels.sourceForecast
            };
        } else {
          // No heavy rain / storm: we refine specifically using our logged ground moisture!
          if (soilMoisture < 30) {
            newAlert = {
              title: labels.refinedAlertTitleDry,
              desc: labels.refinedAlertDescDry.replace('{val}', soilMoisture.toString()),
              level: 'WARNING',
              color: 'text-[#E0A93A]',
              bg: 'bg-[#E0A93A]/10',
              source: labels.sourceSensor
            };
          } else if (soilMoisture > 65) {
            newAlert = {
              title: labels.refinedAlertTitleWet,
              desc: labels.refinedAlertDescWet.replace('{val}', soilMoisture.toString()),
              level: 'NORMAL',
              color: 'text-[#3C8B5C] dark:text-[#6EE7B7]',
              bg: 'bg-[#3C8B5C]/10',
              source: labels.sourceSensor
            };
          } else {
            newAlert = {
              title: labels.refinedAlertTitleNormal,
              desc: labels.refinedAlertDescNormal.replace('{val}', soilMoisture.toString()),
              level: 'NORMAL',
              color: 'text-[#3C8B5C] dark:text-[#6EE7B7]',
              bg: 'bg-[#3C8B5C]/5',
              source: labels.sourceSensor
            };
          }
        }
        setAlertInfo(newAlert);
      }
    } catch (error) {
      // Ignore network errors silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [coordinates, soilMoisture, language]);
  
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setCoordinates({ lat: data.results[0].latitude, lon: data.results[0].longitude });
      } else {
        alert("Location not found");
      }
    } catch (error) {
      // Ignore network errors silently
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Top Language Select Toolbar */}
      <div className="flex justify-end gap-2 mb-2">
        {[
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'हिन्दी' },
          { code: 'te', name: 'తెలుగు' },
          { code: 'pa', name: 'ਪੰਜਾਬੀ' }
        ].map(l => (
          <button
            key={l.code}
            onClick={() => handleUpdateLanguage(l.code)}
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

      <header>
        <h1 className="text-3xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">{labels.title}</h1>
        <p className="text-[#6B7268] dark:text-[#9CA3AF] mt-2">{labels.subtitle}</p>
      </header>
      
      {/* Location Search */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
        <form onSubmit={handleLocationSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7268] dark:text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder={labels.searchPlaceholder}
              className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] transition-colors dark:text-[#FAFAF7]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] px-6 py-3 rounded-xl font-medium hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors shrink-0"
          >
            {labels.updateBtn}
          </button>
        </form>
      </section>

      {/* Field Conditions Logger (Soil moisture, Sensors) */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
        <div className="flex items-center gap-2 mb-2">
          <Database className="text-[#3C8B5C] w-6 h-6 shrink-0" />
          <h2 className="text-lg font-bold text-[#1E2320] dark:text-[#FAFAF7]">{labels.logFieldTitle}</h2>
        </div>
        <p className="text-[#6B7268] dark:text-[#9CA3AF] text-sm mb-6">{labels.logFieldSubtitle}</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#1E2320] dark:text-[#FAFAF7]">
              {labels.soilMoistureLabel}: <span className="text-[#3C8B5C] font-bold">{soilMoisture}%</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
              className="w-full accent-[#3C8B5C]"
            />
            <div className="flex justify-between text-xs text-[#6B7268] dark:text-[#9CA3AF]">
              <span>Dry (10%)</span>
              <span>Medium (50%)</span>
              <span>Wet (90%)</span>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button 
              type="button"
              onClick={handleSensorRead}
              disabled={isReadingSensor}
              className="w-full py-3 border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl font-medium text-sm text-[#1E2320] dark:text-[#FAFAF7] hover:bg-[#3C8B5C]/5 transition-all flex items-center justify-center gap-2"
            >
              {isReadingSensor && (
                <div className="w-4 h-4 border-2 border-[#3C8B5C] border-t-transparent rounded-full animate-spin"></div>
              )}
              {labels.sensorBtn}
            </button>
            <p className="text-xs text-center text-[#6B7268] dark:text-[#9CA3AF] mt-2">
              {sensorStatus === 'idle' && labels.sensorIdle}
              {sensorStatus === 'scanning' && labels.sensorScanning}
              {sensorStatus === 'done' && sensorSuccessMsg}
            </p>
          </div>
        </div>

        <button
          onClick={fetchWeather}
          className="w-full mt-6 py-3 bg-[#1E2320] dark:bg-[#FAFAF7] text-white dark:text-[#1E2320] rounded-xl font-semibold hover:bg-[#2c332f] dark:hover:bg-[#E5E7EB] transition-colors"
        >
          {labels.applyBtn}
        </button>
      </section>

      {/* Map Placeholder */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
        <h2 className="text-lg font-semibold mb-4 text-[#1E2320] dark:text-[#FAFAF7]">{labels.alertZones}</h2>
        <div className="h-64 bg-[#FAFAF7] dark:bg-[#121212] rounded-xl flex items-center justify-center border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 relative overflow-hidden">
           <iframe 
              title="Weather Alert Map"
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              loading="lazy" 
              allowFullScreen 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
        </div>
      </section>

      {/* Active Alerts with Text to Speech */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between text-[#1E2320] dark:text-[#FAFAF7]">
           {labels.activeAlerts}
           <span className="text-xs font-normal text-[#6B7268] dark:text-[#9CA3AF] flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-[#3C8B5C] dark:bg-[#6EE7B7] animate-pulse"></span>
             {labels.groundSensors}
           </span>
        </h2>
        <div className="space-y-4">
          <div className={`${alertInfo.bg} border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-2xl p-5 flex gap-4 items-start shadow-sm`}>
            <div className="bg-white/50 dark:bg-black/20 p-3 rounded-full shrink-0">
              <AlertTriangle className={`w-6 h-6 ${alertInfo.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`${alertInfo.color} font-bold text-xs uppercase tracking-wider`}>{alertInfo.level}</span>
                  <span className="text-xs px-2 py-0.5 rounded border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 text-[#6B7268] dark:text-[#9CA3AF]">{alertInfo.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex text-xs px-2 py-0.5 rounded bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 text-[#6B7268] dark:text-[#9CA3AF] items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#3C8B5C] dark:bg-[#6EE7B7] rounded-full"></span> {labels.smsSentText}
                  </span>
                  {/* Speaker synthesize button */}
                  <button 
                    onClick={handleVoicePlay}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${isSpeaking ? 'bg-[#D95F4B] border-[#D95F4B] text-white animate-pulse' : 'bg-white dark:bg-[#1E1E1E] border-[#6B7268]/20 text-[#3C8B5C]'}`}
                  >
                    {isSpeaking ? labels.stopBtn : labels.listenBtn}
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#1E2320] dark:text-[#FAFAF7]">{alertInfo.title}</h3>
              <p className="text-[#6B7268] dark:text-[#9CA3AF] mt-1 text-sm leading-relaxed">{alertInfo.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offline SMS Fallback Simulation */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 !mt-[55px]">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="text-[#3C8B5C] w-6 h-6 shrink-0" />
          <h2 className="text-lg font-bold text-[#1E2320] dark:text-[#FAFAF7]">{labels.smsFallbackTitle}</h2>
        </div>
        <p className="text-[#6B7268] dark:text-[#9CA3AF] text-sm mb-4">{labels.smsFallbackDesc}</p>

        <div className="bg-[#121212] rounded-2xl p-4 max-w-sm mx-auto border border-[#FAFAF7]/10 shadow-lg text-white font-mono text-sm relative">
          <div className="flex justify-between items-center pb-2 mb-3 border-b border-white/10 text-xs text-gray-400">
            <span>Sender: KISAN_ADVISORY</span>
            <span>Now</span>
          </div>
          <div className="space-y-2">
            <p className="text-[#6EE7B7] font-bold">⚠️ KISAN ALERT [{alertInfo.level}]</p>
            <p className="text-gray-200">
              {alertInfo.title.toUpperCase()}
            </p>
            <p className="text-gray-300 text-xs whitespace-pre-wrap leading-relaxed">
              {alertInfo.desc}
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-gray-500 flex justify-between">
            <span>*99# SMS Portal Fallback Active</span>
            <span>No Data Required</span>
          </div>
        </div>
      </section>

      {/* 7 Day Forecast */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[#1E2320] dark:text-[#FAFAF7]">{labels.forecast7Day}</h2>
        {loading ? (
          <div className="flex items-center justify-center p-8 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C8B5C] dark:border-[#6EE7B7]"></div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {forecast.map((day, i) => {
              const Icon = day.icon;
              return (
                <div key={i} className={`shrink-0 snap-start w-32 flex flex-col items-center p-4 rounded-2xl border ${i === 0 ? 'border-[#3C8B5C] dark:border-[#6EE7B7] bg-[#3C8B5C]/5 dark:bg-[#6EE7B7]/10' : 'border-[#6B7268]/10 dark:border-[#FAFAF7]/10 bg-white dark:bg-[#1E1E1E]'} shadow-sm`}>
                  <span className="text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF]">{day.day}</span>
                  <Icon className={`w-8 h-8 my-3 ${i === 2 || i === 3 ? 'text-blue-500' : 'text-[#E0A93A]'}`} />
                  <span className="text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">{day.temp}</span>
                  <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF]">{day.min}</span>
                  <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF] mt-2 text-center line-clamp-2" title={day.desc}>{day.desc}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
      {/* Alert Delivery Settings */}
      <section className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-sm border border-[#6B7268]/10 dark:border-[#FAFAF7]/10">
        <h2 className="text-lg font-semibold mb-6 text-[#1E2320] dark:text-[#FAFAF7]">{labels.howAlerts}</h2>
        
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="flex items-start gap-3 p-4 border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl bg-[#FAFAF7] dark:bg-[#121212] cursor-pointer hover:border-[#3C8B5C] dark:hover:border-[#6EE7B7] transition-colors">
              <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-[#3C8B5C] dark:text-[#6EE7B7] focus:ring-[#3C8B5C] dark:focus:ring-[#6EE7B7] rounded border-[#6B7268]/30 dark:border-[#FAFAF7]/30" />
              <div>
                <span className="block font-medium text-[#1E2320] dark:text-[#FAFAF7]">SMS</span>
                <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF]">Standard text message</span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border border-[#3C8B5C] dark:border-[#6EE7B7] rounded-xl bg-[#3C8B5C]/5 dark:bg-[#6EE7B7]/10 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-[#3C8B5C] dark:text-[#6EE7B7] focus:ring-[#3C8B5C] dark:focus:ring-[#6EE7B7] rounded border-[#6B7268]/30 dark:border-[#FAFAF7]/30" />
              <div>
                <span className="block font-medium text-[#1E2320] dark:text-[#FAFAF7]">WhatsApp</span>
                <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF]">Rich text with images</span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl bg-[#FAFAF7] dark:bg-[#121212] cursor-pointer hover:border-[#3C8B5C] dark:hover:border-[#6EE7B7] transition-colors">
              <input type="checkbox" className="mt-1 w-4 h-4 text-[#3C8B5C] dark:text-[#6EE7B7] focus:ring-[#3C8B5C] dark:focus:ring-[#6EE7B7] rounded border-[#6B7268]/30 dark:border-[#FAFAF7]/30" />
              <div>
                <span className="block font-medium text-[#1E2320] dark:text-[#FAFAF7]">Voice Call</span>
                <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF]">Automated phone call</span>
              </div>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-2">{labels.alertLanguage}</label>
              <select 
                value={language}
                onChange={(e) => handleUpdateLanguage(e.target.value)}
                className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] mb-2">{labels.quietHours}</label>
              <div className="flex items-center gap-2">
                <input type="time" defaultValue="21:00" className="flex-1 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]" />
                <span className="text-[#6B7268] dark:text-[#9CA3AF]">to</span>
                <input type="time" defaultValue="06:00" className="flex-1 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7]" />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-xl bg-[#FAFAF7] dark:bg-[#121212]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#1E2320] dark:text-[#FAFAF7] text-sm">{labels.msgPreview}</h4>
              <button onClick={handleVoicePlay} className="text-xs font-semibold text-[#3C8B5C] dark:text-[#6EE7B7] hover:underline">{labels.voicePreview}</button>
            </div>
            <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] italic">"{alertInfo.desc}"</p>
          </div>
        </div>
      </section>

    </div>
  );
}
