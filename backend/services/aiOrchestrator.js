// Load environment variables before instantiating clients to avoid missing key errors
import 'dotenv/config';
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if .env file exists
const envPath = join(__dirname, '..', '.env');
const envExists = existsSync(envPath);

// Validate API key on startup
let API_KEY = process.env.OPENROUTER_API_KEY;

// Trim whitespace if key exists
if (API_KEY) {
  API_KEY = API_KEY.trim();
}

// If no API key, try to provide helpful diagnostics
if (!API_KEY) {
  console.error('\n❌ ERROR: OPENROUTER_API_KEY not found in environment variables.');
  if (!envExists) {
    console.error(`   .env file not found at: ${envPath}`);
    console.error('   Please create a .env file in the backend directory.');
  } else {
    console.error(`   .env file exists at: ${envPath}`);
    try {
      const envContent = readFileSync(envPath, 'utf8');
      if (envContent.includes('OPENROUTER')) {
        console.error('   Found OPENROUTER in .env file, but key may be empty or commented out.');
      } else {
        console.error('   OPENROUTER_API_KEY is not set in the .env file.');
      }
    } catch (err) {
      console.error('   Could not read .env file.');
    }
  }
  console.error('\n   To fix this:');
  console.error('   1. Create or edit backend/.env file');
  console.error('   2. Add: OPENROUTER_API_KEY=your-api-key-here');
  console.error('   3. Get your API key from: https://openrouter.ai/keys');
  console.error('   4. Make sure there are NO spaces around the = sign');
  console.error('   5. Do NOT use quotes around the API key value');
  console.error('   6. Restart the server\n');
} else if (API_KEY.length < 20) {
  console.warn('⚠️  WARNING: OPENROUTER_API_KEY seems too short. Please verify it is correct.');
} else {
  // Mask the key for security (show first 10 and last 4 chars)
  const maskedKey = API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4);
  console.log(`✓ OpenRouter API key loaded: ${maskedKey}`);
  
  // Test the API key on startup (async, don't block)
  setTimeout(async () => {
    try {
      const testResult = await testAPIKey();
      if (testResult.valid) {
        console.log('✓ OpenRouter API key verified and working');
      } else {
        console.error('\n❌ OpenRouter API key test FAILED:');
        console.error(`   Error: ${testResult.error}`);
        
        // Show diagnostics if available
        if (testResult.diagnostics) {
          console.error('\n📊 Key Diagnostics:');
          console.error(`   Length: ${testResult.diagnostics.keyLength} characters`);
          console.error(`   Starts with: ${testResult.diagnostics.keyPrefix}...`);
          if (testResult.diagnostics.hasSpaces) {
            console.error('   ⚠️  Key contains SPACES - remove them!');
          }
          if (testResult.diagnostics.hasQuotes) {
            console.error('   ⚠️  Key contains QUOTES - remove them from .env file!');
          }
          if (!testResult.diagnostics.startsWithCorrectPrefix) {
            console.error('   ⚠️  Key format looks wrong - should start with "sk-or-v1-" or "sk-"');
          }
          if (testResult.diagnostics.keyLength < 50) {
            console.error('   ⚠️  Key is too short - you may not have copied the entire key!');
          }
        }
        
        if (testResult.statusCode) {
          console.error(`   HTTP Status: ${testResult.statusCode}`);
        }
        if (testResult.detailedError) {
          console.error(`   API Response: ${testResult.detailedError}`);
        }
        
        console.error('\n🔧 How to Fix:');
        console.error('   1. Go to https://openrouter.ai/keys');
        console.error('   2. Sign in (or create free account)');
        console.error('   3. Delete old keys and create a NEW one');
        console.error('   4. Copy the ENTIRE key (100+ characters)');
        console.error('   5. Update backend/.env: OPENROUTER_API_KEY=your-key-here');
        console.error('   6. NO quotes, NO spaces around = sign');
        console.error('   7. Restart server completely');
        console.error('\n   See backend/DEBUG_API_KEY.md for detailed debugging steps\n');
      }
    } catch (err) {
      console.warn('⚠️  Could not test API key on startup:', err.message);
    }
  }, 2000); // Wait 2 seconds after server starts
}

const client = axios.create({
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  headers: {
    Authorization: API_KEY ? `Bearer ${API_KEY}` : '',
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "UniPrep Copilot"
  },
  timeout: 60000, // 60 second timeout
});

// Test API key function with detailed diagnostics
export async function testAPIKey() {
  if (!API_KEY) {
    return { 
      valid: false, 
      error: 'API key not configured',
      diagnostics: {
        keyLength: 0,
        keyPrefix: 'none',
        keyExists: false
      }
    };
  }
  
  // Diagnostic information
  const diagnostics = {
    keyLength: API_KEY.length,
    keyPrefix: API_KEY.substring(0, 10),
    keySuffix: API_KEY.substring(API_KEY.length - 4),
    keyExists: true,
    hasSpaces: API_KEY.includes(' '),
    hasQuotes: API_KEY.includes('"') || API_KEY.includes("'"),
    startsWithCorrectPrefix: API_KEY.startsWith('sk-or-v1-') || API_KEY.startsWith('sk-')
  };
  
  // Check for common issues
  if (API_KEY.length < 50) {
    return { 
      valid: false, 
      error: 'API key is too short. OpenRouter keys are typically 100+ characters long.',
      diagnostics 
    };
  }
  
  if (diagnostics.hasSpaces) {
    return { 
      valid: false, 
      error: 'API key contains spaces. Remove all spaces from the key.',
      diagnostics 
    };
  }
  
  if (diagnostics.hasQuotes) {
    return { 
      valid: false, 
      error: 'API key contains quotes. Remove quotes from your .env file.',
      diagnostics 
    };
  }
  
  if (!diagnostics.startsWithCorrectPrefix) {
    return { 
      valid: false, 
      error: 'API key format looks incorrect. OpenRouter keys start with "sk-or-v1-" or "sk-"',
      diagnostics 
    };
  }
  
  try {
    console.log('[API Test] Testing API key...');
    const testResponse = await client.post("/chat/completions", {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'test' if you can read this." }],
      max_tokens: 10
    });
    
    if (testResponse.data && testResponse.data.choices) {
      return { 
        valid: true, 
        message: 'API key is valid and working!',
        diagnostics 
      };
    }
    return { 
      valid: false, 
      error: 'Invalid response format from API',
      diagnostics 
    };
  } catch (error) {
    let errorDetails = error.message;
    let statusCode = null;
    
    if (error.response) {
      statusCode = error.response.status;
      const errorData = error.response.data;
      errorDetails = errorData?.error?.message || error.message;
      
      if (statusCode === 401) {
        if (errorDetails.includes('User not found') || errorDetails.includes('user not found')) {
          return { 
            valid: false, 
            error: 'API key is invalid - the key does not exist in OpenRouter\'s system. You need to create a NEW key at https://openrouter.ai/keys',
            diagnostics,
            statusCode,
            detailedError: errorDetails
          };
        }
        return { 
          valid: false, 
          error: 'API key authentication failed. The key may be invalid, expired, or revoked.',
          diagnostics,
          statusCode,
          detailedError: errorDetails
        };
      } else if (statusCode === 402) {
        return { 
          valid: false, 
          error: 'Insufficient credits in your OpenRouter account. Add credits at https://openrouter.ai/',
          diagnostics,
          statusCode
        };
      } else if (statusCode === 429) {
        return { 
          valid: false, 
          error: 'Rate limit exceeded. Wait a few minutes and try again.',
          diagnostics,
          statusCode
        };
      }
    }
    
    return { 
      valid: false, 
      error: errorDetails,
      diagnostics,
      statusCode: statusCode || 'unknown',
      fullError: error.message
    };
  }
}

export async function chat(messages, options = {}) {
  if (!API_KEY) {
    const errorMsg = 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your backend/.env file. Get your key from https://openrouter.ai/keys';
    console.error(`\n${errorMsg}\n`);
    throw new Error(errorMsg);
  }
  
  try {
    const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
    const requestPayload = {
      model,
      messages,
      ...options,
    };
    
    // Log request for debugging (without sensitive data)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AI] Requesting model: ${model}, messages: ${messages.length}`);
    }
    
    const { data } = await client.post("/chat/completions", requestPayload);
    
    if (!data || !data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenRouter API');
    }
    
    return data;
  } catch (error) {
    // Provide more helpful error messages
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      const errorMessage = errorData?.error?.message || error.message;
      
      console.error('\n❌ OpenRouter API Error:');
      console.error(`   Status: ${status}`);
      console.error(`   Message: ${errorMessage}`);
      
      if (status === 401) {
        let detailedMsg = '';
        if (errorMessage.includes('User not found') || errorMessage.includes('user not found')) {
          detailedMsg = `OpenRouter API key is INVALID or the account was deleted.\n\n` +
            `The error "User not found" means your API key doesn't exist or is no longer valid.\n\n` +
            `SOLUTION:\n` +
            `1. Go to https://openrouter.ai/keys\n` +
            `2. Sign in to your account (or create a new one if needed)\n` +
            `3. Delete the old API key if it exists\n` +
            `4. Create a NEW API key\n` +
            `5. Copy the ENTIRE new key (it's very long, starts with sk-or-v1-...)\n` +
            `6. Update backend/.env file: OPENROUTER_API_KEY=your-new-key-here\n` +
            `7. Make sure NO quotes, NO spaces around the = sign\n` +
            `8. Restart the server completely\n\n` +
            `If you don't have an OpenRouter account:\n` +
            `- Sign up at https://openrouter.ai/\n` +
            `- You get free credits to start\n` +
            `- Create an API key and add it to your .env file`;
        } else {
          detailedMsg = `OpenRouter API authentication failed. Your API key may be invalid or expired.\n\n` +
            `Please:\n` +
            `1. Check your API key at: https://openrouter.ai/keys\n` +
            `2. Verify it's correctly set in backend/.env as OPENROUTER_API_KEY\n` +
            `3. Make sure there are no extra spaces or quotes around the key\n` +
            `4. Try creating a NEW API key if the current one doesn't work\n` +
            `5. Restart the server after updating the .env file`;
        }
        throw new Error(detailedMsg);
      } else if (status === 429) {
        throw new Error('OpenRouter API rate limit exceeded. Please try again later or upgrade your plan.');
      } else if (status === 402) {
        throw new Error('OpenRouter API: Insufficient credits. Please add credits to your account at https://openrouter.ai/');
      } else if (status === 400) {
        throw new Error(`OpenRouter API: Bad request - ${errorMessage}`);
      } else {
        throw new Error(`OpenRouter API error (${status}): ${errorMessage}`);
      }
    } else if (error.request) {
      throw new Error('Unable to connect to OpenRouter API. Please check your internet connection and try again.');
    } else {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

/**
 * Base prompt template builder
 */
const buildBasePrompt = (userContext, styleProfile, contextData) => {
  let prompt = `You are an academic assistant helping university students prepare for exams and assignments.

User Context:
- University: ${userContext.university}
- Branch: ${userContext.branch}
- Semester: ${userContext.semester}
- Subject: ${userContext.subject}

Answer Style Profile:
- Sections: ${styleProfile.sections.join(', ')}
- Tone: ${styleProfile.tone}
${styleProfile.maxWordCount ? `- Max Word Count: ${styleProfile.maxWordCount}` : ''}
${styleProfile.instructions ? `- Additional Instructions: ${styleProfile.instructions}` : ''}

Relevant Context:
`;

  if (contextData.syllabus) {
    prompt += `\nSyllabus:\n${contextData.syllabus.substring(0, 2000)}\n`;
  }
  if (contextData.notes) {
    prompt += `\nNotes:\n${contextData.notes.substring(0, 2000)}\n`;
  }
  if (contextData.pyq) {
    prompt += `\nPast Year Questions:\n${contextData.pyq.substring(0, 2000)}\n`;
  }

  return prompt;
};

/**
 * Generate study notes
 */
export const generateNotes = async (userContext, styleProfile, contextData, topic, depth) => {
  const basePrompt = buildBasePrompt(userContext, styleProfile, contextData);
  
  const prompt = `${basePrompt}

Generate comprehensive study notes on the topic: ${topic}

Depth Level: ${depth} (short/medium/detailed)

Requirements:
1. Follow the exact section structure: ${styleProfile.sections.join(', ')}
2. Maintain ${styleProfile.tone} tone throughout
3. Include relevant examples and key points
4. Ensure content aligns with the syllabus provided
${styleProfile.maxWordCount ? `5. Word count should be approximately ${styleProfile.maxWordCount}` : ''}

Output format as JSON:
{
  "sections": [
    {
      "title": "Section Name",
      "content": "Section content..."
    }
  ]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: styleProfile.maxWordCount ? Math.min(styleProfile.maxWordCount * 2, 4000) : 3000
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON, handle markdown code blocks
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', response.substring(0, 200));
      // Return a fallback structure
      parsedResponse = {
        sections: [{
          title: 'Generated Content',
          content: response
        }]
      };
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('AI Generation Error:', error);
    // Re-throw the original error if it's an API key issue
    if (error.message.includes('API key') || error.message.includes('authentication')) {
      throw error;
    }
    throw new Error(`Failed to generate notes: ${error.message}`);
  }
};

/**
 * Generate report
 */
export const generateReport = async (userContext, styleProfile, contextData, topic, wordCount, requiredSections) => {
  const basePrompt = buildBasePrompt(userContext, styleProfile, contextData);
  
  const prompt = `${basePrompt}

Generate an academic report on: ${topic}

Required Sections: ${requiredSections.join(', ')}
Target Word Count: ${wordCount}

Requirements:
1. Include Abstract, Introduction, Methodology, Analysis, Conclusion, References
2. Follow ${styleProfile.tone} tone
3. Use academic citation style
4. Ensure methodology aligns with subject requirements

Output format as JSON:
{
  "sections": [
    {
      "title": "Abstract",
      "content": "..."
    }
  ],
  "references": ["..."]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: Math.min(wordCount * 2, 4000)
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate report. Please try again.');
  }
};

/**
 * Generate PPT content
 */
export const generatePPT = async (userContext, styleProfile, contextData, topic, slideCount, presentationType) => {
  const basePrompt = buildBasePrompt(userContext, styleProfile, contextData);
  
  const prompt = `${basePrompt}

Generate presentation content for: ${topic}

Number of Slides: ${slideCount}
Presentation Type: ${presentationType} (seminar/viva/internal)

Requirements:
1. Each slide should have a clear title
2. Use bullet points (max 5-6 per slide)
3. Include speaker notes for each slide
4. Follow ${styleProfile.tone} tone
5. Structure should be logical flow

Output format as JSON:
{
  "slides": [
    {
      "title": "Slide Title",
      "bullets": ["point 1", "point 2"],
      "speakerNotes": "Notes for presenter..."
    }
  ]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: slideCount * 200
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate PPT content. Please try again.');
  }
};

/**
 * Generate exam blueprint
 */
export const generateExamBlueprint = async (userContext, contextData) => {
  const basePrompt = buildBasePrompt(userContext, { sections: [], tone: 'formal_exam' }, contextData);
  
  const prompt = `${basePrompt}

Analyze the syllabus and past year questions to create an exam blueprint.

Requirements:
1. Identify frequently asked topics from PYQs
2. Estimate weightage for each unit/topic (as percentage)
3. Assess difficulty level (easy/medium/hard)
4. Highlight important topics

Output format as JSON:
{
  "units": [
    {
      "name": "Unit Name",
      "weightage": 25,
      "difficulty": "medium",
      "frequency": 8,
      "importantTopics": ["topic1", "topic2"]
    }
  ]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.5,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate exam blueprint. Please try again.');
  }
};

/**
 * Generate revision planner
 */
export const generateRevisionPlanner = async (userContext, contextData, examDate, hoursPerDay, blueprint) => {
  const basePrompt = buildBasePrompt(userContext, { sections: [], tone: 'formal_exam' }, contextData);
  
  const prompt = `${basePrompt}

Create a day-wise revision plan.

Exam Date: ${examDate}
Hours Per Day: ${hoursPerDay}
Current Date: ${new Date().toISOString().split('T')[0]}

Exam Blueprint:
${JSON.stringify(blueprint, null, 2)}

Requirements:
1. Distribute topics evenly across days
2. Include buffer days for revision
3. Schedule mock test days
4. Ensure realistic workload

Output format as JSON:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "topics": ["topic1", "topic2"],
      "tasks": ["task1", "task2"],
      "hours": 3
    }
  ],
  "bufferDays": 2,
  "mockTestDays": ["YYYY-MM-DD"]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 3000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate revision planner. Please try again.');
  }
};

/**
 * Generate rapid revision sheets
 */
export const generateRapidRevisionSheets = async (userContext, styleProfile, contextData, topics) => {
  const basePrompt = buildBasePrompt(userContext, styleProfile, contextData);
  
  const topicsList = Array.isArray(topics) ? topics.join(', ') : topics;
  
  const prompt = `${basePrompt}

Generate rapid revision sheet for: ${topicsList}

Requirements:
1. Key definitions (concise)
2. Important formulae
3. Bullet-point summaries
4. Follow ${styleProfile.sections.join(', ')} structure if applicable
5. Keep it ultra-concise

Output format as JSON:
{
  "keyPoints": ["point1", "point2"],
  "formulae": ["formula1", "formula2"],
  "definitions": [
    {
      "term": "Term",
      "definition": "Definition"
    }
  ]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.5,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate revision sheets. Please try again.');
  }
};

/**
 * Generate mock paper
 */
export const generateMockPaper = async (userContext, styleProfile, contextData, shortCount, longCount) => {
  const basePrompt = buildBasePrompt(userContext, styleProfile, contextData);
  
  const prompt = `${basePrompt}

Generate a mock exam paper.

Pattern:
- Short Answer Questions: ${shortCount}
- Long Answer Questions: ${longCount}

Requirements:
1. Questions should align with syllabus
2. Follow patterns from PYQs
3. Include outline answers in ${styleProfile.tone} tone
4. Follow ${styleProfile.sections.join(', ')} structure for answers

Output format as JSON:
{
  "questions": [
    {
      "type": "short",
      "question": "Question text",
      "answer": "Answer outline..."
    },
    {
      "type": "long",
      "question": "Question text",
      "answer": "Detailed answer..."
    }
  ]
}`;

  try {
    const completion = await chat([
      { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
      { role: "user", content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate mock paper. Please try again.');
  }
};

