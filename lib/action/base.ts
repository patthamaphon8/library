"use server"

import { revalidatePath } from "next/cache"

const revalidate = (path: string) => {
    revalidatePath(path)
}

export {
    revalidate,
}