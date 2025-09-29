require("dotenv").config();
const { supabase } = require("./supabase"); // Предполагается, что supabase.js настроен
const bcrypt = require("bcrypt");

async function hashExistingPasswords() {
  const saltRounds = 10;

  try {
    // Получаем всех пользователей
    const { data: users, error: selectError } = await supabase
      .from("users")
      .select("id, password");

    if (selectError) {
      console.error("Ошибка при выборке пользователей:", selectError);
      return;
    }

    if (!users || users.length === 0) {
      console.log("Пользователи не найдены.");
      return;
    }

    console.log(`Найдено ${users.length} пользователей для обновления.`);

    // Обрабатываем каждого пользователя
    for (const user of users) {
      const { id, password } = user;

      // Проверяем, не является ли пароль уже хэшированным
      if (password.startsWith("$2b$")) {
        console.log(`Пароль для пользователя ID ${id} уже захэширован. Пропускаем.`);
        continue;
      }

      try {
        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Хэшируем пароль для пользователя ID ${id}`);

        // Обновляем пароль в базе данных
        const { error: updateError } = await supabase
          .from("users")
          .update({ password: hashedPassword })
          .eq("id", id);

        if (updateError) {
          console.error(`Ошибка при обновлении пароля для ID ${id}:`, updateError);
        } else {
          console.log(`Пароль для пользователя ID ${id} успешно обновлен.`);
        }
      } catch (hashError) {
        console.error(`Ошибка хэширования для ID ${id}:`, hashError);
      }
    }

    console.log("Обработка завершена.");
  } catch (error) {
    console.error("Общая ошибка:", error);
  }
}

// Запускаем скрипт
hashExistingPasswords();