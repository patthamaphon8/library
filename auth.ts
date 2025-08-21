import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./lib/action/admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages:{
    signIn: "/login",
  },
    providers: [
    Credentials({
      credentials: {
        username: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credential) => {
        console.log({
            username: credential.username,
            password: credential.password,
        })
        if(typeof credential.username !== "string") {
            return null
        }
        if(typeof credential.password !== "string") {
            return null
        }
       const response = await login(credential.username,credential.password)
       if (!response || response.isApprove === false) {
        return null
       }
        return {
            email: response.username,
            id: response.id.toString(),
            name: `${response.firstName} ${response.lastName}`,
            image: null,
        }
      }
    }),
  ],
});
