// Este archivo RECIBE las peticiones y llama al servicio

import donationsService from '../db/donation.js';
import { emitNewDonation } from '../utils/socket-helper.js';

//  GET - Traer todas las donaciones
const getAllDonations = async (req, res) => {
  try {
    console.log(' Petición recibida: GET /api/donations');
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

//  GET - Traer una donación por ID
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(' Petición recibida: GET /api/donations/' + id);
    const result = await donationsService.getDonationById(id);
    
    if (result.success) {
      console.log('Donación encontrada:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('Donación no encontrada');
      res.status(404).json({ error: 'Donación no encontrada' });
    }
  } catch (error) {
    console.error('Error en getDonationById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  POST - Crear una nueva donación
const createDonation = async (req, res) => {
  try {
    const donationData = req.body;
    console.log(' Petición recibida: POST /api/donations', donationData);
    const result = await donationsService.createDonation(donationData);
    
    if (result.success) {
      console.log('Donación creada:', result.data);
      
      // EMITIR EVENTO DE WEBSOCKET
      emitNewDonation(result.data);
      
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

//  PUT - Actualizar una donación
const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donationData = req.body;
    console.log(' Petición recibida: PUT /api/donations/' + id, donationData);
    const result = await donationsService.updateDonation(id, donationData);
    
    if (result.success) {
      console.log('Donación actualizada:', result.data);
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

//  DELETE - Eliminar una donación
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(' Petición recibida: DELETE /api/donations/' + id);
    const result = await donationsService.deleteDonation(id);
    
    if (result.success) {
      console.log('Donación eliminada');
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

//  GET - Traer donaciones por padrino
const getDonationsByPadrino = async (req, res) => {
  try {
    const { id_padrino } = req.params;
    console.log(' Petición recibida: GET /api/donations/padrino/' + id_padrino);
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

//  GET - Traer donaciones por perro
const getDonationsByDog = async (req, res) => {
  try {
    const { id_dog } = req.params;
    console.log(' Petición recibida: GET /api/donations/dog/' + id_dog);
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

//  GET - Traer donaciones por necesidad
const getDonationsByNeed = async (req, res) => {
  try {
    const { id_need } = req.params;
    console.log(' Petición recibida: GET /api/donations/need/' + id_need);
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

//  GET - Traer donaciones por estado
const getDonationsByState = async (req, res) => {
  try {
    const { state } = req.params;
    console.log(' Petición recibida: GET /api/donations/state/' + state);
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