"use client";
import DialogAddBookCopy from "@/components/DialogAddBookCopy";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FilterStatus from "./FilterStatus";
import { $Enums, Prisma } from "@/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteBookByIds } from "@/lib/action/bookCopy";
import { revalidate } from "@/lib/action/base";
import { toast } from "sonner";

const renderStatus = (status: $Enums.CopyStatus) => {
  let color = "text-black";
  let text: string = status;
  switch (status) {
    case "AVAILABLE":
      text = "ว่าง";
      color = "text-green-500";
      break;
    case "BORROWED":
      text = "ไม่ว่าง";
      color = "text-red-500";
      break;
    case "DAMAGED":
      text = "เสียหาย";
      color = "text-amber-400";
      break;
    case "LOST":
      text = "สูญหาย";
      color = "text-gray-400";
      break;
    default:
      text = status;
      break;
  }
  return <div className={`${color}`}>{text}</div>;
};

interface ManageBookCopyProps {
  bookId: string;
  bookCopyList?: Prisma.BookCopyGetPayload<{}>[];
  search?: string;
  status?: string;
}

const ManageBookCopy = ({
  bookId,
  bookCopyList,
  search,
  status,
}: ManageBookCopyProps) => {
  const router = useRouter();
  const [searchCode, setSearchCode] = useState("");
  const searchParams = useSearchParams();
  const [isSelect, setIsSelect] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

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

  const toggleRow = (id: number) => {
    console.log(`id: ${id}`);
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === bookCopyList?.length) {
      setSelectedRows([]); // uncheck all
    } else {
      setSelectedRows(bookCopyList?.map((row) => row.id) ?? []); // select all
    }
  };

  const removeBookCopy = async () => {
    console.log(selectedRows);
    const response = await deleteBookByIds(selectedRows)
    if(!response || typeof response === "string"){
      toast.error(`ลบข้อมูลไม่สำเร็จ: ${response}`)
      return
    }
    toast.success(`ลบข้อมูลสำเร็จ`)
    revalidate(`/book/${bookId}`)
    setIsSelect(false)
    console.log("🚀 ~ removeBookCopy ~ response:", response)
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
      <div className={`flex gap-1 items-center mt-2`}>
        <Button onClick={() => setIsSelect((prev) => !prev)} className={``}>
          {isSelect ? `ยกเลิก` : `เลือก`}
        </Button>
        {isSelect && (
          <Button onClick={removeBookCopy} variant={`outline`}>
            <Trash2 className="text-red-500" />
          </Button>
        )}
      </div>
      <table className="w-full mt-2">
        <thead>
          <tr className={`bg-gray-100`}>
            {isSelect && (
              <th>
                <Checkbox
                  checked={selectedRows.length === bookCopyList?.length}
                  onCheckedChange={(checked) => {
                    toggleAll();
                  }}
                />
              </th>
            )}
            <th>ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {bookCopyList
            ?.filter((bookCopy) => {
              const searchCode = search
                ? bookCopy.code.toLowerCase().startsWith(search)
                : true;
              const searchStatus = status ? bookCopy.status === status : true;
              return searchCode && searchStatus;
            })
            .map((bookCopy, index) => {
              return (
                <tr
                  className={`odd:bg-white even:bg-gray-50`}
                  key={`bookCopy${index}`}
                >
                  {isSelect && (
                    <th>
                      <Checkbox
                        checked={selectedRows.includes(bookCopy.id)}
                        onCheckedChange={(_) => {
                          toggleRow(bookCopy.id);
                        }}
                      />
                    </th>
                  )}
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
