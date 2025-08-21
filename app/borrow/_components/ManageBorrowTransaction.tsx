"use client";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { CalendarDays, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import DialogAppBorrow from "./DialogAppBorrow";
import dayjs from "dayjs";
import PopoverCalendar from "@/components/DialogCalendar";
import PopoverCalendarRange from "@/components/PopoverCalendarRange";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface ManageBorrowTransactionProps {
  className?: string;
  borrowTransactions?: Prisma.BorrowTransactionGetPayload<{
    include: { bookCopy: { include: { book: true } }; user: true };
  }>[];
}

const ManageBorrowTransaction = ({
  className,
  borrowTransactions,
}: ManageBorrowTransactionProps) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleOnChangeDateFilter = (date?: DateRange) => {
    console.log("🚀 ~ handleOnChangeDateFilter ~ date:", date);
    const params = new URLSearchParams(searchParams.toString());
    if(date && date.from && date.to){
      params.set(`from`, date.from.toISOString())
      params.set(`to`, date.to.toISOString())
    }else{
      params.delete(`from`)
      params.delete(`to`)
    }
    router.replace(`/borrow?${params.toString()}`);
  };

  const handleOnChangeFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filterBy", value);
    router.replace(`/borrow?${params.toString()}`);
  };

  return (
    <div className={cn(``, className && className)}>
      <DialogAppBorrow
        open={isOpenAdd}
        onOpenChange={(open) => setIsOpenAdd(open)}
      />
      <div className={`flex items-center justify-between`}>
        <div
          className={`min-w-[400px] flex gap-3 items-center min-h-10 bg-input rounded-lg pl-3 overflow-hidden`}
        >
          <Search />
          <input type="text" className="h-10 flex-1 focus:outline-none" />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={handleOnChangeFilter} defaultValue="dueDate">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="กรองจาก..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="borrowDate">วันที่ยืม</SelectItem>
              <SelectItem value="dueDate">กำหนดวันคืน</SelectItem>
            </SelectContent>
          </Select>
          <PopoverCalendarRange onChange={handleOnChangeDateFilter}>
            <Button>
              <CalendarDays />
            </Button>
          </PopoverCalendarRange>
          <Button onClick={() => setIsOpenAdd(true)}>
            <Plus strokeWidth={4} />
          </Button>
        </div>
      </div>
      <table className={`mt-4 w-full`}>
        <thead>
          <tr className="">
            <th className="bg-input py-2 rounded-l-2xl">ID</th>
            <th className="bg-input py-2">ชื่อหนังสือ</th>
            <th className="bg-input py-2">หมวดหมู่</th>
            <th className="bg-input py-2">วันที่ยืม</th>
            <th className="bg-input py-2">ชื่อผู้ยืม</th>
            <th className="bg-input py-2 rounded-r-2xl">กำหนดวันคืน</th>
          </tr>
        </thead>
        <tbody>
          {borrowTransactions?.map((borrowTransaction) => {
            return (
              <tr>
                <td>
                  <div className={`flex items-center gap-1`}>
                    <img
                      className={`rounded-lg`}
                      width={80}
                      height={80}
                      src={borrowTransaction.bookCopy.book.image}
                      alt="book image"
                    />
                    <div>{borrowTransaction.bookCopy.code}</div>
                  </div>
                </td>
                <td>{borrowTransaction.bookCopy.book.name}</td>
                <td>{borrowTransaction.bookCopy.book.category}</td>
                <td>
                  {borrowTransaction.borrowedAt
                    ? dayjs(borrowTransaction.borrowedAt).format(`DD MMM YYYY`)
                    : `-`}
                </td>
                <td>{`${borrowTransaction.user.firstName} ${borrowTransaction.user.lastName}`}</td>
                <td>
                  {borrowTransaction.dueDate
                    ? dayjs(borrowTransaction.dueDate).format(`DD MMM YYYY`)
                    : `-`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBorrowTransaction;
