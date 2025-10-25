// Este archivo es el q RECIBE las peticiones y llama al servicio

import accessoriesService from '../db/accessories.js';
import { emitAccessoryPurchase } from '../utils/socket-helper.js'

//GET - Traer todos los accesorios
const getAllAccessories = async (req, res) => {
  try {
    console.log('Petición recibida: GET /api/accessories');
    const result = await accessoriesService.getAllAccessories();
    
    if (result.success) {
      console.log('Datos enviados:', result.data.length, 'accesorios');
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getAllAccessories:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Traer un accesorio por ID
const getAccessoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Petición recibida: GET /api/accessories/' + id);
    const result = await accessoriesService.getAccessoryById(id);
    
    if (result.success) {
      console.log('Accesorio encontrado:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('Accesorio no encontrado');
      res.status(404).json({ error: 'Accesorio no encontrado' });
    }
  } catch (error) {
    console.error('Error en getAccessoryById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Traer accesorios por ID de perro
const getAccessoriesByDogId = async (req, res) => {
  try {
    const { dogId } = req.params;
    console.log('Petición recibida: GET /api/accessories/dog/' + dogId);
    const result = await accessoriesService.getAccessoriesByDogId(dogId);
    
    if (result.success) {
      console.log('Accesorios encontrados para el perro:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getAccessoriesByDogId:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Traer accesorios por ID de usuario
const getAccessoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Petición recibida: GET /api/accessories/user/' + userId);
    const result = await accessoriesService.getAccessoriesByUserId(userId);
    
    if (result.success) {
      console.log('Accesorios encontrados para el usuario:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getAccessoriesByUserId:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//GET - Traer accesorios por categoría
const getAccessoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log('Petición recibida: GET /api/accessories/category/' + category);
    const result = await accessoriesService.getAccessoriesByCategory(category);
    
    if (result.success) {
      console.log('Accesorios encontrados en categoría', category + ':', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en getAccessoriesByCategory:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//POST - Crear un nuevo accesorio (comprar)
const createAccessory = async (req, res) => {
  try {
    const accessoryData = req.body;
    console.log('Petición recibida: POST /api/accessories', accessoryData);
    const result = await accessoriesService.createAccessory(accessoryData);
    
    if (result.success) {
      console.log('Accesorio creado:', result.data);
      
      // EMITIR EVENTO DE WEBSOCKET
      emitAccessoryPurchase(result.data);
      
      res.status(201).json(result.data);
    } else {
      console.log('Error al crear:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en createAccessory:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//PUT - Actualizar un accesorio
const updateAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const accessoryData = req.body;
    console.log('Petición recibida: PUT /api/accessories/' + id, accessoryData);
    const result = await accessoriesService.updateAccessory(id, accessoryData);
    
    if (result.success) {
      console.log('Accesorio actualizado:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('Error al actualizar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en updateAccessory:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//DELETE - Eliminar un accesorio
const deleteAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Petición recibida: DELETE /api/accessories/' + id);
    const result = await accessoriesService.deleteAccessory(id);
    
    if (result.success) {
      console.log('Accesorio eliminado');
      res.status(200).json({ message: result.message });
    } else {
      console.log('Error al eliminar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error en deleteAccessory:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  getAllAccessories,
  getAccessoryById,
  getAccessoriesByDogId,
  getAccessoriesByUserId,
  getAccessoriesByCategory,
  createAccessory,
  updateAccessory,
  deleteAccessory
};