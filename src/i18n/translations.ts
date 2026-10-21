import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  roleFarmer: string;
  roleBuyer: string;
  roleSupplier: string;
  roleAdmin: string;
  navDashboard: string;
  navFarmPlots: string;
  navCropCalendar: string;
  navMarketplace: string;
  navInputCredit: string;
  navProduceMarket: string;
  navProfitLoss: string;
  navGovtSchemes: string;
  navLivestock: string;
  navIoTSensors: string;
  navControlTower: string;
  navAdmin: string;
  navAIAssistant: string;
  welcomeFarmer: string;
  totalLand: string;
  activePlots: string;
  todaysTasks: string;
  weatherSummary: string;
  materialOrders: string;
  creditStatus: string;
  buyerOffers: string;
  estimatedProfit: string;
  askSaathiAI: string;
  acres: string;
  quintals: string;
  rupees: string;
  demoDisclaimer: string;
  simulatedData: string;
  switchRole: string;
  resetDemoData: string;
  organic: string;
  conventional: string;
  searchPlaceholder: string;
  addToCart: string;
  viewDetails: string;
  checkout: string;
  applyForCredit: string;
  listProduce: string;
  submitOffer: string;
  accept: string;
  reject: string;
  disruptionAlert: string;
  recoveryPlan: string;
  speechListening: string;
  speechSpeak: string;
  disclaimerMedicalLegal: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'Farmer Saathi',
    tagline: 'From Soil to Sale, We Stand With Every Farmer',
    roleFarmer: 'Farmer',
    roleBuyer: 'Produce Buyer',
    roleSupplier: 'Agri Supplier',
    roleAdmin: 'Supply Tower Admin',
    navDashboard: 'Farmer Dashboard',
    navFarmPlots: 'Farm & Land Management',
    navCropCalendar: 'Crop Calendar & Care',
    navMarketplace: 'Agri Inputs Marketplace',
    navInputCredit: 'Input Credit & Repayment',
    navProduceMarket: 'Farmer-to-Buyer Market',
    navProfitLoss: 'Profit & Loss Calculator',
    navGovtSchemes: 'Govt MSP & Schemes',
    navLivestock: 'Livestock & Feed',
    navIoTSensors: 'Smart Farm IoT Sensors',
    navControlTower: 'Supply Chain Tower',
    navAdmin: 'Admin Oversight',
    navAIAssistant: 'Farmer Saathi AI',
    welcomeFarmer: 'Welcome back,',
    totalLand: 'Total Farm Land',
    activePlots: 'Active Plots',
    todaysTasks: "Today's Farm Tasks",
    weatherSummary: 'Mandya Weather & Advisory',
    materialOrders: 'Input Material Orders',
    creditStatus: 'Input Credit Facility',
    buyerOffers: 'Active Buyer Bids',
    estimatedProfit: 'Season Net Profit (Est.)',
    askSaathiAI: 'Ask Farmer Saathi AI',
    acres: 'Acres',
    quintals: 'Quintals',
    rupees: '₹',
    demoDisclaimer: 'Hackathon Prototype: Simulated demonstration data and workflows for Indian agriculture.',
    simulatedData: 'Simulated Demo Data',
    switchRole: 'Switch Role / Persona',
    resetDemoData: 'Reset Demo State',
    organic: 'Organic',
    conventional: 'Conventional',
    searchPlaceholder: 'Search crops, inputs, suppliers or mandi rates...',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    checkout: 'Proceed to Checkout',
    applyForCredit: 'Apply for Input Credit',
    listProduce: 'List Harvested Produce',
    submitOffer: 'Submit Buyer Offer',
    accept: 'Accept Offer',
    reject: 'Decline Offer',
    disruptionAlert: 'Supply Chain Disruption Detected',
    recoveryPlan: 'Generate Recovery Plan',
    speechListening: 'Listening to your voice...',
    speechSpeak: 'Read Aloud',
    disclaimerMedicalLegal: 'Educational agricultural guidance. Please consult local Krishi Vigyan Kendra (KVK) officers for critical chemical interventions.',
  },
  kn: {
    appName: 'ರೈತ ಸಾಥಿ (Farmer Saathi)',
    tagline: 'ಮಣ್ಣಿನಿಂದ ಮಾರುಕಟ್ಟೆಯವರೆಗೆ, ಪ್ರತಿಯೊಬ್ಬ ರೈತನ ಜೊತೆ ನಾವು.',
    roleFarmer: 'ರೈತರು (Farmer)',
    roleBuyer: 'ಖರೀದಿದಾರರು (Buyer)',
    roleSupplier: 'ಕೃಷಿ ಸರಬರಾಜುದಾರರು (Supplier)',
    roleAdmin: 'ನಿಯಂತ್ರಣ ಗೋಪುರ (Admin)',
    navDashboard: 'ರೈತ ಮುಖಪುಟ',
    navFarmPlots: 'ಜಮೀನು ಮತ್ತು ಪ್ಲಾಟ್‌ಗಳು',
    navCropCalendar: 'ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್ ಮತ್ತು ಪೋಷಣೆ',
    navMarketplace: 'ಕೃಷಿ ಪರಿಕರಗಳ ಮಾರುಕಟ್ಟೆ',
    navInputCredit: 'ಬೆಳೆ ಸಾಲ ಮತ್ತು ಮರುಪಾವತಿ',
    navProduceMarket: 'ಬೆಳೆ ಮಾರಾಟ ಮತ್ತು ಬಿಡ್ಡಿಂಗ್',
    navProfitLoss: 'ಲಾಭ-ನಷ್ಟ ಲೆಕ್ಕಾಚಾರ',
    navGovtSchemes: 'ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ & ಯೋಜನೆಗಳು',
    navLivestock: 'ಜಾನುವಾರು & ಮೇವು',
    navIoTSensors: 'ಸ್ಮಾರ್ಟ್ ಮಣ್ಣಿನ ಸಂವೇದಕಗಳು (IoT)',
    navControlTower: 'ಸರಬರಾಜು ನಿಯಂತ್ರಣ ಗೋಪುರ',
    navAdmin: 'ನಿರ್ವಾಹಕ ಪುಟ',
    navAIAssistant: 'ರೈತ ಸಾಥಿ AI ಸಹಾಯಕ',
    welcomeFarmer: 'ನಮಸ್ಕಾರ,',
    totalLand: 'ಒಟ್ಟು ಕೃಷಿ ಭೂಮಿ',
    activePlots: 'ಸಕ್ರಿಯ ಪ್ಲಾಟ್‌ಗಳು',
    todaysTasks: 'ಇಂದಿನ ಕೃಷಿ ಕೆಲಸಗಳು',
    weatherSummary: 'ಮಂಡ್ಯ ಹವಾಮಾನ ಮತ್ತು ಮುನ್ಸೂಚನೆ',
    materialOrders: 'ರಸಗೊಬ್ಬರ/ಬೀಜಗಳ ಆರ್ಡರ್',
    creditStatus: 'ಕೃಷಿ ಪರಿಕರ ಸಾಲ ಸ್ಥಿತಿ',
    buyerOffers: 'ಖರೀದಿದಾರರ ಬಿಡ್‌ಗಳು',
    estimatedProfit: 'ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ',
    askSaathiAI: 'AI ಕೃಷಿ ಸಲಹೆ ಕೇಳಿ',
    acres: 'ಎಕರೆ',
    quintals: 'ಕ್ವಿಂಟಾಲ್',
    rupees: '₹',
    demoDisclaimer: 'ಹ್ಯಾಕಥಾನ್ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ: ಭಾರತೀಯ ಕೃಷಿಗಾಗಿ ರೂಪಿಸಲಾದ ಡೆಮೊ ವ್ಯವಸ್ಥೆ.',
    simulatedData: 'ಡೆಮೊ ಅನುಕರಣೆ ಮಾಹಿತಿ',
    switchRole: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    resetDemoData: 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ',
    organic: 'ಸಾವಯವ',
    conventional: 'ಸಾಂಪ್ರದಾಯಿಕ',
    searchPlaceholder: 'ಬೆಳೆಗಳು, ರಸಗೊಬ್ಬರ, ಮಂಡಿ ಬೆಲೆ ಹುಡುಕಿ...',
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    viewDetails: 'ವಿವರ ನೋಡಿ',
    checkout: 'ಆರ್ಡರ್ ಮುಂದುವರಿಸಿ',
    applyForCredit: 'ಕೃಷಿ ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    listProduce: 'ಬೆಳೆ ಮಾರಾಟಕ್ಕೆ ಇಡಿ',
    submitOffer: 'ಖರೀದಿ ಬಿಡ್ ಸಲ್ಲಿಸಿ',
    accept: 'ಒಪ್ಪಿಕೊಳ್ಳಿ',
    reject: 'ತಿರಸ್ಕರಿಸಿ',
    disruptionAlert: 'ಸರಬರಾಜು ಅಡಚಣೆ ಪತ್ತೆಯಾಗಿದೆ',
    recoveryPlan: 'ಪರಿಹಾರ ಯೋಜನೆ ತಯಾರಿಸಿ',
    speechListening: 'ಧ್ವನಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    speechSpeak: 'ಓದಿ ಹೇಳಿ',
    disclaimerMedicalLegal: 'ಶೈಕ್ಷಣಿಕ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ. ಗಂಭೀರ ರೋಗಗಳಿಗೆ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  },
  hi: {
    appName: 'किसान साथी (Farmer Saathi)',
    tagline: 'मिट्टी से मंडी तक, हर किसान के साथ।',
    roleFarmer: 'किसान (Farmer)',
    roleBuyer: 'खरीदार (Buyer)',
    roleSupplier: 'कृषि आपूर्तिकर्ता (Supplier)',
    roleAdmin: 'सप्लाई कंट्रोल टावर (Admin)',
    navDashboard: 'किसान डैशबोर्ड',
    navFarmPlots: 'खेत और भूमि प्रबंधन',
    navCropCalendar: 'फसल कैलेंडर और देखभाल',
    navMarketplace: 'कृषि सामग्री बाजार',
    navInputCredit: 'इनपुट क्रेडिट और भुगतान',
    navProduceMarket: 'फसल बिक्री और खरीदार',
    navProfitLoss: 'लाभ-हानि कैलकुलेटर',
    navGovtSchemes: 'एमएसपी व सरकारी योजनाएं',
    navLivestock: 'पशुपालन और चारा',
    navIoTSensors: 'स्मार्ट मिट्टी सेंसर (IoT)',
    navControlTower: 'सप्लाई चेन कंट्रोल टावर',
    navAdmin: 'एडमिन पोर्टल',
    navAIAssistant: 'किसान साथी AI सहायक',
    welcomeFarmer: 'नमस्ते,',
    totalLand: 'कुल कृषि भूमि',
    activePlots: 'सक्रिय खेत',
    todaysTasks: 'आज के कृषि कार्य',
    weatherSummary: 'मंड्या मौसम व कृषि सलाह',
    materialOrders: 'खाद-बीज ऑर्डर स्थिति',
    creditStatus: 'इनपुट क्रेडिट सुविधा',
    buyerOffers: 'खरीदारों के ऑफर',
    estimatedProfit: 'अनुमानित शुद्ध लाभ',
    askSaathiAI: 'AI सलाहकार से पूछें',
    acres: 'एकड़',
    quintals: 'क्विंटल',
    rupees: '₹',
    demoDisclaimer: 'हैकाथॉन प्रोटोटाइप: भारतीय किसानों के लिए डेमो और सिमुलेशन प्लेटफॉर्म।',
    simulatedData: 'डेमो सिमुलेशन डेटा',
    switchRole: 'भूमिका बदलें',
    resetDemoData: 'डेमो डेटा रीसेट करें',
    organic: 'जैविक (Organic)',
    conventional: 'पारंपरिक (Conventional)',
    searchPlaceholder: 'फसल, खाद, बीज या मंडी भाव खोजें...',
    addToCart: 'कार्ट में जोड़ें',
    viewDetails: 'विवरण देखें',
    checkout: 'ऑर्डर पूरा करें',
    applyForCredit: 'इनपुट क्रेडिट आवेदन करें',
    listProduce: 'उपज बिक्री के लिए सूचीबद्ध करें',
    submitOffer: 'खरीदार ऑफर भेजें',
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    disruptionAlert: 'आपूर्ति श्रृंखला में रुकावट',
    recoveryPlan: 'वैकल्पिक रिकवरी योजना',
    speechListening: 'आपकी आवाज सुनी जा रही है...',
    speechSpeak: 'बोलकर बताएं',
    disclaimerMedicalLegal: 'शैक्षणिक कृषि मार्गदर्शन। गंभीर समस्याओं के लिए निकटतम कृषि विज्ञान केंद्र (KVK) से संपर्क करें।',
  },
};

export function getTranslation(lang: LanguageCode, key: keyof TranslationDictionary): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
