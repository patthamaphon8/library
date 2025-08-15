"use client";
import React, { useEffect, useRef, useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { addBookCopy } from "@/lib/action/bookCopy";
import { revalidate } from "@/lib/action/base";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

interface DialogAddBookCopyProps {
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
  bookId: number;
  children: React.ReactNode;
}

const DialogAddBookCopy = ({
  // open,
  // onOpenChange,
  bookId,
  children,
}: DialogAddBookCopyProps) => {
  const [data, setData] = useState("Not Found");
  const [isOpen, setIsOpen] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [codeManual, setCodeManual] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnAddBookCopy = async (code: string) => {
    try {
      setIsLoading(true)
      const response = await addBookCopy({
        book: {
          connect: {
            id: bookId,
          },
        },
        code: code,
        status: "AVAILABLE",
      });
      console.log(response);
      if (typeof response === "string") {
        if (response === "notUnique") {
          alert(`หนังสือเล่มนี้ ถูกเพิ่มแล้ว ID:${code}`);
          return undefined;
        }
      }
      return response;
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  };

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open === false) {
      setIsFound(false);
    }
  };

  const handleOnDetect = async (value: string) => {
    const responseAddBookCopy = await handleOnAddBookCopy(value);
    if (responseAddBookCopy) {
      handleOnOpenChange(false);
      revalidate(`/book/${bookId}`);
    } else {
      setIsFound(false);
    }
  };

  const handleOnSubmit = async () => {
    if (codeManual === undefined || codeManual === "") {
      alert(`กรุณากรอกรหัสหนังสือ`);
      return;
    }
    const response = await handleOnAddBookCopy(codeManual);
    if (response) {
      handleOnOpenChange(false);
      revalidate(`/book/${bookId}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          {!isFound && (
            <BarcodeScanner
              stopStream={isFound}
              width={500}
              height={200}
              videoConstraints={{
                aspectRatio: 21 / 9,
              }}
              onUpdate={(err, result) => {
                if (result) {
                  setIsFound(true);
                  handleOnDetect(result.getText());
                } else {
                  setData("Not Found");
                }
              }}
            />
          )}
          <div className={`text-xl font-semibold text-center mt-4`}>หรือ</div>
          <input
            type="text"
            placeholder="ใส่รหัส"
            className={`bg-input px-2 py-4 rounded-lg w-full mt-4`}
            onChange={(e) => setCodeManual(e.target.value)}
          />
          <div className={`flex justify-end mt-4`}>
            <Button disabled={isLoading} onClick={handleOnSubmit} className={`text-base font-medium`}>
              {isLoading && <LoaderCircle className="animate-spin" />}
              บันทึก
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddBookCopy;
