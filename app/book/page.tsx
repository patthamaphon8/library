"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Prisma } from "@/generated/prisma";
import { addBook, listBook } from "@/lib/action/book";
import { useUploadThing } from "@/lib/utils";
import { useDropzone } from "@uploadthing/react";
import { LoaderCircle, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

const BookPage = () => {
  const session = useSession();
  const router = useRouter();
  console.log(
    "🚀 ~ page book ~ session:",
    session.status === "unauthenticated"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [filePreview, setFilePreview] = useState<
    string | ArrayBuffer | null | undefined
  >();
  const [name, setName] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [bookList, setBookList] = useState<
    Prisma.BookGetPayload<{ include: { copies: true } }>[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status]);

  const onSubmit = async () => {
    setIsLoading(true);
    console.log("namoo");
    if (!file) {
      alert("กรุณาใส่รูปหนังสือ");
      return;
    }
    if (!name) {
      alert("กรุณาใส่ชื่อหนังสือ");
      return;
    }
    if (!category) {
      alert("กรุณาใส่หมวดหมู่");
      return;
    }
    const responseFile = await startUpload([file]);
    if (!responseFile) {
      alert(`upload image failed`);
      return;
    }
    const response = await addBook({
      name: name,
      category: category,
      image: responseFile[0].ufsUrl,
    });
    console.log(response);
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleListBook = async () => {
    const response = await listBook();
    console.log(response);
    if (!response) {
      return;
    }
    setBookList(response);
  };

  useEffect(() => {
    handleListBook();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      // alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl p-4 border border-black">
        <div className="text-xl font-bold">หนังสือ</div>
        <div className="flex gap-4 justify-between">
          <div className="bg-[#e6e6ea] rounded-lg h-10 flex-1">
            <input
              type="text"
              className="h-full w-full placeholder:text-sm px-3"
              placeholder="ค้นหาหนังสือ...."
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
            className="bg-black text-white h-10 w-10 flex justify-center items-center text-2xl font-bold rounded-lg cursor-pointer"
          >
            <Plus />
          </button>
        </div>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th
                className={`bg-gray-200 rounded-l-2xl py-2 px-2 text-left pl-8`}
              >
                ชื่อหนังสือ
              </th>
              <th className={`bg-gray-200 py-2`}>หมวดหมู่</th>
              <th className={`bg-gray-200 rounded-r-2xl py-2`}>จำนวน</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {bookList
              .filter((book) =>
                searchText === "" ? true : book.name.startsWith(searchText)
              )
              .map((book, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2">
                      <div className="flex gap-4 items-center">
                        <img
                          src={book.image}
                          alt="bookImage"
                          width={66}
                          height={66}
                          className="rounded-lg drop-shadow-md bg-white"
                        />
                        <div className="text-left">
                          <div className="font-bold text-lg text-black/85">
                            {book.name}
                          </div>
                          <Link href={`/book/${book.id}`}>
                            <div className="text-gray-500 underline text-sm cursor-pointer">
                              รายละเอียด
                            </div>
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-2  font-bold">{book.category}</td>
                    <td className="py-2  font-bold">{book.copies.length}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className=" flex gap-4">
            <div
              className="flex justify-center items-center pb-6 w-[170px] bg-[#e6e6ea] hover:bg-[#C2C2CC] h-[258px] rounded-2xl cursor-pointer"
              {...getRootProps()}
            >
              <input
                type="file"
                {...getInputProps()}
                multiple={false}
              />
              {filePreview ? (
                <Image width={170} height={258} src={`${filePreview}`} alt="" />
              ) : (
                <span className="text-[76px] font-bold text-[#9E9EAE]">+</span>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="">
                <input
                  type="text"
                  className="bg-[#e6e6ea] h-10 rounded-lg placeholder:text-sm p-4 w-full"
                  placeholder="ชื่อหนังสือ"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="bg-[#e6e6ea] h-10 rounded-lg placeholder:text-sm p-4 mt-4 w-full"
                  placeholder="หมวดหมู่"
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-end">
                <button
                  disabled={isLoading}
                  onClick={onSubmit}
                  className="flex items-center justify-center gap-2 cursor-pointer bg-black rounded-lg text-white w-[92px] h-[40px] text-sm font-bold"
                >
                  {isLoading && <LoaderCircle className="animate-spin" />}
                  <div>บันทึก</div>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookPage;
