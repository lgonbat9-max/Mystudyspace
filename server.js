const express = require('express');
const path = require('path');
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '.')));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 Accede a la aplicación en http://localhost:${PORT}`);
});
