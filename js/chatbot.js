// Chatbot JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded in chatbot.js");
    
    // Get elements
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbot = document.getElementById('chatbot');
    const closeBtn = document.getElementById('close-chatbot');
    
    // Gemini API configuration
    const GEMINI_API_KEY = 'AIzaSyB04dtCb8BxC9FkeQFcno6vX9rs2G9Pz9w';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';
    
    // Conversation history for context
    let conversationHistory = [
        {
            role: "system",
            parts: [{ text: "You are Glam Assistant, a knowledgeable and helpful beauty advisor for a makeup try-on application. Your expertise covers makeup, skincare, beauty trends, fashion, and related lifestyle topics. You can discuss virtually any topic, but your specialty is beauty. Always be friendly, conversational, and helpful. Keep responses concise but informative. Use emojis occasionally where appropriate. If asked about makeup or beauty, provide detailed advice tailored to the user's question. Your goal is to make the user feel like they're chatting with a beauty-savvy friend who's always supportive and positive." }]
        },
        {
            role: "assistant",
            parts: [{ text: "Hi there! I'm your Glam Assistant. I'd love to help with makeup tips, skincare advice, beauty trends, or just chat about whatever's on your mind. What can I help you with today? 💄" }]
        }
    ];
    
    // Log elements to check if they're found
    console.log("Chatbot elements found:", {
        chatbotToggle: !!chatbotToggle,
        chatbot: !!chatbot,
        closeBtn: !!closeBtn,
        chatMessages: !!chatMessages,
        chatInput: !!chatInput,
        sendMessage: !!sendMessage
    });
    
    // Ensure the chatbot starts hidden
    if (chatbot) {
        chatbot.style.transform = 'translateY(100%)';
        chatbot.style.opacity = '0';
    }
    
    // Basic toggle functionality (backup to the inline onclick)
    if (chatbotToggle && chatbot) {
        chatbotToggle.addEventListener('click', function() {
            console.log("Toggle clicked from JS");
            chatbot.style.transform = 'translateY(0)';
            chatbot.style.opacity = '1';
        });
    }
    
    // Close button (backup to the inline onclick)
    if (closeBtn && chatbot) {
        closeBtn.addEventListener('click', function() {
            console.log("Close clicked from JS");
            chatbot.style.transform = 'translateY(100%)';
            chatbot.style.opacity = '0';
        });
    }

    // Setup send message functionality
    if (sendMessage && chatInput && chatMessages) {
        // Send message on button click
        sendMessage.addEventListener('click', handleSendMessage);
        
        // Also set direct onclick as backup
        sendMessage.onclick = handleSendMessage;
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
    
    // Function to call Gemini API with direct prompt engineering
    async function callGeminiAPI(userMessage) {
        // Create a more comprehensive prompt with better context management
        const prompt = `You are Glam Assistant, a knowledgeable and friendly AI assistant for a makeup try-on website. The user is currently using a virtual makeup application where they can upload photos, try on different makeup styles, and get beauty advice.

User's message: "${userMessage}"

Please respond as Glam Assistant with these guidelines:
1. Be helpful, conversational, and show personality in your responses
2. Topics you can discuss in detail:
   - Makeup tips, techniques, and product recommendations
   - Skincare routines and product advice
   - Fashion trends and personal style
   - Beauty industry knowledge
   - Health and wellness related to beauty
   - How to use virtual makeup try-on apps
   - Seasonal makeup trends
   - Celebrity makeup looks
   - Color theory in makeup
   - Makeup for different skin types, tones, occasions, and ages

3. You can also knowledgeably discuss:
   - Entertainment and pop culture
   - Travel and lifestyle
   - Food and nutrition
   - Technology
   - General knowledge questions
   - Casual conversation

4. Response style:
   - Be warm, friendly and conversational, like chatting with a beauty-savvy friend
   - Use emojis occasionally where appropriate
   - Keep responses clear and concise (2-3 sentences for simple questions, more for complex ones)
   - If you don't know something, be honest but try to provide related helpful information
   - Personalize responses when possible
   - Be supportive and positive

5. Common makeup questions you should be prepared to answer:
   - "What foundation/concealer/lipstick shade would suit my skin tone?" (Ask about their undertone and skin type)
   - "How do I choose the right makeup for my eye color?" (Provide color theory advice)
   - "What makeup would work for a [specific occasion]?" (Offer event-appropriate suggestions)
   - "How do I create a [specific makeup look]?" (Give step-by-step instructions)
   - "What products would you recommend for [skin concern]?" (Suggest beneficial ingredients)
   - "How do I make my makeup last longer?" (Offer primer, setting techniques)
   - "What are the best products for beginners?" (Suggest user-friendly options)
   - "How do I use [specific makeup tool]?" (Provide technique guidance)

6. Makeup knowledge to incorporate when relevant:
   - Foundation should match neck/chest, not just face
   - Primer helps makeup adhere better to skin
   - Setting spray helps makeup last longer
   - Cream products work better for dry skin, powders for oily skin
   - Color correction uses complementary colors (green cancels redness, etc.)
   - Makeup application order: skincare, primer, color correction, foundation, concealer, powder, bronzer, blush, highlight, eyes, lips
   - Warm undertones look good with gold, peach, coral; cool undertones suit silver, pink, blue-red

Remember you're representing a makeup try-on application, so beauty advice is your primary strength, but you should engage naturally with all topics the user brings up.`;

        try {
            // Use chat format with history for better context
            const messages = [
                { role: "user", parts: [{ text: prompt }] }
            ];
            
            // Create a request that uses more advanced Gemini capabilities
            const requestBody = {
                contents: messages,
                generationConfig: {
                    temperature: 0.85,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                    stopSequences: []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };
            
            // Make the API request
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API error details:', errorData);
                throw new Error(`Gemini API returned status ${response.status}`);
            }
            
            // Parse the response
            const responseData = await response.json();
            console.log('Gemini API response:', responseData);
            
            // Extract the text from the response
            if (responseData.candidates && 
                responseData.candidates[0] && 
                responseData.candidates[0].content && 
                responseData.candidates[0].content.parts && 
                responseData.candidates[0].content.parts[0]) {
                return responseData.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Unexpected response format from Gemini API');
            }
        } catch (error) {
            console.error('Error in callGeminiAPI:', error);
            throw error;
        }
    }
    
    // Function to get a response using full conversation history
    async function getGeminiConversationResponse() {
        try {
            // Include system message in the conversation
            const systemMessage = "You are Glam Assistant, a helpful and knowledgeable beauty advisor for a makeup try-on application. Maintain a friendly, conversational tone while providing expert advice on makeup, beauty, and related topics. You can also discuss general topics, but beauty is your expertise.";
            
            // Create a copy of the conversation history with a focused system message
            const conversationWithContext = [
                {
                    role: "system",
                    parts: [{ text: systemMessage }]
                },
                ...conversationHistory.slice(1) // Skip the original system message
            ];
            
            // Prepare request body
            const requestBody = {
                contents: conversationWithContext,
                generationConfig: {
                    temperature: 0.85,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                }
            };
            
            // Make API request
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            // Check if request was successful
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API error with conversation history:', errorData);
                throw new Error(`Gemini API returned status ${response.status}`);
            }
            
            // Parse response
            const responseData = await response.json();
            
            // Extract text
            if (responseData.candidates && 
                responseData.candidates[0] && 
                responseData.candidates[0].content && 
                responseData.candidates[0].content.parts && 
                responseData.candidates[0].content.parts[0]) {
                return responseData.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Unexpected response format from Gemini API');
            }
        } catch (error) {
            console.error('Error in getGeminiConversationResponse:', error);
            throw error;
        }
    }
    
    // Function to handle sending a message
    function handleSendMessage() {
        console.log("Send button clicked");
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addMessageToChat(message, 'user');
            
            // Add to conversation history
            conversationHistory.push({
                role: "user",
                parts: [{ text: message }]
            });
            
            // Clear input field
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // First try with conversation history
            getGeminiConversationResponse()
                .then(response => {
                    // Remove typing indicator
                    removeTypingIndicator();
                    
                    // Add to conversation history
                    conversationHistory.push({
                        role: "assistant",
                        parts: [{ text: response }]
                    });
                    
                    // Display the response
                    addMessageToChat(response, 'bot');
                })
                .catch(error => {
                    // Log the error
                    console.error("Error with conversation API:", error);
                    
                    // Try the single message approach as fallback
                    callGeminiAPI(message)
                        .then(response => {
                            // Remove typing indicator
                            removeTypingIndicator();
                            
                            // Add to conversation history
                            conversationHistory.push({
                                role: "assistant",
                                parts: [{ text: response }]
                            });
                            
                            // Display the response
                            addMessageToChat(response, 'bot');
                        })
                        .catch(finalError => {
                            console.error("Final API error:", finalError);
                            
                            // Remove typing indicator
                            removeTypingIndicator();
                            
                            // Use local fallback
                            const fallbackResponse = getFallbackResponse(message);
                            addMessageToChat(fallbackResponse, 'bot');
                            
                            // Add fallback to conversation history
                            conversationHistory.push({
                                role: "assistant",
                                parts: [{ text: fallbackResponse }]
                            });
                        });
                });
        }
    }
    
    // Function to get a fallback response if the API fails
    function getFallbackResponse(message) {
        message = message.toLowerCase();
        
        // Enhanced generic responses for various topics
        const responses = {
            greeting: [
                "Hello! How can I help with your beauty questions today? 👋",
                "Hi there! Ready to talk makeup, skincare, or whatever else is on your mind!",
                "Hey! I'm your Glam Assistant. What beauty topic shall we explore today?"
            ],
            thanks: [
                "You're welcome! I'm always happy to help with your beauty questions! 💖",
                "Anytime! Feel free to ask about any other makeup or beauty topics you're curious about.",
                "My pleasure! I'm here whenever you need beauty advice or just want to chat."
            ],
            goodbye: [
                "Bye for now! Come back anytime you need beauty advice! ✨",
                "Take care! Hope to help with more of your beauty questions soon!",
                "Goodbye! Remember, you're beautiful inside and out!"
            ],
            help: [
                "I can help with makeup recommendations, application techniques, skincare routines, beauty trends, or just chat about whatever's on your mind. What are you interested in?",
                "Looking for beauty advice? I can suggest products, techniques, or trends. Or we can chat about fashion, wellness, or just about anything else!",
                "I'm your virtual beauty assistant! Ask me about makeup, skincare, beauty trends, or even general topics like food, travel, or entertainment."
            ],
            makeup: [
                "Makeup is my specialty! Looking for product recommendations, application techniques, or trend advice? I'd be happy to help!",
                "The right makeup can enhance your natural beauty! Are you looking for everyday looks or something for a special occasion?",
                "Makeup should be fun and expressive! Tell me what areas you're focusing on—eyes, lips, foundation—and I can offer some tips."
            ],
            skincare: [
                "Great skincare is the foundation of beauty! What's your skin type and what concerns are you trying to address?",
                "Taking care of your skin is so important! Are you looking to build a routine or address specific concerns like acne or aging?",
                "Everyone deserves healthy, glowing skin! Let me know what your skincare goals are, and I can suggest some approaches."
            ],
            fashion: [
                "Fashion and beauty go hand in hand! What's your personal style, and are you looking to update your wardrobe?",
                "The best fashion advice is to wear what makes you feel confident! Need help styling an outfit or finding your signature look?",
                "I love talking fashion! Are you looking for trend updates, wardrobe essentials, or outfit ideas for a specific occasion?"
            ],
            wellness: [
                "Beauty starts from within! Are you looking for self-care tips, fitness advice, or ways to reduce stress?",
                "Wellness and beauty are deeply connected. What aspect of wellness are you focusing on right now?",
                "Taking care of your whole self is so important for that natural glow! What wellness topics interest you most?"
            ],
            food: [
                "Food can definitely impact your skin and overall glow! Are you interested in beauty-boosting foods or general nutrition?",
                "I love talking about food and its connection to beauty! Are you looking for recipes, nutrition tips, or foods for healthier skin?",
                "Some foods can work wonders for your skin and hair! What kind of dietary advice are you looking for?"
            ],
            travel: [
                "Traveling can be so exciting! Need help with travel-friendly beauty products or skincare routines that work on-the-go?",
                "Planning a trip? I can suggest beauty essentials to pack or how to keep your skin happy in different climates!",
                "Travel and beauty definitely go together! Where are you headed, and what beauty concerns do you have for your trip?"
            ],
            entertainment: [
                "I love discussing entertainment! Are you curious about celebrity beauty secrets or red carpet makeup looks?",
                "Entertainment and beauty trends often go hand in hand! What shows, movies, or celebrities inspire your style?",
                "Let's chat entertainment! I can discuss trending beauty looks from your favorite shows or celebrities if you'd like!"
            ],
            technology: [
                "Beauty tech is evolving so quickly! Are you interested in smart beauty devices, virtual try-on tools, or beauty apps?",
                "Technology has transformed beauty in amazing ways! What beauty tech are you curious about?",
                "From AI skincare analysis to AR makeup try-on, beauty tech is fascinating! What aspects interest you most?"
            ],
            products: [
                "Finding the right beauty products can be a game-changer! What specific products or brands are you curious about?",
                "I'd be happy to discuss beauty products! Are you looking for recommendations for a specific skin type or concern?",
                "There are so many amazing beauty products out there! Let me know what you're looking for, and I can suggest some options."
            ],
            seasons: [
                "Seasonal changes definitely call for adjustments to your beauty routine! Which season are you preparing for?",
                "Each season brings different beauty challenges and trends! Are you looking for seasonal makeup looks or skincare adjustments?",
                "Seasonal beauty updates can be so fun! Would you like advice on transitioning your routine between seasons?"
            ],
            default: [
                "That's interesting! I'd love to chat more about this topic. What specifically would you like to know?",
                "Great question! I'm happy to discuss this with you. Could you share a bit more about what you're looking for?",
                "I'd be glad to help with that! Could you tell me a bit more about what you're interested in?"
            ]
        };
        
        // Determine which category the message falls into with enhanced keywords
        let category = "default";
        
        if (message.match(/\b(hi|hello|hey|greetings|howdy|morning|afternoon|evening)\b/i)) {
            category = "greeting";
        } else if (message.match(/\b(thanks|thank you|thx|ty|appreciate|grateful)\b/i)) {
            category = "thanks";
        } else if (message.match(/\b(bye|goodbye|see you|farewell|later|take care)\b/i)) {
            category = "goodbye";
        } else if (message.match(/\b(help|assist|support|guidance|what can you do|how to use|features)\b/i)) {
            category = "help";
        } else if (message.match(/\b(makeup|cosmetic|foundation|lipstick|eyeshadow|mascara|eyeliner|concealer|blush|contour|highlight|beauty|palette|brush|powder|bronzer|primer|setting spray|brow|lash|gloss|matte|shimmer|glitter)\b/i)) {
            category = "makeup";
        } else if (message.match(/\b(skin|skincare|moisturizer|cleanser|exfoliate|serum|toner|mask|acne|wrinkle|pore|hydrate|dry|oily|combination|sensitive|sunscreen|spf|anti-aging|pimple|blackhead|routine)\b/i)) {
            category = "skincare";
        } else if (message.match(/\b(fashion|style|clothes|outfit|dress|wear|trend|accessory|jewelry|bag|shoe|wardrobe|closet|styling|fit|pattern|color scheme|season)\b/i)) {
            category = "fashion";
        } else if (message.match(/\b(wellness|health|fitness|exercise|meditation|mindfulness|self-care|sleep|diet|nutrition|mental health|stress|relax|balance|yoga|workout)\b/i)) {
            category = "wellness";
        } else if (message.match(/\b(food|eat|cook|recipe|restaurant|meal|breakfast|lunch|dinner|dish|cuisine|chef|nutrition|diet|ingredient|snack|healthy eating)\b/i)) {
            category = "food";
        } else if (message.match(/\b(travel|trip|vacation|visit|destination|country|city|flight|hotel|tourist|explore|journey|adventure|abroad|foreign|local|sight|tour)\b/i)) {
            category = "travel";
        } else if (message.match(/\b(movie|film|show|series|tv|actor|actress|director|music|song|artist|band|album|concert|entertainment|celebrity|star|performance|award|red carpet)\b/i)) {
            category = "entertainment";
        } else if (message.match(/\b(tech|technology|computer|phone|app|software|hardware|gadget|device|internet|digital|virtual|online|smart|ai|ar|vr|try-on)\b/i)) {
            category = "technology";
        } else if (message.match(/\b(product|brand|recommend|buy|purchase|price|cost|worth|review|popular|new|launch|limited edition|bestseller|holy grail|favorite|must-have|dupe|affordable|luxury)\b/i)) {
            category = "products";
        } else if (message.match(/\b(spring|summer|fall|autumn|winter|season|seasonal|holiday|christmas|halloween|weather|hot|cold|humid|dry)\b/i)) {
            category = "seasons";
        }
        
        // Get a random response from the appropriate category
        const categoryResponses = responses[category];
        const randomIndex = Math.floor(Math.random() * categoryResponses.length);
        return categoryResponses[randomIndex];
    }
    
    // Add message to chat
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('flex');
        
        if (sender === 'user') {
            messageDiv.classList.add('justify-end');
            messageDiv.innerHTML = `
                <div class="chat-bubble-user">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.classList.add('justify-start');
            messageDiv.innerHTML = `
                <div class="chat-bubble-bot">
                    <p>${message}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('flex', 'justify-start', 'typing-indicator');
        typingDiv.innerHTML = `
            <div class="chat-bubble-bot flex space-x-1">
                <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0s;"></span>
                <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
                <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}); 