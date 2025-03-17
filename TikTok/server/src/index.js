require('dotenv').config();
const app = require('./app');

const PORT = process.env.port || 3000;

app.Listen(PORT, () => {
    console.log('Server running on port http://localhost:${PORT} in ${process.env.NODE_ENV} mode');
})