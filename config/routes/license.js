const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Verificar licença
router.post('/verify', async (req, res) => {
    try {
        const { account, broker, server, login } = req.body;
        
        const result = await db.query(
            `SELECT l.*, u.email 
             FROM licenses l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.account_number = $1 
             AND l.broker = $2 
             AND l.server = $3 
             AND l.active = true`,
            [account, broker, server]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Licença não encontrada'
            });
        }

        const license = result.rows[0];
        const now = new Date();
        const expiryDate = new Date(license.expiry_date);

        if (expiryDate < now) {
            return res.status(403).json({
                success: false,
                message: 'Licença expirada'
            });
        }

        return res.json({
            success: true,
            message: 'Licença válida',
            expiry_date: license.expiry_date
        });
    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar licença'
        });
    }
});

module.exports = router;
