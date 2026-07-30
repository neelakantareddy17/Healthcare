import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.services.js";
import { registerSchema } from "../validators/auth.validator.js";


export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = registerSchema.parse(req.body);

    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}