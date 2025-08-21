"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BarcodeScanner from "react-qr-barcode-scanner";
import { CalendarDays, LoaderCircle, Search, X } from "lucide-react";
import PopoverCalendar from "@/components/DialogCalendar";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/generated/prisma";
import { getBookCopyById } from "@/lib/action/bookCopy";
import { toast } from "sonner";
import dayjs from "dayjs";
import { searchUserByFirstLastName } from "@/lib/action/user";
import { addBorrowTransaction } from "@/lib/action/borrowTransaction";
import { revalidate } from "@/lib/action/base";

interface DialogAppBorrowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogAppBorrow = ({ open, onOpenChange }: DialogAppBorrowProps) => {
  const [isFound, setIsFound] = useState(false);
  const [codeManual, setCodeManual] = useState<string | undefined>();
  const [bookCopy, setBookCopy] = useState<
    Prisma.BookCopyGetPayload<{ include: { book: true } }> | null | undefined
  >();
  const [borrowDate, setBorrowDate] = useState<dayjs.Dayjs | undefined>();
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | undefined>();
  const [user, setUser] = useState<Prisma.UserGetPayload<{}> | undefined>();
  const [searchUserText, setSearchUserText] = useState<string>("");
  const [userList, setUserList] = useState<Prisma.UserGetPayload<{}>[]>([])

  const handleOnOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const handleOnDetect = async (value: string) => {
    console.log("🚀 ~ handleOnDetect ~ value:", value);
    setIsFound(true);
    const response = await getBookCopyById(value);
    if (!response || typeof response === "string") {
      setIsFound(false);
      toast.warning(`ไม่พบรหัสหนังสือนี้`);
      return;
    }
    if(response.status === "BORROWED"){
      toast.warning(`หนังสือเล่มนี้ยังไม่ถูกคืน กรุณาทำรายการคืนหนังสือก่อน !`, {
        className: `text-amber-500! text-nowrap`
      })
      setIsFound(false)
      return
    }
    setCodeManual(value);
    setBookCopy(response);
  };

  const disabledConfirm = () => {
    return !bookCopy || !borrowDate || !dueDate || !user;
  };

  const handleRemoveBookCopy = () => {
    setBookCopy(undefined);
    setCodeManual(undefined);
    setIsFound(false);
  };

  const handleSearchUser = async (search: string) => {
    setSearchUserText(search)
    const response = await searchUserByFirstLastName(search)
    console.log("🚀 ~ handleSearchUser ~ response:", response)
    if(!response){
      return
    }
    setUserList(response)
  }

  const onSubmit = async () => {
    console.log({
      userId: user?.id,
      bookCopyId: bookCopy?.id,
      borrowedAt: borrowDate?.toISOString(),
      dueDate: dueDate?.toISOString(),
    })
    if(!user) return
    if(!bookCopy) return
    if(!borrowDate) return
    if(!dueDate) return
    const response = await addBorrowTransaction({
      userId: user.id,
      bookCopyId: bookCopy.id,
      borrowedAt: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
    })
    console.log("🚀 ~ onSubmit ~ response:", response)
    if(!response){
      toast.error(`เพิ่มรายการยืมไม่สำเร็จ`)
      return
    }
    toast.success(`เพิ่มรายการยืมสำเร็จ`)
    handleOnOpenChange(false)
    revalidate(`/borrow`)
  }

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className={`min-w-[600px]`}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="flex justify-center">
            {!isFound ? (
              <BarcodeScanner
                stopStream={isFound}
                width={500}
                height={200}
                videoConstraints={{
                  aspectRatio: 21 / 9,
                }}
                onUpdate={(err, result) => {
                  if (result) {
                    handleOnDetect(result.getText());
                  }
                }}
              />
            ) : bookCopy ? (
              <div
                className={`relative bg-white drop-shadow-md rounded-lg overflow-hidden`}
              >
                <img
                  className=""
                  width={200}
                  height={200}
                  src={bookCopy.book.image}
                  alt="book image"
                />
                <Button
                  onClick={handleRemoveBookCopy}
                  variant={`outline`}
                  className={`absolute top-1.5 right-1.5 size-8`}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <div
                className={`w-[500px] bg-gray-200 aspect-21/9 flex items-center justify-center`}
              >
                <LoaderCircle
                  className="animate-spin text-white size-[150px]"
                  strokeWidth={1}
                />
              </div>
            )}
          </div>
          <div className={`text-xl font-semibold text-center mt-4`}>หรือ</div>
          <div className={`relative w-full mt-4`}>
            <input
              type="text"
              placeholder="ใส่รหัส"
              className={`bg-input px-2 py-4 rounded-lg w-full`}
              value={codeManual ?? ""}
              onChange={(e) => setCodeManual(e.target.value)}
              readOnly={!!bookCopy}
            />
            <Button
              className={`min-w-10! min-h-10 px-0! absolute right-2 top-1/2 -translate-y-1/2`}
              onClick={() => {
                if (!codeManual) {
                  toast.warning(`กรุณากรอกรหัสหนังสือ`);
                  return;
                }
                handleOnDetect(codeManual);
              }}
            >
              <Search />
            </Button>
          </div>
          <div className={`flex gap-4`}>
            <input
              readOnly
              className={`read-only:bg-input/50 read-only:placeholder:text-gray-400 read-only:cursor-default focus:outline-none bg-input px-2 py-4 rounded-lg w-full mt-4`}
              type="text"
              placeholder="ชื่อหนังสือ"
              value={bookCopy?.book.name ?? ""}
            />
            <input
              readOnly
              className={`read-only:bg-input/50 read-only:placeholder:text-gray-400 read-only:cursor-default focus:outline-none bg-input px-2 py-4 rounded-lg w-full mt-4`}
              type="text"
              placeholder="หมวดหมู่"
              value={bookCopy?.book.category ?? ""}
            />
          </div>
          <div className={`h-0.5 w-full bg-gray-300 my-4 rounded-full`}></div>
          <div className={`flex gap-4 mt-4`}>
            <PopoverCalendar
              onChange={(date) => {
                setBorrowDate(dayjs(date));
              }}
            >
              <div className={`relative flex-1`}>
                <input
                  className={`read-only:bg-input/50 read-only:placeholder:text-gray-400 read-only:cursor-default focus:outline-none bg-input px-2 py-4 rounded-lg w-full`}
                  type="text"
                  placeholder="วันที่ยืม"
                  value={borrowDate?.format(`DD MMM YYYY`) ?? ""}
                />
                <CalendarDays
                  className={`absolute right-2 top-1/2 -translate-y-1/2`}
                />
              </div>
            </PopoverCalendar>
            <PopoverCalendar
              onChange={((date) => {
                setDueDate(dayjs(date))
              })}
            >
              <div className={`relative flex-1`}>
                <input
                  className={`read-only:bg-input/50 read-only:placeholder:text-gray-400 read-only:cursor-default focus:outline-none bg-input px-2 py-4 rounded-lg w-full`}
                  type="text"
                  placeholder="วันที่คืน"
                  value={dueDate?.format(`DD MMM YYYY`) ?? ""}
                />
                <CalendarDays
                  className={`absolute right-2 top-1/2 -translate-y-1/2`}
                />
              </div>
            </PopoverCalendar>
          </div>
          <div className={`mt-4 relative`}>
            <input
              className={`read-only:bg-input/50 read-only:placeholder:text-gray-400 read-only:cursor-default focus:outline-none bg-input px-2 py-4 rounded-lg w-full`}
              type="text"
              placeholder="ชื่อผู้ยืม"
              onChange={(e) => {
                if(e.target.value === ""){
                  setUserList([])
                  setSearchUserText("")
                  return
                }
                handleSearchUser(e.target.value)
              }}
              value={searchUserText}
            />
            {user && (
              <div className={`flex gap-4 items-center border border-gray-300 rounded-full bg-white h-10 absolute top-2 left-2 pl-3 pr-2`}>
                <div className={``}>
                  {`${user.firstName} ${user.lastName}`}
                </div>
                <Button
                  onClick={() => {
                    setUser(undefined)
                  }}
                  variant={`outline`} className={`size-6 rounded-full`}
                >
                  <X />
                </Button>
              </div>
            )}
            {userList.length > 0 &&
              <div className={`h-[200px] flex flex-col gap-1 mt-2`}>
                {userList.map((user) => {
                  return (
                    <div
                      className={`odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-300 cursor-pointer py-2 px-1 rounded-lg`}
                      onClick={() => {
                        setUser(user)
                        setSearchUserText("")
                        setUserList([])
                      }}
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  )
                })}
              </div>
            }
          </div>
          <div className={`mt-4`}>
            <Button
            onClick={onSubmit}
            disabled={disabledConfirm()} className={`w-full min-h-10`}>
              บันทึก
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAppBorrow;
