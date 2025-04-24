const express = require('express');
const cors = require('cors');
const app = express();
const licenseRoutes = require('./routes/license');

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/license', licenseRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Servir arquivos estáticos
app.use('/admin', express.static('public/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
