"use server";

import { Prisma, PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
const getUser = async () => {
  try {
    const user = await prisma.user.findFirst();
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const addUser = async (data: Prisma.UserCreateInput) => {
  try {
    const responseAddUser = await prisma.user.create({
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

const listUser = async () => {
  try {
    const response = await prisma.user.findMany()
    return response
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
}

const searchUserByFirstLastName = async (search: string) => {
  try {
    const response = await prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              startsWith: search,
            },
          },
          {
            lastName: {
              startsWith: search,
            },
          },
        ],
      },
    });
    return response
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

export { getUser, addUser, searchUserByFirstLastName, listUser };
