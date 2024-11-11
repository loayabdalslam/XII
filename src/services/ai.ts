import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateCode(prompt: string, context?: string) {
  try {
    const result = await model.generateContent(`
      You are an expert TypeScript developer. Generate clean, maintainable, and type-safe code based on the following requirements:
      
      ${context ? `Context: ${context}\n` : ''}
      Requirements: ${prompt}
      
      Important: Return ONLY the raw code without any markdown code blocks, comments, or explanations.
      Do not include \`\`\`typescript or \`\`\` markers.
    `);

    const response = await result.response;
    return response.text().replace(/```typescript|```/g, '').trim();
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

export function generateModelPrompt(interfaceCode: string) {
  return `
    Given this TypeScript interface:
    ${interfaceCode}
    
    Generate a complete model class that:
    - Implements CRUD operations
    - Includes data persistence
    - Has proper error handling
    - Is fully typed
    - Uses modern TypeScript features
    - Follows best practices
    
    Return only the implementation code without any markdown formatting.
  `;
}

export function generateControllerPrompt(modelCode: string, interfaceCode: string) {
  return `
    Given this model implementation:
    ${modelCode}
    
    And this interface:
    ${interfaceCode}
    
    Generate a controller class that:
    - Connects the model with views
    - Implements all necessary handlers
    - Includes error handling
    - Uses proper typing
    - Follows SOLID principles
    
    Return only the implementation code without any markdown formatting.
  `;
}

export function generateViewPrompt(controllerCode: string, interfaceCode: string) {
  return `
    Given this controller implementation:
    ${controllerCode}
    
    And this interface:
    ${interfaceCode}
    
    Generate a React functional component that:
    - Uses modern React patterns
    - Implements proper form handling
    - Has a clean, responsive UI using Tailwind CSS
    - Includes loading and error states
    - Uses proper TypeScript types
    
    Return only the implementation code without any markdown formatting.
  `;
}