"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const session = useSession()
  return (
    <div>
      <div>
        Home Page
      </div>
      <div>
        {JSON.stringify(session.data?.user)}
      </div>
      <button
        className={`bg-red-400 p-4 rounded-lg text-white cursor-pointer`}
        onClick={() => {
          signOut({ redirect: true, redirectTo: "/login" });
        }}
      >
        logout
      </button>
    </div>
  );
};

export default page;
