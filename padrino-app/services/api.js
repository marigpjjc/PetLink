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

// Crear una cita
const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    if (!response.ok) throw new Error('Error al crear la cita');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Traer todos los accesorios
const getAllAccessories = async () => {
  try {
    const response = await fetch(`${API_URL}/accessories`);
    if (!response.ok) throw new Error('Error al traer accesorios');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Traer un accesorio por ID
const getAccessoryById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/accessories/${id}`);
    if (!response.ok) throw new Error('Error al traer el accesorio');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Traer las imagenes de IA de un perro
const getIAImagesByDogId = async (dogId) => {
  try {
    const response = await fetch(`${API_URL}/ia-images/dog/${dogId}`);
    if (!response.ok) throw new Error('Error al traer imagenes IA');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Crear una nueva imagen de IA
const createIAImage = async (imageData) => {
  try {
    const response = await fetch(`${API_URL}/ia-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    });
    if (!response.ok) throw new Error('Error al crear imagen IA');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Generar imagen del perro con accesorio usando Stability AI
const generateDogWithAccessory = async (dogData, accessoryData) => {
  try {
    const response = await fetch(`${API_URL}/ai/generate-dog-with-accessory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dogData, accessoryData })
    });
    if (!response.ok) throw new Error('Error al generar imagen');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Crear una donacion
const createDonation = async (donationData) => {
  try {
    console.log('Enviando donacion:', donationData);
    
    const response = await fetch(`${API_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donationData)
    });
    
    console.log('Status de respuesta:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al crear la donacion: ' + JSON.stringify(errorData));
    }
    
    const data = await response.json();
    console.log('Donacion creada exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error completo:', error);
    return null;
  }
};

// Traer una necesidad por ID
const getNeedById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/needs/${id}`);
    if (!response.ok) throw new Error('Error al traer la necesidad');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export { 
  getAllDogs, 
  getDogById, 
  searchDogsByName, 
  getNeedsByDogId,
  createAppointment,
  getAllAccessories,
  getAccessoryById,
  generateDogWithAccessory,
  createDonation,
  getNeedById
};