import { Button } from "@/components/ui/button";
import { listBorrowTransaction } from "@/lib/action/borrowTransaction";
import { BookDown, CalendarDays, Plus, Search } from "lucide-react";
import React from "react";
import ManageBorrowTransaction from "./_components/ManageBorrowTransaction";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface pageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    filterBy?: string;
  }>;
}

const page = async ({ searchParams }: pageProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login`);
  }
  const { from, to, filterBy } = await searchParams;
  const responseListBorrowTransaction = await listBorrowTransaction(
    from,
    to,
    filterBy
  );
  return (
    <div className="p-4">
      <div className={`bg-white border border-black rounded-2xl p-4`}>
        <div className={`flex items-center gap-4`}>
          <BookDown size={32} />
          <div className={`text-2xl font-bold`}>การยืม</div>
        </div>
        <ManageBorrowTransaction
          borrowTransactions={responseListBorrowTransaction}
          className={`mt-4`}
        />
      </div>
    </div>
  );
};

export default page;
