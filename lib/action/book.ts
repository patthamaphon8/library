"use server";

import { Prisma, PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const addBook = async (data: Prisma.BookCreateInput) => {
  try {
    const responseAddBook = await prisma.book.create({
      data: data,
    });
    return responseAddBook;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};
const listBook = async () => {
  try {
    const responseListBook = await prisma.book.findMany({
      include: {
        copies: true,
      }
    });
    return responseListBook;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const getBookById = async (id: number) => {
  try {
    const responseGetBook = await prisma.book.findFirst({
      where: {
        id: id,
      },
    });
    return responseGetBook;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};
export { addBook, listBook, getBookById };
