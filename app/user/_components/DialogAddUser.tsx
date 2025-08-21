"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { revalidate } from "@/lib/action/base";
import { addUser } from "@/lib/action/user";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DialogAddUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogAddUser = ({ open, onOpenChange }: DialogAddUserProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClose = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    onOpenChange(false);
  };

  const handleOnOpen = () => {
    onOpenChange(true);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (open) {
      handleOnOpen();
    } else {
      handleOnClose();
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await addUser({
        firstName,
        lastName,
        phoneNumber,
      });
      if (!response) {
        toast.error(`เกิดข้อผิดพลาดบางอย่าง`);
        return;
      }
      toast.success(`เพิ่ม user สำเร็จ`);
      revalidate("/user");
      handleOnClose()
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>จัดการผู้ใช้</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div className={`flex gap-4`}>
            <input
              type="text"
              placeholder="ชื่อ"
              className={`bg-input px-2 py-4 rounded-lg w-full`}
              value={firstName ?? ""}
              onChange={(e) => setFirstName(e.target.value)}
              // readOnly={!!bookCopy}
            />
            <input
              type="text"
              placeholder="นามสกุล"
              className={`bg-input px-2 py-4 rounded-lg w-full`}
              value={lastName ?? ""}
              onChange={(e) => setLastName(e.target.value)}
              // readOnly={!!bookCopy}
            />
          </div>
          <div className={`mt-4`}>
            <input
              type="text"
              placeholder="เบอร์โทรศัพท์"
              className={`bg-input px-2 py-4 rounded-lg w-full`}
              value={phoneNumber ?? ""}
              onChange={(e) => {
                if (e.target.value === "") {
                  setPhoneNumber("");
                }
                const parsed = /^\d+$/.test(e.target.value);
                if (parsed) {
                  setPhoneNumber(e.target.value);
                }
              }}
              // readOnly={!!bookCopy}
            />
          </div>
          <div className={`mt-4`}>
            <Button disabled={isLoading} onClick={onSubmit} className={`w-full min-h-10`}>
              {isLoading && <Loader2 className={`animate-spin`} />}
              <div>บันทึก</div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddUser;
