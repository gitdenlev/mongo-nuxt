import { useConfig } from "~/composables/config";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const imageFile = body.image;
  const { apiKey } = useConfig();

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/resnet-50",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Замініть на ваш API-ключ
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: imageFile }), // Зображення у форматі base64
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Отримуємо JSON-відповідь
    return { response: result };
  } catch (error) {
    console.error("Error querying model:", error);
    return { response: "Sorry, something went wrong. Please try again." };
  }
});
