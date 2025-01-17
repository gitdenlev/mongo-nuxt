import User from "../models/User.model"; // Імпорт моделі
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Отримання тіла запиту
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const newUser = new User({
    email: body.email,
    password: hashedPassword,
  });

  try {
    await newUser.save(); // Зберігаємо нового користувача в базі даних
    return { message: "User created successfully" }; // Повертаємо повідомлення про успіх
  } catch (error) {
    console.error(error);
    return { error: error.message }; // Повертаємо повідомлення про помилку
  }
});
