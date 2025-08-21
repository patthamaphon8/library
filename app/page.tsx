import { listBorrowTransaction } from "@/lib/action/borrowTransaction";
import React from "react";
import OverView from "./_components/OverView";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth()
  if(!session?.user){
    redirect(`/login`)
  }
  const responseListBorrowTransaction = await listBorrowTransaction();

  return (
    <div className={`p-4`}>
      <div className={`border border-black bg-white p-4 rounded-2xl`}>
        <div className={`text-2xl font-bold`}>ประวัติการยืมหนังสือล่าสุด</div>
        <OverView
          className={`mt-4`}
          borrowTransactions={responseListBorrowTransaction}
        />
      </div>
    </div>
  );
};

export default page;
