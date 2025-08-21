"use client";
import { addAdmin } from "@/lib/action/admin";
import { addUser } from "@/lib/action/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const route = useRouter()
  const [isSuccess,setIsSuccess] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorInfo, setErrorInfo] = useState({
      firstName : false,
      lastName: false,
      birthDate: false,
      phoneNumber: false,
      userName: false,
      password: false,
      confirmPassword: false,
  })
  const onSubmit = async () => {
    setErrorInfo({
      firstName : false,
      lastName: false,
      birthDate: false,
      phoneNumber: false,
      userName: false,
      password: false,
      confirmPassword: false,
    })
    console.log({
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      userName,
      password,
      confirmPassword,
    });
    let isError = false
    if(firstName === ""){
      setErrorInfo((prev)=>({
        ...prev,
        firstName: true,
      }))
      isError = true
    }
     if(lastName === ""){
      setErrorInfo((prev)=>({
        ...prev,
        lastName: true,
      }))
      isError = true
    }
     if(birthDate === ""){
      setErrorInfo((prev)=>({
        ...prev,
        birthDate: true,
      }))
      isError = true
    }
     if(phoneNumber === ""){
      setErrorInfo((prev)=>({
        ...prev,
        phoneNumber: true,
      }))
      isError = true
    }
     if(userName === ""){
      setErrorInfo((prev)=>({
        ...prev,
        userName: true,
      }))
      isError = true
    }
     if(password === ""){
      setErrorInfo((prev)=>({
        ...prev,
        password: true,
      }))
      isError = true
    }
     if(confirmPassword === ""){
      setErrorInfo((prev)=>({
        ...prev,
        confirmPassword: true,
      }))
      isError = true
    }
    if(isError === true){
      return
    }
    console.log("สร้างUser");
    const response = await addAdmin({
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      username: userName,
      password,
    })
    console.log(response);
    if(!response){
      return
    }
    setIsSuccess(true)
  };
  return (
    <div className={`absolute inset-0 flex justify-center items-center`}>
      {isSuccess && (
      <div className="bg-white absolute inset-0 flex justify-center items-center">
        <div>
        <Image src={`/correct.gif`} alt="" width={220} height={160} className="bg-red-400 ml-[146px]"/>
        <div className="text-center text-xl font-bold">
          ลงทะเบียนสำเร็จ
        </div>
        <div className="text-center mt-2">
          กรุณารอทาง Super Admin ดำเนินการอนุมัติ อาจจะใช้เวลา 1-3 วันทำการ
        </div>
        <div className="mt-2 text-center">
          <button className="px-4 py-2 bg-black text-white rounded-[64px] h-[40px] cursor-pointer"
          onClick={()=>{
            route.push("/")
          }}>
          Go to Sign In
          </button>
        </div>
        </div>
      </div>
      )}
      <div className="border border-black rounded-[36px] p-6">
        <div className="text-2xl font-bold text-center">Create an account</div>
        <div className="flex gap-8 mt-4">
          <div>
            <div>First Name</div>
            <input
              type="text"
              className={`bg-[#D8DFE5] w-[278px] h-[52px] rounded-[15px] ${errorInfo.firstName===true ? `border border-red-400` : ``}`}
              onChange={(e) => {
                console.log(e.target.value);
                setFirstName(e.target.value);
              }}
            />
          </div>
          <div>
            <div>Last Name</div>
            <input
              type="text"
              className={`bg-[#D8DFE5] w-[278px] h-[52px] rounded-[15px] ${errorInfo.lastName===true ? `border border-red-400` : ``}`}
              onChange={(e) => {
                console.log(e.target.value);
                setLastName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex gap-8 mt-4">
          <div>
            <div>Birth Date</div>
            <input
              type="date"
              className={` bg-[#D8DFE5] w-[278px] h-[52px] rounded-[15px] ${errorInfo.birthDate===true ? `border border-red-400` : ``}`}
              onChange={(e) => {
                console.log(e.target.value);
                setBirthDate(e.target.value);
              }}
            />
          </div>
          <div>
            <div>Phone Number</div>
            <input
              type="text"
              maxLength={10}
              className={`bg-[#D8DFE5] w-[278px] h-[52px] rounded-[15px] ${errorInfo.phoneNumber===true ? `border border-red-400` : ``}`}
              onChange={(e) => {
                const regex = /^[0-9]+$/;
                console.warn(parseInt(e.target.value))
                console.warn(isNaN(parseInt(e.target.value)))
                if(regex.test(e.target.value) === false){
                  return
                }
                console.log(e.target.value);
                setPhoneNumber(e.target.value);
              }}
              value={phoneNumber}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-center">Username</div>
          <input
            type="text"
            className={`bg-[#D8DFE5] w-full h-[52px] rounded-[15px] ${errorInfo.userName===true ? `border border-red-400` : ``}`}
            onChange={(e) => {
              console.log(e.target.value);
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="mt-4">
          <div className="text-center">Password</div>
          <input
            type="password"
            className={`bg-[#D8DFE5] w-full h-[52px] rounded-[15px] ${errorInfo.password===true ? `border border-red-400` : ``}`}
            onChange={(e) => {
              console.log(e.target.value);
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="mt-4">
          <div className="text-center">Confirm Password</div>
          <input
            type="password"
            className={`bg-[#D8DFE5] w-full h-[52px] rounded-[15px] ${errorInfo.confirmPassword===true ? `border border-red-400` : ``}`}
            onChange={(e) => {
              console.log(e.target.value);
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 bg-black text-white rounded-[64px] w-[116px] h-[40px] cursor-pointer"
            onClick={() => onSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
