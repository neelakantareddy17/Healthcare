import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

interface RegisterData {
  name: string;
  email: string;
  password: string;
 
 
   phone: string;
 
}

export async function register(data: RegisterData) {
  const { name, email, password, phone } = data;

const role = "PATIENT";

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      },
    });

    await tx.patient.create({
      data: {
        userId: user.id,
        dateOfBirth: new Date(),
        gender: "OTHER",
      },
    });

    const token = generateToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  });

  return result;
}