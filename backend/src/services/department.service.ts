import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const createDepartment = async (data: { name: string; description?: string }) => {
  const existing = await prisma.department.findUnique({ where: { name: data.name } });
  if (existing) {
    throw ApiError.conflict('Department with this name already exists');
  }
  return prisma.department.create({ data });
};

export const getAllDepartments = async () => {
  return prisma.department.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { doctors: true } } },
  });
};

export const getDepartmentById = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      doctors: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
    },
  });
  if (!department) {
    throw ApiError.notFound('Department not found');
  }
  return department;
};

export const updateDepartment = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  await getDepartmentById(id);
  return prisma.department.update({ where: { id }, data });
};

export const deleteDepartment = async (id: string) => {
  await getDepartmentById(id);
  const doctorCount = await prisma.doctor.count({ where: { departmentId: id } });
  if (doctorCount > 0) {
    throw ApiError.badRequest('Cannot delete a department that still has doctors assigned');
  }
  await prisma.department.delete({ where: { id } });
};
