const authenticateUser =  async (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Сообщение не может быть пустым" });

    await supabase.from('admin_chat').insert({
        user_id: req.user.id,
        message: message.trim(),
        from_admin: false
    });

    res.json({ success: true });
};



module.exports = {
    authenticateUser
    };