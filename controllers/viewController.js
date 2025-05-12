const pool = require("../db");
const queries = require("../queries");

const monthly_report = async (req, res) => {
    const role_id = req.cookies.role_id;

    if (role_id == 3) {
        return res.status(403).json({ error: "Нет прав для получения месячного отчета" });
    }

    try {
        const { data, error } = await req.supabase
            .from("monthly_zone_report")
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const morning_report = async (req, res) => {
    const role_id = req.cookies.role_id;

    if (role_id == 3) {
        return res.status(403).json({ error: "Нет прав для получения утреннего отчета" });
    }

    try {
        const { data, error } = await req.supabase
            .from("utilization_morning")
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const afternoon_report = async (req, res) => {
    const role_id = req.cookies.role_id;

    if (role_id == 3) {
        return res.status(403).json({ error: "Нет прав для получения дневного отчета" });
    }

    try {
        const { data, error } = await req.supabase
            .from("utilization_afternoon")
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const night_report = async (req, res) => {
    const role_id = req.cookies.role_id;

    if (role_id == 3) {
        return res.status(403).json({ error: "Нет прав для получения ночного отчета" });
    }

    try {
        const { data, error } = await req.supabase
            .from("utilization_night")
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    monthly_report,
    morning_report,
    afternoon_report,
    night_report,
};