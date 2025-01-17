import { Schema, model } from "mongoose";

// Визначення схеми користувача
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Валідація формату електронної пошти
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Мінімальна довжина пароля
    },
  },
  {
    timestamps: true, // Додає поля createdAt і updatedAt
  }
);

// Створення моделі на основі схеми
const User = model("User", userSchema);

export default User; // Експортуємо модель за замовчуванням
