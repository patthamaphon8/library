"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Book, LogOut, UserCircle2, UserLock, Users2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MenuSide = () => {
  const session = useSession();
  const pathname = usePathname();
  
  return (
    <div className="bg-gray-300 h-dvh min-w-[200px] p-4 flex flex-col">
      <div className={`flex items-center gap-2`}>
        <UserCircle2 size={24} />
        <div className={`text-lg font-semibold`}>
          {session.data?.user?.email}
        </div>
      </div>
      <div className={`mt-8 flex-1`}>
        <Link
          className={cn(
            `flex items-center gap-2 rounded-lg p-2`,
            pathname === "/" && `bg-black text-white`
          )}
          href={`/`}
        >
          <ArrowUpDown size={24} />
          <div className={`font-medium`}>การยืม - คืน</div>
        </Link>
        <Link
          className={cn(
            `flex items-center gap-2 rounded-lg p-2`,
            pathname === "/book" && `bg-black text-white`
          )}
          href={`/book`}
        >
          <Book size={24} />
          <div className={`font-medium`}>หนังสือ</div>
        </Link>
        <Link
          className={cn(
            `flex items-center gap-2 rounded-lg p-2`,
            pathname === "/user" && `bg-black text-white`
          )}
          href={`/user`}
        >
          <Users2 size={24} />
          <div className={`font-medium`}>จัดการผู้ใช้</div>
        </Link>
        <Link
          className={cn(
            `flex items-center gap-2 rounded-lg p-2`,
            pathname === "/admin" && `bg-black text-white`
          )}
          href={`/admin`}
        >
          <UserLock size={24} />
          <div className={`font-medium`}>จัดการ Admin</div>
        </Link>
      </div>
      <div>
        <Button onClick={() => signOut({
          redirect: true,
          redirectTo: `/login`
        })} className={`min-h-10 w-full flex gap-3`}>
          <div>
            ออกจากระบบ
          </div>
          <LogOut size={24} />
        </Button>
      </div>
    </div>
  );
};

export default MenuSide;
