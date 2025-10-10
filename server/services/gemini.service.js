// server/services/gemini.service.js
// Este archivo maneja la integración con Google Gemini AI

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar Gemini con tu API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎨 Generar descripción mejorada de un perro usando IA
const generateDogDescription = async (dogData) => {
  try {
    console.log('🤖 Generando descripción con Gemini...');
    
    // Usar el modelo de texto de Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Genera una descripción atractiva y emotiva en español para un perro en adopción con estos datos:
      - Nombre: ${dogData.name}
      - Raza: ${dogData.breed || 'Mestizo'}
      - Edad: ${dogData.age || 'Desconocida'}
      - Tamaño: ${dogData.size || 'Mediano'}
      
      La descripción debe ser cálida, invitar a la adopción y resaltar las cualidades del perro.
      Máximo 3 párrafos.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Descripción generada exitosamente');
    return {
      success: true,
      description: text
    };
    
  } catch (error) {
    console.error('❌ Error al generar descripción:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 🎨 Generar sugerencias de necesidades para un perro
const generateNeedsSuggestions = async (dogData) => {
  try {
    console.log('🤖 Generando sugerencias de necesidades con Gemini...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Basándote en este perro:
      - Nombre: ${dogData.name}
      - Raza: ${dogData.breed || 'Mestizo'}
      - Edad: ${dogData.age || 'Desconocida'}
      - Tamaño: ${dogData.size || 'Mediano'}
      
      Sugiere 5 necesidades importantes que este perro podría tener.
      Formato: solo lista con viñetas, nombres cortos y específicos.
      Ejemplo: "Vacuna antirrábica", "Alimento premium", etc.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Sugerencias generadas exitosamente');
    return {
      success: true,
      suggestions: text
    };
    
  } catch (error) {
    console.error('❌ Error al generar sugerencias:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 🎨 Generar recomendaciones de accesorios
const generateAccessoryRecommendations = async (dogData) => {
  try {
    console.log('🤖 Generando recomendaciones de accesorios con Gemini...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Para un perro con estas características:
      - Tamaño: ${dogData.size || 'Mediano'}
      - Edad: ${dogData.age || 'Adulto'}
      - Raza: ${dogData.breed || 'Mestizo'}
      
      Recomienda 6 accesorios esenciales que necesitaría.
      Formato: lista simple separada por comas.
      Ejemplo: "Collar ajustable, Correa de 1.5m, Plato de acero inoxidable"
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Recomendaciones generadas exitosamente');
    return {
      success: true,
      recommendations: text
    };
    
  } catch (error) {
    console.error('❌ Error al generar recomendaciones:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generateDogDescription,
  generateNeedsSuggestions,
  generateAccessoryRecommendations
};