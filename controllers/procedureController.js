const pool = require("../db");
const queries = require("../queries");


const bookComputer = async (req, res) => {
 
    try {               
        const input_user_id = req.cookies.user_id;
        //console.log("cookies",req.cookies);
        const { input_computer_name,  reservation_start_time,play_time_hours } = req.body;
        const result = await pool.query(queries.book_computer, [ input_user_id, input_computer_name,  reservation_start_time, play_time_hours]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const purchaseProduct = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        console.log("user_id = ",user_id);
        console.log("username",req.cookies.username);
        const {product_name, quantity} = req.body;
        console.log("quantity = ",quantity);
        const result = await pool.query(queries.purchase_product, [user_id, product_name, quantity]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
         console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const topUpBalance = async (req, res) => {
    try {
        const user_id = req.cookies.user_id;
        const { client_name,amount } = req.body;
         const result = await pool.query(queries.top_up_balance, [user_id ,client_name, amount]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



const createComputer = async (req, res) => {
    try {
      const user_id = req.cookies.user_id;
      const {computer_name, processor,ram,gpu,zone_name,} = req.body;
    
    const result = await pool.query(queries.create_computer, [user_id,computer_name, processor,ram,gpu,zone_name ]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
       res.status(500).json({ error: error.message });
    }
};





module.exports = {
    bookComputer,
    purchaseProduct,
    topUpBalance,
    createComputer,
};
