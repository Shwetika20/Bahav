import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import {usernameValidation} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({ // in name "UsernameQuerySchema", we just prefer writing schema at the end
    username: usernameValidation //username must follow this schema
})

export async function GET(request: Request) {
    /*
    //TODO: use this in all other routes(now not required in latest version of next.js)
    if (request.method !=='GET') {
        return Response.json({
            success: false,
            message: 'Method not allowed',
        }, {status: 405})  
    }
        */ 
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")//url might be like "localhost:3000/api/cuu?username=sss?phone=android", and from here we extract 'sss'
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)//TODO: remove
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(',')
                : 'Invalid query parameters',
            }, {status: 400})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken',
            }, {status: 400})  
        }
        return Response.json({
            success: true,
            message: 'Username is unique',
        }, {status: 400}) 


    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status : 500}
        )
    }
}