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


const getReservationHistory = async (req, res) => {
  const userId = req.cookies.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }

  try {
    // Запрашиваем бронирования с данными о компьютерах и зонах
    const { data, error } = await req.supabase
        .from('reservations')
        .select(`
        id,
        start_time,
        end_time,
        status,
        payment_amount,
        computers (
          computer_name,
          zone_id,
          zones (
            zone_name
          )
        )
      `)
        .eq('user_id', userId)
        .order('start_time', { ascending: false });

    if (error) throw error;

    // Форматируем ответ: выносим zone_name на уровень компьютера
    const formattedData = data.map((reservation) => {
      const zoneName =
          reservation.computers?.zones?.zone_name || 'Неизвестная зона';

      return {
        ...reservation,
        computers: {
          ...reservation.computers,
          zone_name: zoneName,
        },
      };
    });

    res.status(200).json(formattedData);
  } catch (err) {
    console.error('Ошибка при загрузке истории бронирований:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить историю бронирований' });
  }
};

// controllers/purchaseController.js

const getPurchaseHistory = async (req, res) => {
  const userId = req.cookies.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }

  try {
    const { data, error } = await req.supabase
        .from('sales')
        .select(`
        id,
        sale_date,
        quantity,
        sale_amount,
        products (
          product_name,
          category,
          price,
          volume
        )
      `)
        .eq('user_id', userId)
        .order('sale_date', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Ошибка при загрузке истории покупок:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить историю покупок' });
  }
};

// controllers/productController.js

const addProduct = async (req, res) => {
  const userId = req.cookies.user_id;
  const roleId = req.cookies.role_id;

  // Проверка авторизации
  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }

  // Проверка прав доступа
  if (roleId == 3) {
    return res.status(403).json({ error: 'У вас недостаточно прав для добавления товаров' });
  }

  const {
    product_name,
    category,
    price,
    volume,
    stock_quantity,
    min_stock
  } = req.body;

  // Валидация полей
  if (!product_name || !category || !price) {
    return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
  }

  if (!['Drink', 'Snack', 'Other'].includes(category)) {
    return res.status(400).json({ error: 'Неверная категория' });
  }

  try {
    // Добавляем продукт
    const { data, error } = await req.supabase
        .from('products')
        .insert({
          product_name,
          category,
          price,
          volume,
          stock_quantity,
          min_stock
        })
        .select()
        .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (err) {
    console.error('Ошибка при добавлении продукта:', err.message);
    return res.status(500).json({ error: 'Не удалось добавить продукт' });
  }
};

// controllers/cancelReservation.js

const cancelReservation = async (req, res) => {
  const { reservation_id } = req.body;
  const userId = req.cookies.user_id;

  // Проверка авторизации
  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }

  // Проверка входных данных
  if (!reservation_id) {
    return res.status(400).json({ error: 'Не указан ID бронирования' });
  }

  try {
    // Проверяем, существует ли бронь и принадлежит ли она пользователю
    const { data: reservation, error: fetchError } = await req.supabase
        .from('reservations')
        .select('*')
        .eq('id', reservation_id)
        .eq('user_id', userId)
        .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    // Запрещаем отменять завершённые или уже отменённые брони
    if (reservation.status === 'Completed') {
      return res.status(400).json({ error: 'Невозможно отменить завершённое бронирование' });
    }

    if (reservation.status === 'Cancelled') {
      return res.status(400).json({ error: 'Бронирование уже отменено' });
    }

    // Обновляем статус на 'Cancelled'
    const { error: updateError } = await req.supabase
        .from('reservations')
        .update({ status: 'Cancelled' })
        .eq('id', reservation_id);

    if (updateError) throw updateError;

    return res.status(200).json({ message: 'Бронирование успешно отменено' });
  } catch (err) {
    console.error('Ошибка при отмене бронирования:', err.message);
    return res.status(500).json({ error: 'Не удалось отменить бронирование' });
  }
};



module.exports = {
  getProducts,
  getReservationHistory,
  getPurchaseHistory,
  addProduct,
  cancelReservation,
  };
  