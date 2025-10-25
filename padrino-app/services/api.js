// Este archivo se comunica con el BACKEND (trae y envia datos)

const API_URL = 'http://localhost:5050/api';

// Funcion helper para hacer peticiones
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la peticion:', error);
    throw error;
  }
}

// PERROS (Dogs)

// Traer todos los perros
function getAllDogs() {
  return fetchAPI('/dogs');
}

// Traer un perro especifico
function getDogById(id) {
  return fetchAPI(`/dogs/${id}`);
}

// Buscar perros por nombre
function searchDogsByName(name) {
  return fetchAPI(`/dogs/search/${name}`);
}

// CITAS (Appointments)

// Crear una cita
function createAppointment(appointmentData) {
  return fetchAPI('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

// Traer citas de un perro
function getAppointmentsByDog(dogId) {
  return fetchAPI(`/appointments/dog/${dogId}`);
}

// Traer citas de un padrino
function getAppointmentsByPadrino(padrinoId) {
  return fetchAPI(`/appointments/padrino/${padrinoId}`);
}

// ACCESORIOS (Accessories)

// Traer todos los accesorios
function getAllAccessories() {
  return fetchAPI('/accessories');
}

// Traer un accesorio especifico
function getAccessoryById(id) {
  return fetchAPI(`/accessories/${id}`);
}

// DONACIONES (Donations)

// Crear una donacion
function createDonation(donationData) {
  return fetchAPI('/donations', {
    method: 'POST',
    body: JSON.stringify(donationData),
  });
}

// Traer donaciones de un perro
function getDonationsByDog(dogId) {
  return fetchAPI(`/donations/dog/${dogId}`);
}

// NECESIDADES (Needs)

// Traer necesidades de un perro
function getNeedsByDog(dogId) {
  return fetchAPI(`/needs/dog/${dogId}`);
}

// Traer una necesidad especifica
function getNeedById(id) {
  return fetchAPI(`/needs/${id}`);
}

// Traer estadísticas de un perro
function getDogStatistics(dogId) {
  return fetchAPI(`/statistics/${dogId}`);
}

// EXPORTAR todas las funciones
export {
  getAllDogs,
  getDogById,
  searchDogsByName,
  createAppointment,
  getAppointmentsByDog,
  getAppointmentsByPadrino,
  getAllAccessories,
  getAccessoryById,
  createDonation,
  getDonationsByDog,
  getNeedsByDog,
  getNeedById,
  getDogStatistics
};