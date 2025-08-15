"use server";

import { Prisma, PrismaClient } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";

const prisma = new PrismaClient();

const addBookCopy = async (data: Prisma.BookCopyCreateInput) => {
  try {
    const response = await prisma.bookCopy.create({
      data: data,
    });
    return response;
  } catch (error) {
    console.error(typeof error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.message);
      if (error.message.includes("Unique")) {
        return "notUnique";
      }
    }
  } finally {
    prisma.$disconnect();
  }
};

const listBookCopy = async ({ code }: { code?: string }) => {
  try {
    let query = {};
    if (code) {
      query = {
        where: {
          code: {
            startsWith: code,
          },
        },
      };
    }
    const response = await prisma.bookCopy.findMany({
      ...query,
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

export { addBookCopy, listBookCopy };
