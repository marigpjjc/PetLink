// Este archivo RECIBE las peticiones y llama al servicio

import needsService from '../db/needs.js';
import { emitNewNeed, emitUrgentNeed } from '../utils/socket-helper.js';

// 🐾 GET - Traer todas las necesidades
const getAllNeeds = async (req, res) => {
  try {
    console.log('🔥 Petición recibida: GET /api/needs');
    const result = await needsService.getAllNeeds();
    
    if (result.success) {
      console.log('✅ Datos enviados:', result.data.length, 'necesidades');
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAllNeeds:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐾 GET - Traer una necesidad por ID
const getNeedById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔥 Petición recibida: GET /api/needs/' + id);
    const result = await needsService.getNeedById(id);
    
    if (result.success) {
      console.log('✅ Necesidad encontrada:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Necesidad no encontrada');
      res.status(404).json({ error: 'Necesidad no encontrada' });
    }
  } catch (error) {
    console.error('❌ Error en getNeedById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐾 GET - Traer necesidades por ID de perro
const getNeedsByDogId = async (req, res) => {
  try {
    const { dogId } = req.params;
    console.log('🔥 Petición recibida: GET /api/needs/dog/' + dogId);
    const result = await needsService.getNeedsByDogId(dogId);
    
    if (result.success) {
      console.log('✅ Necesidades encontradas para el perro:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getNeedsByDogId:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐾 GET - Traer necesidades por estado
const getNeedsByState = async (req, res) => {
  try {
    const { state } = req.params;
    console.log('🔥 Petición recibida: GET /api/needs/state/' + state);
    const result = await needsService.getNeedsByState(state);
    
    if (result.success) {
      console.log('✅ Necesidades encontradas con estado', state + ':', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getNeedsByState:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐾 POST - Crear una nueva necesidad
const createNeed = async (req, res) => {
  try {
    const needData = req.body;
    console.log('🔥 Petición recibida: POST /api/needs', needData);
    const result = await needsService.createNeed(needData);
    
    if (result.success) {
      console.log('✅ Necesidad creada:', result.data);
      
      // 🔌 EMITIR EVENTO DE WEBSOCKET
      // Si la necesidad es urgente, emitir evento especial
      if (needData.urgent || needData.state === 'urgent') {
        emitUrgentNeed(result.data);
      } else {
        emitNewNeed(result.data);
      }
      
      res.status(201).json(result.data);
    } else {
      console.log('❌ Error al crear:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en createNeed:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐾 PUT - Actualizar una necesidad
const updateNeed = async (req, res) => {
  try {
    const { id } = req.params;
    const needData = req.body;
    console.log('🔥 Petición recibida: PUT /api/needs/' + id, needData);
    const result = await needsService.updateNeed(id, needData);
    
    if (result.success) {
      console.log('✅ Necesidad actualizada:', result.data);
      
      // 🔌 Si se actualiza a urgente, emitir evento
      if (needData.state === 'urgent') {
        emitUrgentNeed(result.data);
      }
      
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error al actualizar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en updateNeed:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🐾 DELETE - Eliminar una necesidad
const deleteNeed = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔥 Petición recibida: DELETE /api/needs/' + id);
    const result = await needsService.deleteNeed(id);
    
    if (result.success) {
      console.log('✅ Necesidad eliminada');
      res.status(200).json({ message: result.message });
    } else {
      console.log('❌ Error al eliminar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en deleteNeed:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  getAllNeeds,
  getNeedById,
  getNeedsByDogId,
  getNeedsByState,
  createNeed,
  updateNeed,
  deleteNeed
};