import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: styleProfile.maxWordCount ? Math.min(styleProfile.maxWordCount * 2, 4000) : 3000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate notes. Please try again.');
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
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

