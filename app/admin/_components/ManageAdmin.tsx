"use client";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Check, MoreHorizontal, Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DialogConfirm from "@/components/DialogConfirm";
import { toast } from "sonner";
import { revalidate } from "@/lib/action/base";
import { approveAdmin, rejectAdmin } from "@/lib/action/admin";

interface ManageAdminProps {
  className?: string;
  adminLish?: Prisma.AdminGetPayload<{}>[];
}

const renderStatus = (isApprove?: boolean | null) => {
  let color = "text-green-500";
  let text = "อนุมัติ";
  if (isApprove === null) {
    color = "text-amber-500";
    text = "รอดำเนินการ";
  } else if (isApprove === false) {
    color = "text-red-500";
    text = "ปฏิเสธ";
  }
  return <div className={`${color}`}>{text}</div>;
};

const ManageAdmin = ({ className, adminLish }: ManageAdminProps) => {
  // const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const [selectedAdmin, setSelectedAdmin] = useState<number | undefined>();
  const [isOpenApprove, setIsOpenApprove] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (!searchText) {
        params.delete("search");
      } else {
        params.set("search", searchText);
      }
      router.replace(`/admin?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounce); // ล้าง timeout ถ้าพิมพ์ต่อ
  }, [searchText, router]);

  const handleOnCancelApprove = () => {
    setIsOpenApprove(false);
    setSelectedAdmin(undefined);
  };

  const handleOnConfirmApprove = async () => {
    if (!selectedAdmin) {
      toast.error(`selectedAdmin is ${selectedAdmin}`);
      return;
    }
    const response = await approveAdmin(selectedAdmin);
    if (!response) {
      toast.error(`อนุมัติ admin ไม่สำเร็จ`);
      return;
    }
    toast.success(`อนุมัติ admin สำเร็จ`);
    revalidate(`/admin`);
  };

  const handleOnCancelReject = () => {
    setIsOpenReject(false);
    setSelectedAdmin(undefined);
  };

  const handleOnConfirmReject = async () => {
    if (!selectedAdmin) {
      toast.error(`selectedAdmin is ${selectedAdmin}`);
      return;
    }
    const response = await rejectAdmin(selectedAdmin);
    if (!response) {
      toast.error(`ปฏิเสธ admin ไม่สำเร็จ`);
      return;
    }
    toast.success(`ปฏิเสธ admin สำเร็จ`);
    revalidate(`/admin`);
  };

  return (
    <div className={cn(``, className && className)}>
      {/* <DialogAddUser open={isOpen} onOpenChange={setIsOpen} /> */}
      <DialogConfirm
        open={isOpenApprove}
        onOpenChange={setIsOpenApprove}
        title={<div>อนุมัติ admin</div>}
        desc={<div>คุณต้องการอนุมัติ Admin นี้</div>}
        cancelText="ยกเลิก"
        confirmText="อนุมัติ"
        onCancel={handleOnCancelApprove}
        onConfirm={handleOnConfirmApprove}
      />
      <DialogConfirm
        open={isOpenReject}
        onOpenChange={setIsOpenReject}
        title={<div>ปฏิเสธ admin</div>}
        desc={<div>คุณต้องการปฏิเสธ Admin นี้</div>}
        cancelText="ยกเลิก"
        confirmText="ปฏิเสธ"
        onCancel={handleOnCancelReject}
        onConfirm={handleOnConfirmReject}
      />
      <div className={`flex gap-4 justify-center`}>
        <div
          className={`bg-input h-10 rounded-lg relative flex items-center gap-3 pl-3 flex-1`}
        >
          <Search className={``} />
          <input
            type="text"
            className={`h-10 flex-1 focus:outline-none`}
            placeholder="ค้นหาชื่อ-นามสกุล"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {/* <Button onClick={() => setIsOpen(true)} className={`min-h-10`}>
          <Plus />
        </Button> */}
      </div>
      <table className={`w-full mt-4`}>
        <thead className={`text-sm`}>
          <tr>
            <th className={`bg-gray-200 rounded-l-2xl py-2 px-2`}>ID</th>
            <th className={`bg-gray-200 py-2`}>ชื่อ</th>
            <th className={`bg-gray-200 py-2`}>นามสกุล</th>
            <th className={`bg-gray-200 py-2`}>เบอร์โทร</th>
            <th className={`bg-gray-200 py-2`}>สถานะ</th>
            <th className={`bg-gray-200 py-2`}>วันที่สร้าง</th>
            <th className={`bg-gray-200 rounded-r-2xl py-2`}>action</th>
          </tr>
        </thead>
        <tbody className={`text-center text-sm`}>
          {adminLish?.map((admin, index) => {
            return (
              <tr key={`user${index}`}>
                <td className={`py-2`}>{admin.id}</td>
                <td className={`py-2`}>{admin.firstName}</td>
                <td className={`py-2`}>{admin.lastName}</td>
                <td className={`py-2`}>{admin.phoneNumber}</td>
                <td className={`py-2`}>{renderStatus(admin.isApprove)}</td>
                <td className={`py-2`}>
                  {dayjs(admin.createdAt).format("DD MMM YYYY HH:mm")}
                </td>
                <td className={`py-2`}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`focus:outline-none cursor-pointer`}
                    >
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAdmin(admin.id)
                          setIsOpenApprove(true)
                        }}
                        disabled={admin.isApprove === true || admin.isSuperAdmni}
                        className={`text-green-600`}
                      >
                        <Check className={`text-inherit`} />
                        <div>อนุมัติ</div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAdmin(admin.id)
                          setIsOpenReject(true)
                        }}
                        disabled={admin.isApprove === false || admin.isSuperAdmni}
                        className={`text-red-600`}
                      >
                        <X className={`text-inherit`} />
                        <div>ปฏิเสธ</div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAdmin;
