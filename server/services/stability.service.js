// server/services/stability.service.js
// Este archivo genera imágenes usando Stability AI

import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/core';

// 🎨 Generar imagen de un perro con un accesorio
const generateDogWithAccessoryImage = async (dogData, accessoryData) => {
  try {
    console.log('🎨 Generando imagen con Stability AI...');
    console.log('📝 Datos del perro:', dogData);
    console.log('📝 Datos del accesorio:', accessoryData);
    
    // Crear el prompt en inglés
    const prompt = `A photorealistic portrait of a ${dogData.breed || 'dog'} 
wearing a ${accessoryData.category || 'accessory'} ${accessoryData.description || ''}.
The dog is ${dogData.size || 'medium'} sized, ${dogData.age || 'adult'} age.
Professional pet photography, natural outdoor lighting, happy and friendly expression.
The ${accessoryData.category} should be clearly visible and well-fitted.
High quality, detailed, 4K resolution.`;
    
    console.log('📝 Prompt:', prompt);
    
    // Crear FormData para la petición
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'jpeg');
    formData.append('aspect_ratio', '1:1');
    
    // Hacer la petición a Stability AI
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer'
    });
    
    // Convertir la imagen a Base64
    const imageBase64 = Buffer.from(response.data).toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    console.log('✅ Imagen generada exitosamente con Stability AI');
    
    return {
      success: true,
      imageUrl: imageDataUrl,
      imageBase64: imageBase64,
      prompt: prompt,
      message: 'Imagen generada con éxito'
    };
    
  } catch (error) {
    console.error('❌ Error al generar imagen:', error.message);
    
    let errorMessage = error.message;
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data?.toString());
      
      if (error.response.status === 401) {
        errorMessage = 'API Key inválida. Verifica tu STABILITY_API_KEY en .env';
      } else if (error.response.status === 402) {
        errorMessage = 'Sin créditos. Necesitas agregar créditos en Stability AI.';
      } else if (error.response.status === 400) {
        errorMessage = 'Prompt inválido o parámetros incorrectos.';
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// 🎨 Generar solo imagen de un perro
const generateDogImage = async (dogData) => {
  try {
    console.log('🎨 Generando imagen de perro con Stability AI...');
    
    const prompt = `A photorealistic portrait of a ${dogData.breed || 'dog'}.
${dogData.size || 'Medium'} sized, ${dogData.age || 'adult'} age.
Friendly and adorable expression.
Professional pet photography, natural lighting, outdoor setting.
High quality, detailed fur texture, 4K resolution.`;
    
    console.log('📝 Prompt:', prompt);
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'jpeg');
    formData.append('aspect_ratio', '1:1');
    
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer'
    });
    
    const imageBase64 = Buffer.from(response.data).toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    console.log('✅ Imagen de perro generada');
    
    return {
      success: true,
      imageUrl: imageDataUrl,
      imageBase64: imageBase64,
      prompt: prompt,
      message: 'Imagen generada con éxito'
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    let errorMessage = error.message;
    if (error.response?.status === 401) {
      errorMessage = 'API Key inválida.';
    } else if (error.response?.status === 402) {
      errorMessage = 'Sin créditos en Stability AI.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// 🎨 Generar imagen de un accesorio
const generateAccessoryImage = async (accessoryData) => {
  try {
    console.log('🎨 Generando imagen de accesorio...');
    
    const prompt = `A high-quality product photograph of a pet ${accessoryData.category || 'accessory'}.
${accessoryData.description || 'Modern design'}.
Professional product photography, white background, studio lighting.
Detailed texture, commercial quality, sharp focus, 4K resolution.`;
    
    console.log('📝 Prompt:', prompt);
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'jpeg');
    formData.append('aspect_ratio', '1:1');
    
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer'
    });
    
    const imageBase64 = Buffer.from(response.data).toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    console.log('✅ Imagen de accesorio generada');
    
    return {
      success: true,
      imageUrl: imageDataUrl,
      imageBase64: imageBase64,
      prompt: prompt,
      message: 'Imagen generada con éxito'
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    let errorMessage = error.message;
    if (error.response?.status === 401) {
      errorMessage = 'API Key inválida.';
    } else if (error.response?.status === 402) {
      errorMessage = 'Sin créditos en Stability AI.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// 🎨 Generar imagen con prompt personalizado
const generateCustomImage = async (customPrompt) => {
  try {
    console.log('🎨 Generando imagen personalizada...');
    console.log('📝 Prompt:', customPrompt);
    
    const formData = new FormData();
    formData.append('prompt', customPrompt);
    formData.append('output_format', 'jpeg');
    formData.append('aspect_ratio', '1:1');
    
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer'
    });
    
    const imageBase64 = Buffer.from(response.data).toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    console.log('✅ Imagen personalizada generada');
    
    return {
      success: true,
      imageUrl: imageDataUrl,
      imageBase64: imageBase64,
      prompt: customPrompt,
      message: 'Imagen generada con éxito'
    };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    let errorMessage = error.message;
    if (error.response?.status === 401) {
      errorMessage = 'API Key inválida.';
    } else if (error.response?.status === 402) {
      errorMessage = 'Sin créditos en Stability AI.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export default {
  generateDogWithAccessoryImage,
  generateDogImage,
  generateAccessoryImage,
  generateCustomImage
};