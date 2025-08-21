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

const listBookCopy = async ({
  code,
  bookId,
}: {
  code?: string;
  bookId: number;
}) => {
  try {
    let query: {
      where: Prisma.BookCopyWhereInput;
    } = {
      where: {
        bookId: bookId,
      },
    };
    if (code) {
      query.where = {
        ...query.where,
        code: {
          startsWith: code,
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

const deleteBookByIds = async (ids: number[]) => {
  try {
    const response = await prisma.bookCopy.deleteMany({
      where: {
        id: {
          in: ids,
        }
      }
    })
    return response
  } catch (error) {
    console.error(error);
    if(error instanceof PrismaClientKnownRequestError){
      return error.message
    }
  } finally {
    prisma.$disconnect();
  }
}

const getBookCopyById = async (code: string) => {
  try {
    const response = await prisma.bookCopy.findFirst({
      where: {
        code: code,
      },
      include: {
        book: true,
      },
    })
    return response
  } catch (error) {
    console.error(error);
    if(error instanceof PrismaClientKnownRequestError){
      return error.message
    }
  } finally {
    prisma.$disconnect();
  }
}

export { addBookCopy, listBookCopy, deleteBookByIds, getBookCopyById };
