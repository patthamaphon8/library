import { ShieldUserIcon } from "lucide-react";
import React from "react";
import ManageAdmin from "./_components/ManageAdmin";
import { listAdmin } from "@/lib/action/admin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface AdminPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const page = async ({ searchParams }: AdminPageProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login`);
  }
  const { search } = await searchParams;
  console.log("🚀 ~ page ~ search:", search);
  const response = await listAdmin(
    search
      ? {
          OR: [
            {
              firstName: {
                startsWith: search,
              },
            },
            {
              lastName: {
                startsWith: search,
              },
            },
          ],
        }
      : undefined
  );

  return (
    <div className={`p-4`}>
      <div className={`p-4 border border-black/85 rounded-2xl bg-white`}>
        <div className={`flex gap-4 items-center`}>
          <ShieldUserIcon size={32} />
          <div className={`text-2xl font-bold`}>Admin</div>
        </div>
        <ManageAdmin className={`mt-6`} adminLish={response} />
      </div>
    </div>
  );
};

export default page;
