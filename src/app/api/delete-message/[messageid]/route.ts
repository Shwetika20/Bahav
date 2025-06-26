import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";  // Import mongoose

export async function DELETE(request: Request, {params}: {params: {messageid:string}}){
    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status : 401}
        )
    }
    try {
        // Convert messageId string to MongoDB ObjectId
        const objectId = new mongoose.Types.ObjectId(messageId);
        
        // Use 'message' (singular) instead of 'messages'
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: objectId } } }
        );
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                { status : 404}
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted"
            },
            { status : 200}
        )
    } catch (error) {
        console.log("Error in delete message route", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            { status : 500}
        )
    }
}