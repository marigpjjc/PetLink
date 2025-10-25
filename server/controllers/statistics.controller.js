// Este archivo maneja las estadísticas de los perros

import dogsService from '../db/dogs.db.js';

// GET - Traer estadísticas de un perro
const getDogStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Petición recibida: GET /api/statistics/' + id);
    
    const result = await dogsService.getDogById(id);
    
    if (!result.success) {
      console.log('Perro no encontrado');
      return res.status(404).json({ error: 'Perro no encontrado' });
    }
    
    const dog = result.data;
    
    // Extraer solo las estadísticas
    const statistics = {
      id: dog.id,
      name: dog.name,
      food_level: dog.food_level || 0,
      health_level: dog.health_level || 0,
      wellbeing_level: dog.wellbeing_level || 0,
      affection_level: dog.affection_level || 0
    };
    
    console.log('Estadísticas enviadas:', statistics);
    res.status(200).json(statistics);
    
  } catch (error) {
    console.error('Error en getDogStatistics:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  getDogStatistics
};