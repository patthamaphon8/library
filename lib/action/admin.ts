"use server";

import { Prisma, PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const login = async (email: string, password: string) => {
  try {
    const responseLogin = await prisma.admin.findFirst({
      where: {
        username: email,
        password: password,
      },
    });
    console.log("admin.ts", responseLogin);
    return responseLogin;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const addAdmin = async (data: Prisma.AdminCreateInput) => {
  try {
    const responseAddUser = await prisma.admin.create({
      data: data,
    });
    console.log(responseAddUser);
    return responseAddUser;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const listAdmin = async (where?: Prisma.AdminWhereInput) => {
  try {
    const response = await prisma.admin.findMany({
      where,
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const approveAdmin = async (id: number) => {
  try {
    const response = await prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        isApprove: true,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const rejectAdmin = async (id: number) => {
  try {
    const response = await prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        isApprove: false,
      },
    });
    return response
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

export { login, addAdmin, listAdmin, approveAdmin, rejectAdmin };
