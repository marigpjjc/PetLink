// Este archivo sube imágenes a Supabase Storage

import supabase from './supabase.service.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Subir imagen en base64 a Supabase Storage
 * @param {string} base64Image - Imagen en formato base64 (sin el prefijo data:image/...)
 * @param {string} fileName - Nombre del archivo (opcional, se genera automático si no se envía)
 * @param {string} bucket - Nombre del bucket (por defecto: 'ai-generated-images')
 * @returns {object} { success, publicUrl, path, error }
 */
const uploadBase64Image = async (base64Image, fileName = null, bucket = 'ai-generated-images') => {
  try {
    console.log('📤 Subiendo imagen a Supabase Storage...');
    
    // Generar nombre único si no se proporciona
    if (!fileName) {
      const timestamp = Date.now();
      const uniqueId = uuidv4().slice(0, 8);
      fileName = `dog-accessory-${timestamp}-${uniqueId}.jpg`;
    }
    
    // Convertir base64 a Buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Subir a Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Error al subir imagen:', error.message);
      throw error;
    }
    
    console.log('✅ Imagen subida:', data.path);
    
    // Obtener URL pública
    const { data: publicUrlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log('🔗 URL pública:', publicUrlData.publicUrl);
    
    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      path: data.path,
      bucket: bucket,
      fileName: fileName
    };
    
  } catch (error) {
    console.error('❌ Error en uploadBase64Image:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Eliminar imagen de Supabase Storage
 * @param {string} path - Ruta del archivo en Storage
 * @param {string} bucket - Nombre del bucket
 */
const deleteImage = async (path, bucket = 'ai-generated-images') => {
  try {
    console.log('🗑️ Eliminando imagen:', path);
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('❌ Error al eliminar:', error.message);
      throw error;
    }
    
    console.log('✅ Imagen eliminada');
    
    return {
      success: true,
      message: 'Imagen eliminada correctamente'
    };
    
  } catch (error) {
    console.error('❌ Error en deleteImage:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Listar todas las imágenes de un bucket
 * @param {string} bucket - Nombre del bucket
 * @param {string} folder - Carpeta específica (opcional)
 */
const listImages = async (bucket = 'ai-generated-images', folder = '') => {
  try {
    console.log('📋 Listando imágenes del bucket:', bucket);
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      console.error('❌ Error al listar:', error.message);
      throw error;
    }
    
    console.log(`✅ ${data.length} imágenes encontradas`);
    
    return {
      success: true,
      images: data,
      count: data.length
    };
    
  } catch (error) {
    console.error('❌ Error en listImages:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtener URL pública de una imagen
 * @param {string} path - Ruta del archivo
 * @param {string} bucket - Nombre del bucket
 */
const getPublicUrl = (path, bucket = 'ai-generated-images') => {
  try {
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
    
    return {
      success: true,
      publicUrl: data.publicUrl
    };
    
  } catch (error) {
    console.error('❌ Error en getPublicUrl:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  uploadBase64Image,
  deleteImage,
  listImages,
  getPublicUrl
};