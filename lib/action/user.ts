"use server"

import { Prisma, PrismaClient } from "@/generated/prisma"

// const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const getUser = async () => {
    try {
        const user = await prisma.user.findFirst()
        console.log(user)
        return user
    } catch (error) {
        console.error(error)
    } finally {
        prisma.$disconnect()
    }
}

const addUser = async (data: Prisma.UserCreateInput) => {
    try {
        const responseAddUser = await prisma.user.create({
            data: data,
        })
        console.log(responseAddUser)
        return responseAddUser
    } catch (error) {
        console.error(error)
    } finally {
        prisma.$disconnect()
    }
}

const login = async (email:string, password:string) => {
    try {
        const responseLogin = await prisma.user.findFirst({
            where: {
                username: email,
                password: password,
            }
        })
        console.log("user.ts",responseLogin);
        return responseLogin
    } catch (error) {
        console.error(error)
    } finally {
        prisma.$disconnect()
    }
}

export {
    getUser,
    addUser,
    login,
}