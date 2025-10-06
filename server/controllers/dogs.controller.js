// server/controllers/dogs.controller.js
// Este archivo RECIBE las peticiones y llama al servicio

const dogsService = require('../services/dogs.service');

// 🐕 GET - Traer todos los perritos
const getAllDogs = async (req, res) => {
  try {
    const result = await dogsService.getAllDogs();
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 GET - Traer un perrito por ID
const getDogById = async (req, res) => {
  try {
    const { id } = req.params;  // Sacar el ID de la URL
    const result = await dogsService.getDogById(id);
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ error: 'Perrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 POST - Crear un nuevo perrito
const createDog = async (req, res) => {
  try {
    const dogData = req.body;  // Sacar la información del cuerpo de la petición
    const result = await dogsService.createDog(dogData);
    
    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 PUT - Actualizar un perrito
const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dogData = req.body;
    const result = await dogsService.updateDog(id, dogData);
    
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐕 DELETE - Eliminar un perrito
const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dogsService.deleteDog(id);
    
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Exportar todas las funciones


export default {
    getAllDogs,
    getDogById,
    createDog,
    updateDog,
    deleteDog
};
