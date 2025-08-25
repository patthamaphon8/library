"use client";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  AlertTriangle,
  ArrowDownUp,
  Check,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DialogBorrowReturn from "./DialogAppBorrow";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import _ from 'lodash'

interface OverViewProps {
  borrowTransactions?: Prisma.BorrowTransactionGetPayload<{
    include: { user: true; bookCopy: { include: { book: true } } };
  }>[];
  className?: string;
}

const getStatus = (
    borrowTransaction: Prisma.BorrowTransactionGetPayload<object>
  ) => {
    if (
      borrowTransaction.returnedAt &&
      dayjs(borrowTransaction.returnedAt).isAfter(
        borrowTransaction.dueDate,
        "date"
      )
    ) {
      return "returnLate";
    } else if (dayjs().isAfter(borrowTransaction.dueDate, "date")) {
      return "late";
    } else if (!borrowTransaction.returnedAt) {
      return "waiting";
    }
    return "returned";
  };

const OverView = ({ borrowTransactions, className }: OverViewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cloneBorrowTransaction, setCloneBorrowTransaction] = useState<
    Prisma.BorrowTransactionGetPayload<{
      include: { user: true; bookCopy: { include: { book: true } } };
    }>[]
  >([]);

  useEffect(() => {
    if(borrowTransactions){
      let clone = _.cloneDeep(borrowTransactions)
      const isReturnLate = searchParams.get(`isReturnLate`) === `true`
      const isLate = searchParams.get(`isLate`) === `true`
      const isWaiting = searchParams.get(`isWaiting`) === `true`
      const isReturned = searchParams.get(`isReturned`) === `true`
      if(isReturnLate || isLate || isWaiting || isReturned){
        clone = clone.filter((borrowTs) => {
          const filterReturnLate = isReturnLate ? getStatus(borrowTs) === "returnLate" : false
          const filterLate = isLate ? getStatus(borrowTs) === "late" : false
          const filterWaiting = isWaiting ? getStatus(borrowTs) === "waiting" : false
          const filterReturned = isReturned ? getStatus(borrowTs) === "returned" : false
          return filterReturnLate || filterLate || filterWaiting || filterReturned
        })
      }
      
      setCloneBorrowTransaction(clone)
    }
  }, [searchParams, borrowTransactions])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (!searchText) {
        params.delete("search");
      } else {
        params.set("search", searchText);
      }
      router.replace(`/?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounce); // ล้าง timeout ถ้าพิมพ์ต่อ
  }, [searchText, router, searchParams]);

  const renderStatus = (
    borrowTransaction: Prisma.BorrowTransactionGetPayload<object>
  ) => {
    let icon = <Check size={14} />;
    let bgColor = "bg-green-100";
    let circleColor = "bg-green-500";
    let text = "คืนแล้ว";
    const status = getStatus(borrowTransaction);
    if (status === "returnLate") {
      bgColor = `bg-amber-100`;
      circleColor = `bg-amber-400`;
      text = `คืนช้า`;
    } else if (status === "late") {
      bgColor = `bg-red-100`;
      circleColor = `bg-red-400`;
      text = `เลยกำหนด`;
      icon = <AlertTriangle size={14} />;
    } else if (status === "waiting") {
      bgColor = `bg-blue-100`;
      circleColor = `bg-blue-400`;
      text = `รอ`;
      icon = <Clock size={14} />;
    }
    return (
      <div
        className={cn(
          `text-white py-1 pl-1 pr-2 rounded-2xl flex items-center gap-2 min-w-[120px] w-max`,
          bgColor
        )}
      >
        <div
          className={cn(
            `size-6 rounded-full flex justify-center items-center`,
            circleColor
          )}
        >
          {icon}
        </div>
        <div className={`text-sm text-black/85 text-nowrap flex-1`}>{text}</div>
      </div>
    );
  };

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleOnChangeFilter = (checked: boolean, key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!checked) {
      params.delete(key);
    } else {
      params.set(key, "true");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className={cn(``, className ?? "")}>
      <DialogBorrowReturn open={isOpen} onOpenChange={handleOnOpenChange} />
      <div className={`flex gap-4 items-center`}>
        <div
          className={`bg-input h-10 rounded-lg relative flex items-center gap-3 pl-3 flex-1`}
        >
          <Search className={``} />
          <input
            type="text"
            className={`h-10 flex-1 focus:outline-none`}
            placeholder="ค้นหาชื่อหนังสือ, ผู้ยืม"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className={`flex gap-2`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={`min-h-10`}>
                <Filter />
                <div>กรอง</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>สถานะ</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={searchParams.get(`isReturnLate`) === `true`}
                onCheckedChange={(checked) => {
                  handleOnChangeFilter(checked, "isReturnLate");
                }}
              >
                <div
                  className={`size-6 rounded-full flex justify-center items-center bg-amber-400`}
                >
                  <Check className={`text-white size-3.5`} />
                </div>
                คืนช้า
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={searchParams.get(`isLate`) === `true`}
                onCheckedChange={(checked) => {
                  handleOnChangeFilter(checked, "isLate");
                }}
              >
                <div
                  className={`size-6 rounded-full flex justify-center items-center bg-red-400`}
                >
                  <AlertTriangle className={`text-white size-3.5`} />
                </div>
                เลยกำหนด
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={searchParams.get(`isWaiting`) === `true`}
                onCheckedChange={(checked) => {
                  handleOnChangeFilter(checked, "isWaiting");
                }}
              >
                <div
                  className={`size-6 rounded-full flex justify-center items-center bg-blue-400`}
                >
                  <Clock className={`text-white size-3.5`} />
                </div>
                รอ
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={searchParams.get(`isReturned`) === `true`}
                onCheckedChange={(checked) => {
                  handleOnChangeFilter(checked, "isReturned");
                }}
              >
                <div
                  className={`size-6 rounded-full flex justify-center items-center bg-green-500`}
                >
                  <Clock className={`text-white size-3.5`} />
                </div>
                คืนแล้ว
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className={`min-h-10`} onClick={() => setIsOpen(true)}>
            <ArrowDownUp />
            <div>ยืม-คืน</div>
          </Button>
        </div>
      </div>
      <table className={`w-full mt-4`}>
        <thead>
          <tr>
            <th className={`bg-gray-200 rounded-l-2xl py-2 px-2`}>ID</th>
            <th className={`bg-gray-200 py-2`}>หนังสือ</th>
            <th className={`bg-gray-200 py-2`}>รหัสหนังสือ</th>
            <th className={`bg-gray-200 py-2`}>หมวดหมู่</th>
            <th className={`bg-gray-200 py-2`}>วันที่ยืม</th>
            <th className={`bg-gray-200 py-2`}>กำหนดคืน</th>
            <th className={`bg-gray-200 py-2`}>วันที่คืน</th>
            <th className={`bg-gray-200 py-2`}>ผู้ยืม</th>
            <th className={`bg-gray-200 rounded-r-2xl py-2`}>สถานะ</th>
          </tr>
        </thead>
        <tbody className={`text-center`}>
          {cloneBorrowTransaction?.map((borrowTransaction, index) => {
            return (
              <tr key={`borrow${index}`}>
                <td>{borrowTransaction.id}</td>
                <td>
                  <div className={`flex gap-2 items-center`}>
                    <img
                      className={`rounded-lg`}
                      width={80}
                      height={80}
                      src={borrowTransaction.bookCopy.book.image}
                      alt=""
                    />
                    <div>{borrowTransaction.bookCopy.book.name}</div>
                  </div>
                </td>
                <td>{borrowTransaction.bookCopy.code}</td>
                <td>{borrowTransaction.bookCopy.book.category}</td>
                <td>
                  {dayjs(borrowTransaction.borrowedAt).format(`DD MMM YYYY`)}
                </td>
                <td>
                  <div
                    className={cn(
                      getStatus(borrowTransaction) === "late" && "text-red-500",
                      getStatus(borrowTransaction) === "returnLate" &&
                        `text-amber-500`
                    )}
                  >
                    {dayjs(borrowTransaction.dueDate).format(`DD MMM YYYY`)}
                  </div>
                </td>
                <td>
                  <div
                    className={cn(
                      getStatus(borrowTransaction) === "returnLate" &&
                        `text-amber-500`
                    )}
                  >
                    {borrowTransaction.returnedAt
                      ? dayjs(borrowTransaction.returnedAt).format(
                          `DD MMM YYYY`
                        )
                      : `-`}
                  </div>
                </td>
                <td>
                  {`${borrowTransaction.user.firstName} ${borrowTransaction.user.lastName}`}
                </td>
                <td>{renderStatus(borrowTransaction)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OverView;
