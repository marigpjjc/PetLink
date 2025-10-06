// server/services/dogs.service.js
// Este archivo habla DIRECTAMENTE con Supabase

const supabase = require('./supabase.service');

// 🐕 Traer TODOS los perritos
const getAllDogs = async () => {
  try {
    const { data, error } = await supabase
      .from('Dogs')  // Nombre de tu tabla en Supabase
      .select('*');  // Traer todas las columnas
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Traer UN perrito por ID
const getDogById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .select('*')
      .eq('id', id)  // Buscar donde el id sea igual al que nos dieron
      .single();     // Solo queremos UN resultado
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Crear un NUEVO perrito
const createDog = async (dogData) => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .insert([dogData])  // Insertar la información del perrito
      .select();          // Devolver el perrito creado
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Actualizar un perrito existente
const updateDog = async (id, dogData) => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .update(dogData)    // Actualizar con nueva información
      .eq('id', id)       // Solo el perrito con este ID
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Eliminar un perrito
const deleteDog = async (id) => {
  try {
    const { error } = await supabase
      .from('Dogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Perrito eliminado correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Exportar todas las funciones para usarlas en el controlador
export default  {
  getAllDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog
};