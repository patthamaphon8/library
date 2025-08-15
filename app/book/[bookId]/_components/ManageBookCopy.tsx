"use client";
import DialogAddBookCopy from "@/components/DialogAddBookCopy";
import { Button } from "@/components/ui/button";
import { List, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FilterStatus from "./FilterStatus";
import { Prisma } from "@/generated/prisma";

interface ManageBookCopyProps {
  bookId: string;
  bookCopyList: Prisma.BookCopyGetPayload<{}>
}

const ManageBookCopy = ({ bookId }: ManageBookCopyProps) => {
  const router = useRouter();
  const [searchCode, setSearchCode] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // if (!searchCode) return; // ถ้าว่างไม่ต้องทำอะไร

    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (!searchCode) {
        params.delete("search");
      } else {
        params.set("search", searchCode);
      }
      router.replace(`/book/${bookId}?${params.toString()}`);
    }, 1500); // 2 วิ

    return () => clearTimeout(delayDebounce); // ล้าง timeout ถ้าพิมพ์ต่อ
  }, [searchCode, router]);

  const handleOnChangeFilterStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.replace(`/book/${bookId}?${params.toString()}`);
  };

  return (
    <div>
        <div className="flex gap-1 mt-4 items-center">
        <div className="flex-1 h-10 rounded-lg flex items-center pl-3 gap-4 bg-[#e6e6ea]">
            <Search />
            <input
            type="text"
            placeholder="ค้นหาหนังสือ...."
            className="h-full focus:outline-none flex-1"
            onChange={(e) => setSearchCode(e.target.value)}
            />
        </div>
        <FilterStatus
            options={[
            {
                label: "ว่าง",
                value: "AVAILABLE",
            },
            {
                label: "ไม่ว่าง",
                value: "BORROWED",
            },
            {
                label: "เสียหาย",
                value: "DAMAGED",
            },
            {
                label: "สูญหาย",
                value: "LOST",
            },
            ]}
            onValueChange={handleOnChangeFilterStatus}
        />
        <DialogAddBookCopy bookId={parseInt(bookId)}>
            <Button>
            <Plus strokeWidth={4} size={24} />
            </Button>
        </DialogAddBookCopy>
        </div>
        <Button className={`mt-2`}>เลือก</Button>
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {responseBookCopy
                ?.filter((bookCopy) => {
                  const searchCode = search ? bookCopy.code.toLowerCase().startsWith(search) : true
                  const searchStatus = status ? bookCopy.status === status : true
                  return searchCode && searchStatus
                }
                )
                .map((bookCopy, index) => {
                  return (
                    <tr key={`bookCopy${index}`}>
                      <td>{bookCopy.code}</td>
                      <td>{renderStatus(bookCopy.status)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
    </div>
  );
};

export default ManageBookCopy;
