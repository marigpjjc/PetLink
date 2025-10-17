// Este archivo tiene las funciones para hablar con el backend

const API_URL = 'http://localhost:5050/api';

// 🐕 Función para traer TODOS los perritos
export async function getAllDogs() {
  try {
    const response = await fetch(`${API_URL}/dogs`);
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar los perritos 😢');
    }
    
    const dogs = await response.json();
    return dogs;
  } catch (error) {
    console.error('Error al traer perritos:', error);
    return [];
  }
}

// 🐕 Función para traer UN perrito por su ID
export async function getDogById(id) {
  try {
    const response = await fetch(`${API_URL}/dogs/${id}`);
    
    if (!response.ok) {
      throw new Error('No se pudo cargar el perrito 😢');
    }
    
    const dog = await response.json();
    return dog;
  } catch (error) {
    console.error('Error al traer perrito:', error);
    return null;
  }
}

// Traer las necesidades de un perrito
export async function getDogNeeds(dogId) {
  try {
    const response = await fetch(`${API_URL}/needs/dog/${dogId}`);
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar las necesidades');
    }
    
    const needs = await response.json();
    return needs;
  } catch (error) {
    console.error('Error al traer necesidades:', error);
    return [];
  }
}

// Traer las estadísticas de un perrito
export async function getDogStatistics(dogId) {
  try {
    const response = await fetch(`${API_URL}/dogs/${dogId}/statistics`);
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar las estadísticas');
    }
    
    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error('Error al traer estadísticas:', error);
    return null;
  }
}