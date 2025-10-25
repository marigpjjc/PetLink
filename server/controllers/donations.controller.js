// Este archivo RECIBE las peticiones y llama al servicio

import donationsService from '../db/donation.js';
import needsService from '../db/needs.js';
import dogsService from '../db/dogs.db.js';
import { emitNewDonation, emitStatsUpdated } from '../utils/socket-helper.js';

// GET - Traer todas las donaciones
const getAllDonations = async (req, res) => {
  try {
    console.log('Peticion recibida: GET /api/donations');
    const result = await donationsService.getAllDonations();
    
    if (result.success) {
      console.log('Datos enviados:', result.data.length, 'donaciones');
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getAllDonations:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET - Traer una donacion por ID
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Peticion recibida: GET /api/donations/' + id);
    const result = await donationsService.getDonationById(id);
    
    if (result.success) {
      console.log('Donacion encontrada:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('Donacion no encontrada');
      res.status(404).json({ error: 'Donacion no encontrada' });
    }
  } catch (error) {
    console.error('Error en getDonationById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST - Crear una nueva donacion
const createDonation = async (req, res) => {
  try {
    const donationData = req.body;
    console.log('Peticion recibida: POST /api/donations', donationData);
    
    // Crear la donacion
    const result = await donationsService.createDonation(donationData);
    
    if (result.success) {
      console.log('Donacion creada:', result.data);
      
      // Emitir evento de nueva donacion
      emitNewDonation(result.data);
      
      // ACTUALIZAR ESTADISTICAS DEL PERRO
      try {
        // Obtener la categoria de la necesidad
        const needResult = await needsService.getNeedById(donationData.id_need);
        
        if (needResult.success) {
          const category = needResult.data.category;
          console.log('Categoria de necesidad:', category);
          
          // Actualizar estadisticas del perro
          const statsResult = await dogsService.updateDogStatistics(
            donationData.id_dog,
            category
          );
          
          if (statsResult.success) {
            console.log('Estadisticas actualizadas exitosamente');
            
            // Emitir evento de estadisticas actualizadas via WebSocket
            emitStatsUpdated(
              donationData.id_dog,
              statsResult.data,
              statsResult.updates
            );
          }
        }
      } catch (statsError) {
        console.error('Error al actualizar estadisticas:', statsError);
        // No fallar la donacion si falla la actualizacion de stats
      }
      
      res.status(201).json(result.data);
    } else {
      console.log('Error al crear:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en createDonation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT - Actualizar una donacion
const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donationData = req.body;
    console.log('Peticion recibida: PUT /api/donations/' + id, donationData);
    const result = await donationsService.updateDonation(id, donationData);
    
    if (result.success) {
      console.log('Donacion actualizada:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('Error al actualizar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en updateDonation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE - Eliminar una donacion
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Peticion recibida: DELETE /api/donations/' + id);
    const result = await donationsService.deleteDonation(id);
    
    if (result.success) {
      console.log('Donacion eliminada');
      res.status(200).json({ message: result.message });
    } else {
      console.log('Error al eliminar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en deleteDonation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET - Traer donaciones por padrino
const getDonationsByPadrino = async (req, res) => {
  try {
    const { id_padrino } = req.params;
    console.log('Peticion recibida: GET /api/donations/padrino/' + id_padrino);
    const result = await donationsService.getDonationsByPadrino(id_padrino);
    
    if (result.success) {
      console.log('Donaciones encontradas:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getDonationsByPadrino:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET - Traer donaciones por perro
const getDonationsByDog = async (req, res) => {
  try {
    const { id_dog } = req.params;
    console.log('Peticion recibida: GET /api/donations/dog/' + id_dog);
    const result = await donationsService.getDonationsByDog(id_dog);
    
    if (result.success) {
      console.log('Donaciones encontradas:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getDonationsByDog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET - Traer donaciones por necesidad
const getDonationsByNeed = async (req, res) => {
  try {
    const { id_need } = req.params;
    console.log('Peticion recibida: GET /api/donations/need/' + id_need);
    const result = await donationsService.getDonationsByNeed(id_need);
    
    if (result.success) {
      console.log('Donaciones encontradas:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getDonationsByNeed:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET - Traer donaciones por estado
const getDonationsByState = async (req, res) => {
  try {
    const { state } = req.params;
    console.log('Peticion recibida: GET /api/donations/state/' + state);
    const result = await donationsService.getDonationsByState(state);
    
    if (result.success) {
      console.log('Donaciones encontradas con estado', state + ':', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getDonationsByState:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  getAllDonations,
  getDonationById,
  getDonationsByPadrino,    
  getDonationsByDog,       
  getDonationsByNeed,       
  getDonationsByState,      
  createDonation,
  updateDonation,
  deleteDonation
};