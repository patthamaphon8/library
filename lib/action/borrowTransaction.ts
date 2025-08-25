"use server";

import { Prisma, PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const addBorrowTransaction = async (data: {
  userId: number;
  bookCopyId: number;
  dueDate: string;
  borrowedAt: string;
}) => {
  try {
    const response = await prisma.borrowTransaction.create({
      data: {
        userId: data.userId,
        bookCopyId: data.bookCopyId,
        dueDate: data.dueDate,
        borrowedAt: data.borrowedAt,
      },
    });
    await prisma.bookCopy.update({
      where: {
        id: data.bookCopyId,
      },
      data: {
        status: "BORROWED",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const listBorrowTransaction = async (
  // from?: string,
  // to?: string,
  // filterBy?: "borrowDate" | "dueDate" | string,
  nameAndUser?: string,
  // status?: string[]
) => {
  try {
    const query: {
      where: Prisma.BorrowTransactionWhereInput;
    } = {
      where: {},
    };
    if (nameAndUser) {
      query.where.OR = [
        {
          bookCopy: {
            book: {
              name: {
                startsWith: nameAndUser,
              },
            },
          },
        },
      ];
      query.where.OR?.push({
        user: {
          OR: [
            {
              firstName: {
                startsWith: nameAndUser,
              },
            },
            {
              lastName: {
                startsWith: nameAndUser,
              },
            },
          ],
        },
      });
    }
    // if (from && to) {
    //   if (filterBy === "borrowDate") {
    //     query.where.borrowedAt = {
    //       gte: from,
    //       lte: to,
    //     };
    //   } else if (filterBy === "dueDate") {
    //     query.where.dueDate = { gte: from, lte: to };
    //   }
    // }
    console.log(query);
    const response = await prisma.borrowTransaction.findMany({
      include: {
        bookCopy: {
          include: {
            book: true,
          },
        },
        user: true,
      },
      orderBy: {
        borrowedAt: "desc",
      },
      ...query,
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const getBorrowTransactionByBookCopyId = async (bookCopyId: number) => {
  try {
    const response = await prisma.borrowTransaction.findFirst({
      where: {
        bookCopyId: bookCopyId,
        returnedAt: {
          equals: null,
        },
        status: "BORROWED",
      },
      include: {
        user: true,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const returnBook = async (
  id: number,
  returnedAt: string,
  bookCopyId: number
) => {
  try {
    console.table({
      id,
      returnedAt,
      bookCopyId,
    });
    const response = await prisma.borrowTransaction.update({
      where: {
        id: id,
      },
      data: {
        returnedAt: returnedAt,
        status: "RETURNED",
      },
    });
    await prisma.bookCopy.update({
      where: {
        id: bookCopyId,
      },
      data: {
        status: "AVAILABLE",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

export {
  addBorrowTransaction,
  listBorrowTransaction,
  getBorrowTransactionByBookCopyId,
  returnBook,
};
