const bookComputer = async (req, res) => {
    const {  input_computer_name, reservation_start_time, play_time_hours } = req.body;


    try {
        const  input_user_id = req.cookies.user_id;
        console.log("user_id from bookcomputer",  input_user_id);
        console.log( input_user_id, input_computer_name);
        const { data, error } = await req.supabase.rpc('book_computer', {
            input_user_id,
            input_computer_name,
            reservation_start_time,
            play_time_hours
        });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const purchaseProduct = async (req, res) => {
    try {
        const { input_product_name, input_quantity } = req.body;
        const input_user_id = req.cookies.user_id;

        // Валидация входных данных
        if (!input_product_name || !input_quantity || input_quantity <= 0) {
            return res.status(400).json({
                error: 'Неверные данные для заказа',
                details: {
                    input_product_name: !!input_product_name,
                    input_quantity: input_quantity > 0
                }
            });
        }

        if (!input_user_id) {
            return res.status(401).json({ error: 'Пользователь не авторизован' });
        }

        // Вызов PostgreSQL функции
        const { data, error } = await req.supabase.rpc('purchase_product', {
            input_user_id,
            input_product_name,
            input_quantity
        });

        // Обработка ошибки на уровне Supabase
        if (error) {
            console.error('Ошибка при вызове purchase_product:', error);
            return res.status(500).json({ error: error.message });
        }

        // Если функция вернула ошибку в поле `error`
        if (data?.error) {
            return res.status(400).json({ error: data.error });
        }

        // Успешный ответ
        res.status(200).json({
            message: 'Заказ успешно оформлен',
            data
        });

    } catch (err) {
        console.error('Неожиданная ошибка:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

const topUpBalance = async (req, res) => {
    const { target_username, amount } = req.body;
    const admin_user_id = req.cookies.user_id;
    try {
        console.log("admin_user_id", admin_user_id);
        console.log("target_user ",target_username);
        const { data, error } = await req.supabase.rpc('top_up_balance', {
            admin_user_id,
            target_username,
            amount
        });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createComputer = async (req, res) => {
    const {
        input_computer_name,
        input_processor,
        input_ram,
        input_gpu,
        input_zone_name
    } = req.body;

    const  input_user_id = req.cookies.user_id;
    try {
        const { data, error } = await req.supabase.rpc('create_computer', {
            input_user_id,
            input_computer_name,
            input_processor,
            input_ram,
            input_gpu,
            input_zone_name
        });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    bookComputer,
    purchaseProduct,
    topUpBalance,
    createComputer,
};