// padrino-app/services/api.js
const API_URL = 'http://localhost:5050/api';

// Traer todos los perros
const getAllDogs = async () => {
  try {
    const response = await fetch(`${API_URL}/dogs`);
    if (!response.ok) throw new Error('Error al traer los perros');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Traer un perro por ID
const getDogById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/dogs/${id}`);
    if (!response.ok) throw new Error('Error al traer el perro');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Buscar perros por nombre
const searchDogsByName = async (name) => {
  try {
    const response = await fetch(`${API_URL}/dogs/search/${name}`);
    if (!response.ok) throw new Error('Error al buscar perros');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Traer las necesidades de un perro
const getNeedsByDogId = async (dogId) => {
  try {
    const response = await fetch(`${API_URL}/needs/dog/${dogId}`);
    if (!response.ok) throw new Error('Error al traer necesidades');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export { getAllDogs, getDogById, searchDogsByName, getNeedsByDogId };