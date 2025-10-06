// Importar las rutas de dogs
const dogsRoutes = require('./routes/dogs.routes');

// Usar las rutas (después de las otras rutas)
app.use('/api/dogs', dogsRoutes);   