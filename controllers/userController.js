const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();

const express = require("express");
const router = express.Router();
const urlencodedParser = express.urlencoded({ extended: true });

// Подключение к Supabase
const { supabase } = require("../supabase");

const secretKey = process.env.JWT_SECRET || "your_jwt_secret_key"; // Лучше использовать env-переменную

// Аутентификация пользователя
const getLogin = async (req, res) => {
    urlencodedParser(req, res, async () => {
        const { username, password } = req.body;

        try {
            // Получаем пользователя по имени
            const { data: user, error } = await supabase
                .from("users")
                .select("*")
                .eq("username", username)
                .single();

            if (error || !user) {
                console.warn(`Пользователь не найден: ${username}`);
                return res.status(401).json({
                    message: "Пользователь не найден или неверный пароль",
                });
            }

            // Проверяем пароль
            const passwordMatch = password === user.password;
            if (!passwordMatch) {
                console.warn(`Неверный пароль для: ${username}`);
                return res.status(401).json({
                    message: "Пользователь не найден или неверный пароль",
                });
            }

            // Генерируем JWT
            const token = jwt.sign({ userId: user.id }, secretKey, {
                expiresIn: "2h",
            });

            // Устанавливаем куки
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 2 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            res.cookie("lastName", encodeURIComponent(user.last_name), {
                maxAge: 2 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            res.cookie("firstName", encodeURIComponent(user.first_name), {
                maxAge: 2 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            res.cookie("username", user.username, {
                maxAge: 2 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            res.cookie("user_id", user.id, {
                maxAge: 2 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            res.cookie("role_id", user.role_id, {
                maxAge: 2 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            // Ответ клиенту
            return res.status(200).json({
                message: "Авторизация успешна",
                user: {
                    id: user.id,
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role_id: user.role_id,
                },
            });

        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    });
};

// Регистрация пользователя
const getRegister = async (req, res) => {
    try {
        const { firstName, lastName, username, password, phone_number, email } = req.body;

        // Хэшируем пароль перед сохранением
        const hashedPassword = password; // или bcrypt.hashSync(password, 10)

        // Добавляем пользователя в таблицу users
        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    password: hashedPassword,
                    phone_number: phone_number,
                    email: email,
                    role_id: 2, // например, роль по умолчанию — пользователь
                },
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error while registering user:", error);
        res.status(500).json({ message: "Error while registering user", error: error.message });
    }
};

// Редирект на домашнюю страницу
const getRedirectHome = async (req, res) => {
    if (req.cookies && req.cookies.token && req.cookies.username) {
        const homePath = path.join(__dirname, "..", "public", "home.html");
        res.sendFile(homePath, (err) => {
            if (err) {
                console.error("Ошибка при отправке файла home.html:", err);
                return res.status(500).send("Ошибка сервера");
            }
        });
    } else {
        res.send("Пожалуйста, войдите в систему, чтобы просмотреть эту страницу!");
    }
};

// Экспортируем контроллеры
module.exports = {
    getLogin,
    getRegister,
    getRedirectHome,
};