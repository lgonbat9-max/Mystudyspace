#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    console.log(`Sirviendo: ${indexPath}`);
    res.sendFile(indexPath);
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// SPA catch-all
app.use((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    console.log(`404 - Redirigiendo ${req.path} a index.html`);
    res.sendFile(indexPath);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Error interno del servidor');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor iniciado en puerto ${PORT}`);
    console.log(`📁 Sirviendo desde: ${__dirname}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});
