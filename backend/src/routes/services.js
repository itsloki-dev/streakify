import express from 'express';
import pool from '../db.js';

const router = express.Router();

//hardcoded temp user id until auth feature added
const USER_ID = 1;

// Create a service
router.post('/', async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO services (name, user_id) VALUES ($1, $2) RETURNING *',
            [name.trim(), USER_ID]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// Get all services for a user
router.get('/', async (req, res)=> {
    try {
        const result = await pool.query(
            'SELECT * FROM services WHERE user_id = $1 ORDER BY id',
            [USER_ID]
        );

        res.json(result.rows);
    } catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to fetch services" });
    }
})

export default router;
