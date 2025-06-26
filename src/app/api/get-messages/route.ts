import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    console.log("Session in get-message:", session ? "exists" : "null")//added
    const user: User = session?.user as User
    console.log("User ID:", user?._id)//added

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status : 401}
        )
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        // First check if user exists
        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status : 404}
            )
        }
        
        // If user has no messages, return empty array
        if (!userExists.message || userExists.message.length === 0) {
            return Response.json(
                {
                    success: true,
                    message: []
                },
                { status : 200}
            )
        }
        
        // Otherwise, proceed with aggregation

        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$message'},
            {$sort: {'message.createdAt': -1}},
            {$group: {_id: '$_id', message: {$push:'$message'}}}
        ])

        if (!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status : 401}
            )

        }

        return Response.json(
            {
                success: true,
                messages: user[0].message
            },
            { status : 200}
        )

    } catch (error) {
        console.log("An unexpected error occured: ", error)
        return Response.json(
            {
                success: false,
                message: "An unexpected error occured"
            },
            { status : 500}
        )
    }
}