import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await User.findOne({ email: body.email });

  if (!user) {
    return { error: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.password);

  if (!isPasswordValid) {
    return {
      error: "Invalid password",
    };
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return { token };
});
