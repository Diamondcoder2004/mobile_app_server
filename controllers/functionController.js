const pool = require("../db");
const queries = require("../queries");




const getAllUsers = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        const result = await pool.query(queries.get_all_users,[user_id]);
         res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error:  error.message });
    }
};


    
const getSalesReport = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        const { start_date, end_date } = req.body;
        const result = await pool.query(queries.get_sales_report, [user_id,start_date, end_date]);
        res.status(200).json(result.rows);
    } catch (error) {
       console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getBalance = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        const result = await pool.query(queries.getBalance,[user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
       console.error(error);
        res.status(500).json({ error:  error.message });
    }
};

const available_zones = async (req, res) => {
    try {
       
        const result = await pool.query(queries.available_zones,[]);
        res.status(200).json(result.rows);
    } catch (error) {
       console.error(error);
        res.status(500).json({ error: error.message });
    }
};



const available_pc = async (req, res) => {
    try {
        const {zone_name,start_time,play_hours} = req.body;
        const result = await pool.query(queries.available_pc,[zone_name,start_time,play_hours]);
        res.status(200).json(result.rows);
    } catch (error) {
       console.error(error);
        res.status(500).json({ error:  error.message});
    }
};



    





module.exports = {

    getAllUsers,
    getSalesReport,
    getBalance,
    available_zones,
    available_pc,  

};




