"use client";
import { Prisma } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import DialogAddUser from "./DialogAddUser";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

interface ManageUserProps {
  userList?: Prisma.UserGetPayload<{}>[];
  className?: string;
}

const ManageUser = ({ userList, className }: ManageUserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn(``, className && className)}>
      <DialogAddUser open={isOpen} onOpenChange={setIsOpen} />
      <div className={`flex gap-4 justify-center`}>
        <div
          className={`bg-input h-10 rounded-lg relative flex items-center gap-3 pl-3 flex-1`}
        >
          <Search className={``} />
          <input
            type="text"
            className={`h-10 flex-1 focus:outline-none`}
            placeholder="ค้นหาชื่อ-นามสกุล"
          />
        </div>
        <Button onClick={() => setIsOpen(true)} className={`min-h-10`}>
          <Plus />
        </Button>
      </div>
      <table className={`w-full mt-4`}>
        <thead className={`text-sm`}>
          <tr>
            <th className={`bg-gray-200 rounded-l-2xl py-2 px-2`}>ID</th>
            <th className={`bg-gray-200 py-2`}>ชื่อ</th>
            <th className={`bg-gray-200 py-2`}>นามสกุล</th>
            <th className={`bg-gray-200 py-2`}>เบอร์โทร</th>
            <th className={`bg-gray-200 rounded-r-2xl py-2`}>วันที่สร้าง</th>
          </tr>
        </thead>
        <tbody className={`text-center text-sm`}>
          {userList?.map((user, index) => {
            return (
              <tr key={`user${index}`}>
                <td className={`py-2`}>{user.id}</td>
                <td className={`py-2`}>{user.firstName}</td>
                <td className={`py-2`}>{user.lastName}</td>
                <td className={`py-2`}>{user.phoneNumber}</td>
                <td className={`py-2`}>{dayjs(user.createdAt).format("DD MMM YYYY HH:mm")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
