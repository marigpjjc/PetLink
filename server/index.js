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
    endpoints: ['/api/dogs', '/api/users', '/api/appointments', '/api/donations']
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

// Importar rutas de appointments
const appointmentsRoutesModule = await import('./routes/appointments.routes.js');
const appointmentsRoutes = appointmentsRoutesModule.default;
app.use('/api/appointments', appointmentsRoutes);
console.log('✅ Ruta /api/appointments registrada exitosamente');

// Importar rutas de donations
const donationsRoutesModule = await import('./routes/donations.routes.js');
const donationsRoutes = donationsRoutesModule.default;
app.use('/api/donations', donationsRoutes);
console.log('✅ Ruta /api/donations registrada exitosamente');

// Importar rutas de needs
const needsRoutesModule = await import('./routes/needs.routes.js');
const needsRoutes = needsRoutesModule.default;
app.use('/api/needs', needsRoutes);
console.log('✅ Ruta /api/needs registrada exitosamente');

// Importar rutas de accessories
const accessoriesRoutesModule = await import('./routes/accessories.routes.js');
const accessoriesRoutes = accessoriesRoutesModule.default;
app.use('/api/accessories', accessoriesRoutes);
console.log('✅ Ruta /api/accessories registrada exitosamente');

// Iniciar servidor
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📍 Rutas disponibles:');
  console.log('   GET  http://localhost:' + PORT + '/');
  console.log('   GET  http://localhost:' + PORT + '/api/dogs');
  console.log('   GET  http://localhost:' + PORT + '/api/users');
  console.log('   GET  http://localhost:' + PORT + '/api/appointments');
  console.log('   GET  http://localhost:' + PORT + '/api/donations');
  console.log('   GET  http://localhost:' + PORT + '/api/needs');
  console.log('   GET  http://localhost:' + PORT + '/api/accessories');
});