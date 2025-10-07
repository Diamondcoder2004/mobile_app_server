require("dotenv").config();
const { supabase } = require('./supabase');
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const port = process.env.PORT || 3007; // Используем порт из .env или 3007

const app = express();


// Парсим origins из .env
const corsOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:8080'];

app.use(cors({
    origin: corsOrigins,
    credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Добавляем Supabase клиент в запросы
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// Маршруты
app.use('/api/query', require('./routes/queryRouter'));
app.use('/api/proc', require('./routes/procedureRouter'));
app.use('/api/function', require('./routes/functionRouter'));
app.use('/api/view', require('./routes/viewRouter'));
app.use('/user', require('./routes/userRouter'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});