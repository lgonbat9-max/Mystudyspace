const express = require('express');
const path = require('path');
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware - Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname)));

// Logs para debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    console.log('Sirviendo index.html desde raíz');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de rutas SPA - redirigir a index.html para todas las rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.path}, redirigiendo a index.html`);
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📱 Accede a la aplicación en http://localhost:${PORT}`);
    console.log(`📂 Sirviendo archivos estáticos desde: ${__dirname}`);
});
