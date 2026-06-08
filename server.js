const express = require('express');
const path = require('path');
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware - Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de rutas SPA - redirigir a index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 Accede a la aplicación en http://localhost:${PORT}`);
});
