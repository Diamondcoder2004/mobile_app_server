const pool = require("../db");
const queries = require("../queries");
const { supabase } = require("../supabase");
const getProducts = async (req, res) => {
  const { category } = req.query;

  try {
    let query = supabase
        .from('products')
        .select('*')
        .gt('stock_quantity', 0); // Только товары в наличии

    // Если указана категория — фильтруем по ней
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = {
  getProducts
  };
  