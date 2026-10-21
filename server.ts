import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI SDK if key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent agricultural response engine
function generateLocalAgriAdvice(message: string, language: string, farmContext?: any): string {
  const query = message.toLowerCase();

  if (language === 'kn') {
    if (query.includes('water') || query.includes('ನೀರಾವರಿ') || query.includes('ನೀರು')) {
      return `💧 **ನೀರಾವರಿ ಸಲಹೆ (Irrigation Advisory):**
ನಿಮ್ಮ ಮಣ್ಣಿನ ತೇವಾಂಶ ಸಂವೇದಕದ ಪ್ರಕಾರ, ಭತ್ತದ ಗದ್ದೆಗೆ (ಪ್ಲಾಟ್ 1) 46% ತೇವಾಂಶ ಸೂಕ್ತವಾಗಿದೆ. ಕಬ್ಬಿನ ಪ್ಲಾಟ್‌ಗೆ (ಪ್ಲಾಟ್ 2) ತೇವಾಂಶ 28% ಕ್ಕೆ ಇಳಿದಿರುವುದರಿಂದ ಮುಂಜಾನೆ 2.5 ಗಂಟೆಗಳ ಕಾಲ ಹನಿ ನೀರಾವರಿ (Drip) ನಡೆಸುವುದು ಉತ್ತಮ. ಬಿಸಿಲಿನ ಸಮಯದಲ್ಲಿ ನೀರು ಕೊಡುವುದನ್ನು ತಪ್ಪಿಸಿ.`;
    }
    if (query.includes('fertilizer') || query.includes('ಗೊಬ್ಬರ') || query.includes('ಖರ್ಚು')) {
      return `🌱 **ಗೊಬ್ಬರ ವೆಚ್ಚ ಕಡಿಮೆ ಮಾಡಲು ಸಲಹೆ:**
1. **ಜೀವಾಮೃತ (Jeevamrutha):** 200 ಲೀಟರ್ ನೀರಿಗೆ 10 ಕೆಜಿ ಹಸುವಿನ ಸಗಣಿ, 10 ಲೀಟರ್ ಗೋಮೂತ್ರ, 2 ಕೆಜಿ ಬೆಲ್ಲ ಮತ್ತು 2 ಕೆಜಿ ದ್ವಿದಳ ಧಾನ್ಯದ ಹಿಟ್ಟು ಬೆರೆಸಿ 48 ಗಂಟೆ ಹುದುಗಿಸಿ ನೀರಾವರಿಯೊಂದಿಗೆ ಹಾಯಿಸಿ.
2. ಮಣ್ಣು ಪರೀಕ್ಷೆ ಆಧಾರಿತ NPK ಬಳಕೆ ಮಾಡಿ - ಅತಿಯಾದ ಯೂರಿಯಾ ಬಳಕೆ ತಪ್ಪಿಸಿ ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಹೆಚ್ಚಿಸಿ.`;
    }
    if (query.includes('disease') || query.includes('ಕೀಟ') || query.includes('ರೋಗ')) {
      return `🛡️ **ರೋಗ & ಕೀಟ ನಿರ್ವಹಣೆ (IPM):**
ಭತ್ತದ ಬೆಂಕಿರೋಗ (Blast) ಅಥವಾ ಕಾಂಡ ಕೊರೆಯುವ ಕೀಟಕ್ಕೆ ಮೊದಲಿಗೆ ಎಕರೆಗೆ 5 ಲಿಂಗಾಕರ್ಷಕ ಬಲೆಗಳನ್ನು (Pheromone traps) ಅಳವಡಿಸಿ. ಸಾವಯವ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ 5% ಬೇವಿನ ಕಷಾಯ ಸಿಂಪಡಿಸಿ. ತೀವ್ರ ಸಮಸ್ಯೆಗೆ ನಿಮ್ಮ ಸ್ಥಳೀಯ KVK ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
    }
    return `🌾 **ರೈತ ಸಾಥಿ ಕೃಷಿ ಸಲಹೆ:**
ನಮಸ್ಕಾರ! ನಿಮ್ಮ ${farmContext?.currentCrops || 'ಬೆಳೆಗಳು'} ಮತ್ತು ಮಣ್ಣಿನ ಸ್ಥಿತಿಯನ್ನು ಗಮನಿಸಿ ಸಲಹೆ ನೀಡಲಾಗುತ್ತದೆ. ಸಾವಯವ ಕೃಷಿ, ಬೆಳೆ ರಕ್ಷಣೆ, ಹನಿ ನೀರಾವರಿ ಅಥವಾ ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.`;
  }

  if (language === 'hi') {
    if (query.includes('water') || query.includes('पानी') || query.includes('सिंचाई')) {
      return `💧 **सिंचाई सलाह (Irrigation Advisory):**
आपकी मिट्टी की नमी के अनुसार, धान के खेत में पर्याप्त नमी है। गन्ने के खेत में नमी 28% तक कम हो गई है, इसलिए सुबह के समय 2-3 घंटे ड्रिप सिंचाई अवश्य चलाएं। दोपहर की तेज धूप में सिंचाई से बचें।`;
    }
    if (query.includes('fertilizer') || query.includes('खाद') || query.includes('खर्च')) {
      return `🌱 **खाद की लागत घटाने के उपाय:**
1. **जीवामृत खाद:** 200 लीटर पानी में 10 किलो देशी गाय का गोबर, 10 लीटर गोमूत्र, 2 किलो गुड़ व बेसन मिलाकर 48 घंटे रखें और सिंचाई के साथ दें।
2. संतुलित NPK का उपयोग करें, अत्यधिक यूरिया के छिड़काव से बचें ताकि कीटों का प्रकोप न बढ़े।`;
    }
    return `🌾 **किसान साथी कृषि परामर्श:**
नमस्ते! हम आपकी मिट्टी, फसल और मौसम के अनुसार वैज्ञानिक व जैविक कृषि सलाह प्रदान करते हैं। आप फसल सुरक्षा, मंडी भाव या खाद-बीज के बारे में पूछ सकते हैं।`;
  }

  // English default
  if (query.includes('water') || query.includes('irrigat')) {
    return `💧 **Irrigation & Soil Moisture Advisory:**
Based on your telemetry, Plot 1 (Wetland Paddy) is at an optimal 46% moisture. However, Plot 2 (Sugarcane) has dropped to 28% moisture, indicating that a 2.5-hour drip fertigation cycle should be run in the early morning before peak transpiration. Avoid flood irrigation to conserve water and prevent nitrogen leaching.`;
  }
  if (query.includes('fertilizer') || query.includes('cost') || query.includes('compost')) {
    return `🌱 **Nutrient Management & Cost Optimization:**
1. **On-Farm Jeevamrutha:** Prepare 200L using 10kg desi cow dung, 10L cow urine, 2kg jaggery, and 2kg pulse flour. Ferment for 48 hours and apply via drip or irrigation channel every 15 days to reduce chemical fertilizer expenditure by up to 35%.
2. **Neem-Coated Urea Timing:** Split nitrogen applications into 3 equal splits (basal, active tillering, panicle initiation) rather than single heavy dressings.`;
  }
  if (query.includes('pest') || query.includes('disease') || query.includes('blast')) {
    return `🛡️ **Integrated Pest & Disease Guidance:**
For early stem borer and leaf blast inspection in paddy:
- Install 5 yellow sticky traps and 4 pheromone traps per acre.
- Spray 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride bio-fungicide as an organic preventative shield.
- *Caution:* If infection exceeds Economic Injury Level (EIL > 10% dead hearts), consult your local Krishi Vigyan Kendra (KVK) officer for targeted bio-rational intervention.`;
  }
  if (query.includes('sell') || query.includes('price') || query.includes('mandi') || query.includes('buyer')) {
    return `📈 **Market & Sale Advisory:**
- Current published MSP for Paddy Common is ₹2,300/qtl and Ragi is ₹4,290/qtl.
- In Mandya APMC, active buyer bids on Farmer Saathi currently average ₹2,420/qtl with direct farm-gate collection, netting ₹2,360/qtl after local transport.
- You can list your harvested quantity in the 'Produce Market' tab to receive competitive buyer offers directly without middlemen commission.`;
  }

  return `🌾 **Farmer Saathi Agricultural Advisory:**
Hello! Based on your active farm profile (${farmContext?.currentCrops || 'Paddy, Sugarcane & Ragi'} in Mandya district with clay loam & red loam soils):
- Weather indicates favorable moderate temperatures.
- Maintain regular weed monitoring and organic compost application.
- Feel free to ask about organic pest shields, irrigation schedules, input credit, or harvest sales!`;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Farmer Saathi Backend',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Dedicated AI Assistant endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', farmContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    // If Gemini client is available, call the gemini-3.8-flash model
    if (ai) {
      const languageInstruction =
        language === 'kn'
          ? 'Respond entirely in natural, respectful, and simple Kannada (ಕನ್ನಡ). Use common agricultural terminology.'
          : language === 'hi'
          ? 'Respond in clear, accessible Hindi (हिंदी). Use respectful and easy-to-understand terms.'
          : 'Respond in clear, helpful English suitable for Indian farming contexts.';

      const systemPrompt = `You are Farmer Saathi AI, an expert agricultural advisor and supply chain guide for Indian farmers, specifically in Karnataka.
${languageInstruction}

CONTEXT OF CURRENT FARMER:
${JSON.stringify(farmContext || {})}

CORE PRINCIPLES:
1. Provide practical, evidence-based agronomic recommendations.
2. Emphasize sustainable practices, soil health (organic carbon), and cost-effective organic inputs (like Jeevamrutha, neem formulations, crop rotation).
3. Distinguish verified facts from estimates. Never fabricate live market prices, subsidy approval dates, or bank loan sanctions.
4. For serious crop pests or chemical decisions, advise consulting official Krishi Vigyan Kendra (KVK) or local Raitha Samparka Kendra (RSK) officers.
5. Keep responses concise (around 3 to 5 clear bullet points or 2 short paragraphs) so they are easy to read and listen to on a mobile device.`;

      try {
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout after 6s')), 6000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        const replyText = response?.text || generateLocalAgriAdvice(message, language, farmContext);

        res.json({
          reply: replyText,
          isSimulatedFallback: false,
          model: 'gemini-3.8-flash',
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call timed out or failed, serving local ag-engine:', geminiError?.message || geminiError);
        const fallbackText = generateLocalAgriAdvice(message, language, farmContext);
        res.json({
          reply: fallbackText,
          isSimulatedFallback: true,
          note: 'Switched to simulated local agro-advisory engine.',
        });
        return;
      }
    }

    // If no API key configured, use local domain engine
    const fallbackText = generateLocalAgriAdvice(message, language, farmContext);
    res.json({
      reply: fallbackText,
      isSimulatedFallback: true,
      note: 'Operating in simulated demonstration mode (no GEMINI_API_KEY detected).',
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'An internal error occurred while processing agricultural guidance.',
      details: error?.message || String(error),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Farmer Saathi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
