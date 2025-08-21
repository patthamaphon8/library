"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const route = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    console.log(username, password);
    const response = await signIn("credentials", {
      username: username,
      password: password,
      redirect: true,
      redirectTo: "/"
    });
    console.log(response)
  };
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-white">
      <Image
        src={"/Logo.png"}
        width={540}
        height={133}
        className="absolute top-0 left-0 bg-red-50"
        alt="logo"
      />
      <div className="bg-white flex flex-col items-center">
        <div className="text-xl font-bold text-center">Sign In</div>
        <div>
          <div>Username</div>
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            className="px-4 bg-[#D8DFE5] w-[462px] h-[60px] rounded-[15px]"
          />
        </div>
        <div className="mt-4">
          <div>Password</div>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="px-4 bg-[#D8DFE5] w-[462px] h-[60px] rounded-[15px]"
          />
        </div>
        <button
          onClick={() => {
            onSubmit();
          }}
          className="bg-black cursor-pointer text-white w-[420px] h-[48px] rounded-[50px] text-base mt-6"
        >
          Sign In
        </button>
        <button
          className="bg-[#F7E3AF] cursor-pointer text-black w-[420px] h-[48px] rounded-[50px] text-base mt-6"
          onClick={() => {
            route.push("/register");
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
