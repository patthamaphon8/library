import { getBookById } from "@/lib/action/book";
import { listBookCopy } from "@/lib/action/bookCopy";
import React from "react";
import ManageBookCopy from "./_components/ManageBookCopy";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface BookDetailProps {
  params: Promise<{
    bookId: string;
  }>;
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}
const page = async ({ params, searchParams }: BookDetailProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login`);
  }
  const { bookId } = await params;
  const { search, status } = await searchParams;
  const response = await getBookById(parseInt(bookId));
  const responseBookCopy = await listBookCopy({
    bookId: parseInt(bookId),
  });
  // console.log("🚀 ~ page ~ responseBookCopy:", responseBookCopy)
  const total = responseBookCopy?.length ?? 0;
  const borrowed =
    responseBookCopy?.filter((bookCopy) => bookCopy.status === "BORROWED")
      .length ?? 0;
  const broken =
    responseBookCopy?.filter((bookCopy) => bookCopy.status === "DAMAGED")
      .length ?? 0;
  const lost =
    responseBookCopy?.filter((bookCopy) => bookCopy.status === "LOST").length ??
    0;

  return (
    <div className="p-4">
      <div
        className={`p-4 bg-white border border-black rounded-2xl flex gap-2`}
      >
        <div>
          <img
            className={`border border-black rounded-l-2xl rounded-br-2xl`}
            src={response?.image}
            alt=""
            width={400}
            height={400}
          />
          <div className={`mt-4 text-lg font-bold`}>
            หนังสือทั้งหมด: {total} เล่ม
          </div>
          <div className={`text-lg font-bold`}>ไม่ว่าง: {borrowed} เล่ม</div>
          <div className={`text-lg font-bold`}>เสียหาย: {broken} เล่ม</div>
          <div className={`text-lg font-bold`}>สูญหาย: {lost} เล่ม</div>
          <div className={`text-lg font-bold`}>
            คงเหลือ: {total - borrowed - broken - lost} เล่ม
          </div>
        </div>
        <div className={`flex-1`}>
          <div
            className={`-ml-2 min-w-[240px] w-max p-4 rounded-r-full bg-black text-white text-2xl font-bold`}
          >
            ชื่อ: {response?.name}
          </div>
          <div
            className={`-ml-2 min-w-[240px] w-max mt-4 p-4 rounded-r-full bg-black text-white text-2xl font-bold`}
          >
            หมวดหมู่: {response?.category}
          </div>
          <ManageBookCopy
            bookId={bookId}
            bookCopyList={responseBookCopy}
            search={search}
            status={status}
          />
          {/* <Button className={`mt-2`}>เลือก</Button>
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {responseBookCopy
                ?.filter((bookCopy) => {
                  const searchCode = search
                    ? bookCopy.code.toLowerCase().startsWith(search)
                    : true;
                  const searchStatus = status
                    ? bookCopy.status === status
                    : true;
                  return searchCode && searchStatus;
                })
                .map((bookCopy, index) => {
                  return (
                    <tr key={`bookCopy${index}`}>
                      <td>{bookCopy.code}</td>
                      <td>{renderStatus(bookCopy.status)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
};

export default page;
