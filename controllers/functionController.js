
const getAllUsers = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;

        const { data, error } = await req.supabase.rpc("get_all_users", {
            user_id: user_id,
        });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getSalesReport = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        const { start_date, end_date } = req.body;

        const { data, error } = await req.supabase.rpc("get_sales_report", {
            input_user_id: user_id,
            input_start_time: start_date,
            input_end_time: end_date,
        });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getBalance = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        console.log("user_id from getBalance", user_id);

        const { data, error } = await req.supabase.rpc("get_balance", {
            p_user_id: user_id,
        });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const available_zones = async (req, res) => {
    try {
        const { data, error } = await req.supabase.rpc("available_zones");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const available_pc = async (req, res) => {
    try {
        const { zone_name, start_time, play_hours } = req.body;
        console.log("args:",JSON.stringify(req.body));
        const { data, error } = await req.supabase.rpc("available_computer", {
            input_zone_name: zone_name,
            input_start_time: start_time,
            input_playing_hours: play_hours,
        });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getSalesReport,
    getBalance,
    available_zones,
    available_pc,
};