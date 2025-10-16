// Este archivo RECIBE las peticiones y llama al servicio

// 🔧 CORRECCIÓN: La ruta correcta desde controllers hacia db
import dogsService from '../db/dogs.db.js';

// 🐕 GET - Traer todos los perritos
const getAllDogs = async (req, res) => {
  try {
    console.log('🔥 Petición recibida: GET /api/dogs');
    const result = await dogsService.getAllDogs();
    
    if (result.success) {
      console.log('✅ Datos enviados:', result.data.length, 'perritos');
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAllDogs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 GET - Traer un perrito por ID
const getDogById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔥 Petición recibida: GET /api/dogs/' + id);
    const result = await dogsService.getDogById(id);
    
    if (result.success) {
      console.log('✅ Perrito encontrado:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Perrito no encontrado');
      res.status(404).json({ error: 'Perrito no encontrado' });
    }
  } catch (error) {
    console.error('❌ Error en getDogById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🔍 GET - Buscar perritos por nombre (NUEVO)
const searchDogsByName = async (req, res) => {
  try {
    const { name } = req.params;
    console.log('🔥 Petición recibida: GET /api/dogs/search/' + name);
    
    // Traer todos los perros
    const result = await dogsService.getAllDogs();
    
    if (!result.success) {
      console.log('❌ Error:', result.error);
      return res.status(400).json({ error: result.error });
    }
    
    // Filtrar por nombre (búsqueda insensible a mayúsculas/minúsculas)
    const searchTerm = name.toLowerCase();
    const filteredDogs = result.data.filter(dog => 
      dog.name.toLowerCase().includes(searchTerm)
    );
    
    console.log('✅ Perritos encontrados:', filteredDogs.length);
    res.status(200).json(filteredDogs);
    
  } catch (error) {
    console.error('❌ Error en searchDogsByName:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 POST - Crear un nuevo perrito
const createDog = async (req, res) => {
  try {
    const dogData = req.body;
    console.log('🔥 Petición recibida: POST /api/dogs', dogData);
    const result = await dogsService.createDog(dogData);
    
    if (result.success) {
      console.log('✅ Perrito creado:', result.data);
      res.status(201).json(result.data);
    } else {
      console.log('❌ Error al crear:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en createDog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 PUT - Actualizar un perrito
const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dogData = req.body;
    console.log('🔥 Petición recibida: PUT /api/dogs/' + id, dogData);
    const result = await dogsService.updateDog(id, dogData);
    
    if (result.success) {
      console.log('✅ Perrito actualizado:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error al actualizar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en updateDog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 DELETE - Eliminar un perrito
const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔥 Petición recibida: DELETE /api/dogs/' + id);
    const result = await dogsService.deleteDog(id);
    
    if (result.success) {
      console.log('✅ Perrito eliminado');
      res.status(200).json({ message: result.message });
    } else {
      console.log('❌ Error al eliminar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en deleteDog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  getAllDogs,
  getDogById,
  searchDogsByName,  // NUEVO
  createDog,
  updateDog,
  deleteDog
};