const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'event_db',
    password: process.env.DB_PASSWORD || 'password',
    port: 5432,
});

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                total_tickets INT NOT NULL,
                tickets_sold INT DEFAULT 0
            );
        `);
        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};
initDB();

app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    const { name, date, total_tickets } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (name, date, total_tickets) VALUES ($1, $2, $3) RETURNING *',
            [name, date, total_tickets]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events/:id/book', async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
        if (event.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
        
        const currentEvent = event.rows[0];
        if (currentEvent.tickets_sold >= currentEvent.total_tickets) {
            return res.status(400).json({ error: 'Đã hết vé!' });
        }

        await pool.query('UPDATE events SET tickets_sold = tickets_sold + 1 WHERE id = $1', [eventId]);
        res.json({ message: 'Đăng ký vé thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
