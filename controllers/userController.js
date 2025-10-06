const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();
const parsePhoneNumber = require('libphonenumber-js');

const express = require("express");
const router = express.Router();
const urlencodedParser = express.urlencoded({ extended: true });

// Подключение к Supabase
const { supabase } = require("../supabase");

const secretKey = process.env.JWT_SECRET || "your_jwt_secret_key"; // Лучше использовать env-переменную

const normalizePhone = (phone) => {
    try {
        const phoneNumber = parsePhoneNumber(phone, 'RU');
        return phoneNumber ? phoneNumber.number : null;
    } catch (e) {
        return null;
    }
};

// Аутентификация пользователя
const getLogin = async (req, res) => {
    urlencodedParser(req, res, async () => {
        const { username, email, phone, password } = req.body;

        if (!(username || email || phone)) {
            return res.status(400).json({ message: "Не указан логин, email или телефон" });
        }

        let normalizedPhone = null;
        if (phone) {
            normalizedPhone = normalizePhone(phone);
            if (!normalizedPhone) {
                return res.status(400).json({ message: "Неверный формат телефона" });
            }
        }

        try {
            let user = null;

            // Поиск по логину
            if (username) {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, username, first_name, last_name, role_id, password,email")
                    .eq("username", username)
                    .single();

                if (!error) user = data;
            }

            // Поиск по email
            if (!user && email) {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, username, first_name, last_name, role_id, password")
                    .eq("email", email)
                    .single();

                if (!error) user = data;
            }

            // Поиск по телефону
            if (!user && normalizedPhone) {
                const { data, error } = await supabase
                    .from("users")
                    .select("id, username, first_name, last_name, role_id, password")
                    .eq("phone", normalizedPhone)
                    .single();

                if (!error) user = data;
            }

            if (!user) {
                console.warn(`Пользователь не найден по данным: ${username || email || phone}`);
                return res.status(404).json({
                    message: "Пользователь не найден",
                });
            }

            // Проверка пароля с использованием bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.warn(`Неверный пароль для: ${user.username}`);
                return res.status(401).json({
                    message: "Неверный пароль",
                });
            }

            // Генерация JWT
            const token = jwt.sign({ userId: user.id }, secretKey, {
                expiresIn: "2h",
            });

            // Установка кук
            console.log(`Setting cookies for user_id: ${user.id}`);
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

            console.log("user",res.cookie.user_id);
            // Ответ клиенту
            return res.status(200).json({
                message: "Авторизация успешна",
                user: {
                    id: user.id,
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role_id: user.role_id,
                },
            });


        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    });
};


// Регистрация пользователя
const getRegister = async (req, res) => {
    try {
        const { firstName, lastName, username, password, phone_number, email } = req.body;

        // Хэширование пароля
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { data, error } = await supabase.rpc("register_user", {
            p_first_name: firstName,
            p_last_name: lastName,
            p_username: username,
            p_password: hashedPassword, // Передаем хэшированный пароль
            p_phone: phone_number,
            p_email: email,
        });

        if (error || data?.error) {
            const errMessage = error?.message || data.error;
            const errCode = data?.code || "UNKNOWN";

            let statusCode = 500;
            switch (errCode) {
                case "USERNAME_EXISTS":
                    statusCode = 409;
                    break;
                case "EMAIL_EXISTS":
                    statusCode = 409;
                    break;
                case "PHONE_EXISTS":
                    statusCode = 409;
                    break;
                case "ROLE_NOT_FOUND":
                    statusCode = 500;
                    break;
                case "INTERNAL_ERROR":
                    statusCode = 500;
                    break;
                default:
                    statusCode = 500;
            }

            return res.status(statusCode).json({
                error: errMessage,
                code: errCode,
            });
        }

        return res.status(201).json({
            message: data.message,
            user: {
                username: data.username,
                user_id: data.user_id,
            },
        });

    } catch (err) {
        console.error("Unexpected error during registration:", err);
        return res.status(500).json({ error: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
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