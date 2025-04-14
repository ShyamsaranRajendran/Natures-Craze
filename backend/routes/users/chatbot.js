const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyDZGMyMQ5v2pERahxw0Z5qDNDtr89aoHjU");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const companyConfig = {
  brand: {
    name: "Nature's Carze",
    industry: "Organic & Natural Products",
    values: [
      "100% natural ingredients",
      "Sustainable sourcing",
      "Chemical-free formulations",
      "Eco-friendly packaging"
    ]
  },
  products: {
    categories: [
      "Organic Foods",
      "Natural Skincare",
      "Herbal Supplements",
      "Eco-Friendly Home Products"
    ],
    examples: [
      "Cold-pressed organic oils",
      "Herbal immunity boosters",
      "Chemical-free skincare",
      "Natural sweeteners"
    ]
  },
  guidelines: {
    tone: "Friendly, knowledgeable, and passionate about natural living",
    restrictions: [
      "Never make medical claims",
      "Only state general wellness benefits",
      "When unsure, recommend consulting wellness experts"
    ],
    certifications: [
      "USDA Organic",
      "Cruelty-Free",
      "Vegan Certified"
    ]
  }
};

// System prompt with company configuration
const systemPrompt = `
You are the official chatbot for ${companyConfig.brand.name}, a ${companyConfig.brand.industry} company.
Our core values: ${companyConfig.brand.values.join(', ')}.

Product Categories: ${companyConfig.products.categories.join(', ')}
Example Products: ${companyConfig.products.examples.join(', ')}

Response Guidelines:
- Tone: ${companyConfig.guidelines.tone}
- Restrictions: ${companyConfig.guidelines.restrictions.join('; ')}
- Certifications: ${companyConfig.guidelines.certifications.join(', ')}

Always respond in character as a ${companyConfig.brand.name} representative.
`;

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    console.log('Received message:', message);

    // Prepare conversation history with system prompt
    const conversationHistory = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: `Hello! I'm your ${companyConfig.brand.name} assistant. How can I help you with our natural products today?` }]
      },
      ...(history || [])
    ];

    // Filter history to ensure proper alternation
    const filteredHistory = conversationHistory.length > 0 && 
                           conversationHistory[0].role === 'model' 
                           ? conversationHistory.slice(1) 
                           : conversationHistory;

    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7, // Lower for more consistent brand voice
      }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response.text();

    res.status(200).json({ response });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Something went wrong',
      fallbackResponse: `I'm having trouble connecting to our systems. Please visit ${companyConfig.brand.name}.com for more information about our natural products.`
    });
  }
});

module.exports = router;