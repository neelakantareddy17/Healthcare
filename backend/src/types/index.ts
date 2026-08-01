import type { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface AuthUser {
  userId: string;
  role: Role;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
