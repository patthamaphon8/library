import { Users2 } from "lucide-react";
import React from "react";
import ManageUser from "./_components/ManageUser";
import { listUser } from "@/lib/action/user";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login`);
  }
  const responseUser = await listUser();
  return (
    <div className={`p-4`}>
      <div className={`bg-white border border-black p-4 rounded-2xl`}>
        <div className={`flex gap-4`}>
          <Users2 size={32} />
          <div className={`text-2xl font-bold`}>User</div>
        </div>
        <ManageUser className={`mt-6`} userList={responseUser} />
      </div>
    </div>
  );
};

export default page;
