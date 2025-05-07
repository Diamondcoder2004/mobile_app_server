require("dotenv").config();

const { supabase } = require('./supabase'); // Импортируем Supabase клиент

const port = process.env.PORT || 3000; // Обратите внимание: обычно PORT пишется заглавными
const cookieParser = require("cookie-parser");
const queryRouter = require('./routes/queryRouter');
const procRouter = require('./routes/procedureRouter');
const functionRoutes = require("./routes/functionRouter");
const userRouter = require("./routes/userRouter");
const viewRouter = require("./routes/viewRouter");
const path = require("path");
const publicPath = path.join(__dirname, "public");
const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');

const app = express();

const allowedOrigins = [
    'http://localhost:8081',
    'http://192.168.0.112:8081',
    "https://curseproject-3.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            const msg = `Доступ с origin ${origin} запрещён политикой CORS`;
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static(publicPath));

// Добавляем Supabase клиент в запросы, чтобы он был доступен в роутерах
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

app.use('/api/query', queryRouter);
app.use('/api/proc', procRouter);
app.use("/api/function", functionRoutes);
app.use("/api/view", viewRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));