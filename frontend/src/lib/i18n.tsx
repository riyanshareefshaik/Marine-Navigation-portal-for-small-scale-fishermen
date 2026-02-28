"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi" | "ta" | "te" | "ml" | "bn" | "mr" | "gu" | "or" | "kn";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        "nav.home": "Home",
        "nav.history": "History",
        "nav.map": "Map",
        "nav.profile": "Profile",
        "status.SAFE TO GO": "SAFE TO GO",
        "status.DO NOT GO": "DO NOT GO",
        "status.Caution": "CAUTION",
        "advisory.safe": "Sea conditions are safe for fishing. Stay alert and follow standard safety protocols.",
        "metrics.waveHeight": "Wave Height",
        "metrics.windSpeed": "Wind Speed",
        "metrics.seaTemp": "Sea Temperature",
        "metrics.visibility": "Visibility",
        "metrics.windDir": "Wind Dir",
        "metrics.waveDir": "Wave Flow Dir",
        "metrics.realtime": "Real-time Oceanic Data",
        "forecast.title": "24-Hour Forecast",
        
        "trend.title": "7-Day Trend",
        "trend.safeThresholds": "Safe Thresholds",
        "trend.waveThreshold": "Wave Height < 2m",
        "trend.windThreshold": "Wind Speed < 35 km/h",
        "trend.visThreshold": "Visibility > 3 nm",
        "refresh": "Refresh",
        "lastUpdated": "Last Updated:"
    },
    hi: {
        "nav.home": "होम",
        "nav.history": "इतिहास",
        "nav.map": "नक्शा",
        "nav.profile": "प्रोफ़ाइल",
        "status.SAFE TO GO": "जाने के लिए सुरक्षित",
        "status.DO NOT GO": "मत जाओ",
        "status.Caution": "सावधान",
        "advisory.safe": "समुद्र की स्थिति मछली पकड़ने के लिए सुरक्षित है। सतर्क रहें और सुरक्षा प्रोटोकॉल का पालन करें।",
        "metrics.waveHeight": "लहर की ऊंचाई",
        "metrics.windSpeed": "हवा की गति",
        "metrics.seaTemp": "समुद्र का तापमान",
        "metrics.visibility": "दृश्यता",
        "metrics.windDir": "हवा की दिशा",
        "metrics.waveDir": "लहर प्रवाह की दिशा",
        "metrics.realtime": "रीयल-टाइम महासागरीय डेटा",
        "forecast.title": "24 घंटे का पूर्वानुमान",
        
        "trend.title": "7-दिन का रुझान",
        "trend.safeThresholds": "सुरक्षित सीमा",
        "trend.waveThreshold": "लहर की ऊंचाई < 2 मी",
        "trend.windThreshold": "हवा की गति < 35 किमी/घंटा",
        "trend.visThreshold": "दृश्यता > 3 एनएम",
        "refresh": "रीफ़्रेश",
        "lastUpdated": "अंतिम अपडेट:"
    },
    ta: {
        "nav.home": "முகப்பு",
        "nav.history": "வரலாறு",
        "nav.map": "வரைபடம்",
        "nav.profile": "சுயவிவரம்",
        "status.SAFE TO GO": "பயணம் பாதுகாப்பானது",
        "status.DO NOT GO": "செல்ல வேண்டாம்",
        "status.Caution": "எச்சரிக்கை",
        "advisory.safe": "மீன்பிடிக்க கடலின் நிலை பாதுகாப்பானது. விழிப்புடன் இருங்கள் மற்றும் பாதுகாப்பு நெறிமுறைகளைப் பின்பற்றவும்.",
        "metrics.waveHeight": "அலை உயரம்",
        "metrics.windSpeed": "காற்றின் வேகம்",
        "metrics.seaTemp": "கடல் வெப்பநிலை",
        "metrics.visibility": "காணும்திறன்",
        "metrics.windDir": "காற்றின் திசை",
        "metrics.waveDir": "அலை ஓட்டம் திசை",
        "metrics.realtime": "நிகழ்நேர கடல் தரவு",
        "forecast.title": "24 மணிநேர முன்னறிவிப்பு",
        
        "trend.title": "7 நாள் போக்கு",
        "trend.safeThresholds": "பாதுகாப்பான வரம்புகள்",
        "trend.waveThreshold": "அலை உயரம் < 2மீ",
        "trend.windThreshold": "காற்றின் வேகம் < 35 கிமீ/ம",
        "trend.visThreshold": "காணும்திறன் > 3 நா.மை",
        "refresh": "புதுப்பி",
        "lastUpdated": "கடைசியாக புதுப்பிக்கப்பட்டது:"
    },
    te: {
        "nav.home": "హోమ్",
        "nav.history": "చరిత్ర",
        "nav.map": "మ్యాప్",
        "nav.profile": "ప్రొఫైల్",
        "status.SAFE TO GO": "వెళ్ళడం సురక్షితం",
        "status.DO NOT GO": "వెళ్లవద్దు",
        "status.Caution": "జాగ్రత్త",
        "advisory.safe": "చేపలు పట్టడానికి సముద్ర పరిస్థితులు సురక్షితం. అప్రమత్తంగా ఉండండి మరియు భద్రతా ప్రోటోకాల్‌లను అనుసరించండి.",
        "metrics.waveHeight": "అలల ఎత్తు",
        "metrics.windSpeed": "గాలి వేగం",
        "metrics.seaTemp": "సముద్ర ఉష్ణోగ్రత",
        "metrics.visibility": "దృశ్యమానత",
        "metrics.windDir": "గాలి దిశ",
        "metrics.waveDir": "వేవ్ ఫ్లో దిశ",
        "metrics.realtime": "రియల్ టైమ్ ఓషియానిక్ డేటా",
        "forecast.title": "24 గంటల సూచన",
        
        "trend.title": "7 రోజుల ట్రెండ్",
        "trend.safeThresholds": "సురక్షిత పరిమితులు",
        "trend.waveThreshold": "అలల ఎత్తు < 2మీ",
        "trend.windThreshold": "గాలి వేగం < 35 కిమీ/గం",
        "trend.visThreshold": "దృశ్యమానత > 3 ఎన్ఎమ్",
        "refresh": "రిఫ్రెష్",
        "lastUpdated": "చివరిగా అప్‌డేట్ చేయబడినది:"
    },
    ml: {
        "nav.home": "ഹോം",
        "nav.history": "ചരിത്രം",
        "nav.map": "മാപ്പ്",
        "nav.profile": "പ്രൊഫൈൽ",
        "status.SAFE TO GO": "പോകാൻ സുരക്ഷിതം",
        "status.DO NOT GO": "പോകരുത്",
        "status.Caution": "ജാഗ്രത",
        "advisory.safe": "മത്സ്യബന്ധനത്തിന് കടൽ സുരക്ഷിതമാണ്. ജാഗ്രത പാലിക്കുക, സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ പിന്തുടരുക.",
        "metrics.waveHeight": "തിരമാലയുടെ ഉയരം",
        "metrics.windSpeed": "കാറ്റിന്റെ വേഗം",
        "metrics.seaTemp": "കടൽ താപനില",
        "metrics.visibility": "കാഴ്ചാപരിധി",
        "metrics.windDir": "കാറ്റിന്റെ ദിശ",
        "metrics.waveDir": "തിരമാലയുടെ ദിശ",
        "metrics.realtime": "തത്സമയ സമുദ്ര ഡാറ്റ",
        "forecast.title": "24 മണിക്കൂർ പ്രവചനം",
        
        "trend.title": "7 ദിവസത്തെ പ്രവണത",
        "trend.safeThresholds": "സുരക്ഷിത പരിധികൾ",
        "trend.waveThreshold": "തിരമാല ഉയരം < 2മീ",
        "trend.windThreshold": "കാറ്റിന്റെ വേഗം < 35 കി.മീ/മ.",
        "trend.visThreshold": "കാഴ്ചാപരിധി > 3 നോ.മൈ",
        "refresh": "പുതുക്കുക",
        "lastUpdated": "അവസാനം അപ്ഡേറ്റ് ചെയ്തത്:"
    },
    bn: {
        "nav.home": "বাড়ি",
        "nav.history": "ইতিহাস",
        "nav.map": "মানচিত্র",
        "nav.profile": "প্রোফাইল",
        "status.SAFE TO GO": "যাওয়া নিরাপদ",
        "status.DO NOT GO": "যাবেন না",
        "status.Caution": "সতর্কতা",
        "advisory.safe": "সমুদ্রের পরিস্থিতি মাছ ধরার জন্য নিরাপদ। সতর্ক থাকুন এবং নিরাপত্তা প্রোটোকল অনুসরণ করুন।",
        "metrics.waveHeight": "ঢেউয়ের উচ্চতা",
        "metrics.windSpeed": "বাতাসের গতি",
        "metrics.seaTemp": "সমুদ্রের তাপমাত্রা",
        "metrics.visibility": "দৃশ্যমানতা",
        "metrics.windDir": "বাতাসের দিক",
        "metrics.waveDir": "ঢেউ প্রবাহের দিক",
        "metrics.realtime": "রিয়েল-টাইম মহাসাগরীয় ডেটা",
        "forecast.title": "২৪ ঘণ্টার পূর্বাভাস",
        
        "trend.title": "৭ দিনের প্রবণতা",
        "trend.safeThresholds": "নিরাপদ সীমা",
        "trend.waveThreshold": "ঢেউয়ের উচ্চতা < 2মি",
        "trend.windThreshold": "বাতাসের গতি < 35 কিমি/ঘণ্টা",
        "trend.visThreshold": "দৃশ্যমানতা > 3 নটিক্যাল মাইল",
        "refresh": "রিফ্রেশ",
        "lastUpdated": "সর্বশেষ আপডেট:"
    },
    mr: {
        "nav.home": "मुख्यपृष्ठ",
        "nav.history": "इतिहास",
        "nav.map": "नकाशा",
        "nav.profile": "प्रोफाइल",
        "status.SAFE TO GO": "जाण्यास सुरक्षित",
        "status.DO NOT GO": "जाऊ नका",
        "status.Caution": "सावधान",
        "advisory.safe": "मासेमारीसाठी समुद्र सुरक्षित आहे. सतर्क राहा आणि सुरक्षा नियमांचे पालन करा.",
        "metrics.waveHeight": "लाटेची उंची",
        "metrics.windSpeed": "वाऱ्याचा वेग",
        "metrics.seaTemp": "समुद्राचे तापमान",
        "metrics.visibility": "दृश्यमानता",
        "metrics.windDir": "वाऱ्याची दिशा",
        "metrics.waveDir": "लाटेचा प्रवाह दिशा",
        "metrics.realtime": "रीअल-टाइम सागरी डेटा",
        "forecast.title": "24-तासांचा अंदाज",
        
        "trend.title": "7-दिवसांचा ट्रेंड",
        "trend.safeThresholds": "सुरक्षित मर्यादा",
        "trend.waveThreshold": "लाटेची उंची < 2 मी",
        "trend.windThreshold": "वाऱ्याचा वेग < 35 किमी/तास",
        "trend.visThreshold": "दृश्यमानता > 3 एनएम",
        "refresh": "रिफ्रेश",
        "lastUpdated": "शेवटचे अपडेट:"
    },
    gu: {
        "nav.home": "હોમ",
        "nav.history": "ઇતિહાસ",
        "nav.map": "નકશો",
        "nav.profile": "પ્રોફાઇલ",
        "status.SAFE TO GO": "જવા માટે સુરક્ષિત",
        "status.DO NOT GO": "જશો નહીં",
        "status.Caution": "સાવધાની",
        "advisory.safe": "માછીમારી માટે સમુદ્ર સુરક્ષિત છે. સતર્ક રહો અને સુરક્ષા પ્રોટોકોલનું પાલન કરો.",
        "metrics.waveHeight": "મોજાની ઊંચાઈ",
        "metrics.windSpeed": "પવનની ગતિ",
        "metrics.seaTemp": "સમુદ્રનું તાપમાન",
        "metrics.visibility": "દૃશ્યતા",
        "metrics.windDir": "પવનની દિશા",
        "metrics.waveDir": "મોજાના પ્રવાહની દિશા",
        "metrics.realtime": "રીઅલ-ટાઇમ ઓશનિક ડેટા",
        "forecast.title": "24-કલાકની આગાહી",
        
        "trend.title": "7-દિવસનો ટ્રેન્ડ",
        "trend.safeThresholds": "સુરક્ષિત મર્યાદા",
        "trend.waveThreshold": "મોજાની ઊંચાઈ < 2મી",
        "trend.windThreshold": "પવનની ગતિ < 35 કિમી/કલાક",
        "trend.visThreshold": "દૃશ્યતા > 3 એનએમ",
        "refresh": "રીફ્રેશ",
        "lastUpdated": "છેલ્લે અપડેટ:"
    },
    or: {
        "nav.home": "ମୂଳପୃଷ୍ଠା",
        "nav.history": "ଇତିହାସ",
        "nav.map": "ମାନଚିତ୍ର",
        "nav.profile": "ପ୍ରୋଫାଇଲ୍",
        "status.SAFE TO GO": "ଯିବାକୁ ସୁରକ୍ଷିତ",
        "status.DO NOT GO": "ଯାଆନ୍ତୁ ନାହିଁ",
        "status.Caution": "ସତର୍କତା",
        "advisory.safe": "ମାଛ ଧରିବା ପାଇଁ ସମୁଦ୍ର ଅବସ୍ଥା ସୁରକ୍ଷିତ। ସତର୍କ ରୁହନ୍ତୁ ଏବଂ ସୁରକ୍ଷା ନିୟମାବଳୀ ଅନୁସରଣ କରନ୍ତୁ।",
        "metrics.waveHeight": "ଲହରୀ ଉଚ୍ଚତା",
        "metrics.windSpeed": "ପବନର ବେଗ",
        "metrics.seaTemp": "ସମୁଦ୍ର ତାପମାତ୍ରା",
        "metrics.visibility": "ଦୃଶ୍ୟମାନତା",
        "metrics.windDir": "ପବନର ଦିଗ",
        "metrics.waveDir": "ଲହରୀ ପ୍ରବାହ ଦିଗ",
        "metrics.realtime": "ରିଅଲ-ଟାଇମ୍ ସାମୁଦ୍ରିକ ତଥ୍ୟ",
        "forecast.title": "24-ଘଣ୍ଟା ପୂର୍ବାନୁମାନ",
        
        "trend.title": "7-ଦିନର ଟ୍ରେଣ୍ଡ",
        "trend.safeThresholds": "ସୁରକ୍ଷିତ ସୀମା",
        "trend.waveThreshold": "ଲହରୀ ଉଚ୍ଚତା < 2ମି",
        "trend.windThreshold": "ପବନର ବେଗ < 35 କିମି/ଘଣ୍ଟା",
        "trend.visThreshold": "ଦୃଶ୍ୟମାନତା > 3 ଏନଏମ",
        "refresh": "ରିଫ୍ରେସ",
        "lastUpdated": "ଶେଷ ଅପଡେଟ୍:"
    },
    kn: {
        "nav.home": "ಮುಖಪುಟ",
        "nav.history": "ಇತಿಹಾಸ",
        "nav.map": "ನಕ್ಷೆ",
        "nav.profile": "ಪ್ರೊಫೈಲ್",
        "status.SAFE TO GO": "ಹೋಗಲು ಸುರಕ್ಷಿತ",
        "status.DO NOT GO": "ಹೋಗಬೇಡಿ",
        "status.Caution": "ಎಚ್ಚರಿಕೆ",
        "advisory.safe": "ಮೀನುಗಾರಿಕೆಗೆ ಸಮುದ್ರ ಸ್ಥಿತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ. ಎಚ್ಚರದಿಂದಿರಿ ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ.",
        "metrics.waveHeight": "ಅಲೆಯ ಎತ್ತರ",
        "metrics.windSpeed": "ಗಾಳಿಯ ವೇಗ",
        "metrics.seaTemp": "ಸಮುದ್ರದ ಉಷ್ಣತೆ",
        "metrics.visibility": "ಗೋಚರತೆ",
        "metrics.windDir": "ಗಾಳಿಯ ದಿಕ್ಕು",
        "metrics.waveDir": "ಅಲೆಯ ಹರಿವಿನ ದಿಕ್ಕು",
        "metrics.realtime": "ರಿಯಲ್-ಟೈಮ್ ಸಮುದ್ರ ಡೇಟಾ",
        "forecast.title": "24-ಗಂಟೆಯ ಮುನ್ಸೂಚನೆ",
        
        "trend.title": "7-ದಿನಗಳ ಪ್ರವೃತ್ತಿ",
        "trend.safeThresholds": "ಸುರಕ್ಷಿತ ಮಿತಿಗಳು",
        "trend.waveThreshold": "ಅಲೆಯ ಎತ್ತರ < 2ಮೀ",
        "trend.windThreshold": "ಗಾಳಿಯ ವೇಗ < 35 ಕಿಮೀ/ಗಂ",
        "trend.visThreshold": "ಗೋಚರತೆ > 3 ಎನ್‌ಎಂ",
        "refresh": "ರಿಫ್ರೆಶ್",
        "lastUpdated": "ಕೊನೆಯ ಅಪ್‌ಡೇಟ್:"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    // Load language from localStorage if possible
    React.useEffect(() => {
        const saved = localStorage.getItem("preferred-language") as Language;
        if (saved && translations[saved]) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("preferred-language", lang);
    };

    const t = (key: string): string => {
        return translations[language]?.[key] || translations["en"]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
