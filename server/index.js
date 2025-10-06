import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 🔧 Cargar variables de entorno PRIMERO
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

console.log('✅ Express iniciado');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🐕 API de PetLink funcionando!',
    endpoints: ['/api/dogs']
  });
});

console.log('✅ Ruta / registrada');

// 🔧 CORRECCIÓN: Ajustar la ruta de importación
// Como index.js está en la raíz, necesitamos entrar a /server/routes/

// Importar rutas de dogs
const dogsRoutesModule = await import('./routes/dogs.routes.js');
const dogsRoutes = dogsRoutesModule.default;
app.use('/api/dogs', dogsRoutes);
console.log('✅ Ruta /api/dogs registrada exitosamente');

// Importar rutas de users
const usersRoutesModule = await import('./routes/users.routes.js');
const usersRoutes = usersRoutesModule.default;
app.use('/api/users', usersRoutes);
console.log('✅ Ruta /api/users registrada exitosamente');

// Iniciar servidor
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📍 Rutas disponibles:');
  console.log('   GET  http://localhost:' + PORT + '/');
  console.log('   GET  http://localhost:' + PORT + '/api/dogs');
});