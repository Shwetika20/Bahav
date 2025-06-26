import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import {usernameValidation} from "@/schemas/signUpSchema"


//Entirely set new
export async function POST(request: Request) {
    console.log("Starting verify-code API endpoint");
    
    try {
      await dbConnect();
      console.log("Database connected");
      
      const body = await request.json();
      console.log("Request body received:", body);
      
      const { username, code } = body;
      
      if (!username) {
        console.log("No username provided in request");
        return Response.json(
          {
            success: false,
            message: "Username is required"
          },
          { status: 400 }
        );
      }
      
      console.log("Looking up user with username:", username);
      const user = await UserModel.findOne({ username });
      
      if (!user) {
        console.log("User not found with username:", username);
        return Response.json(
          {
            success: false,
            message: "User not found"
          },
          { status: 404 }  // Changed from 500 to 404 for Not Found
        );
      }
      
      console.log("User found:", { 
        id: user._id,
        isVerified: user.isVerified,
        hasVerifyCode: !!user.verifyCode
      });
      
      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
      
      console.log("Verification check:", { 
        isCodeValid, 
        isCodeNotExpired,
        submittedCode: code,
        storedCode: user.verifyCode,
        codeExpiry: user.verifyCodeExpiry
      });
  
      if (isCodeValid && isCodeNotExpired) {
        user.isVerified = true;
        await user.save();
        console.log("User successfully verified");
        
        return Response.json(
          {
            success: true,
            message: "Account verified successfully"
          },
          { status: 200 }
        );
      } else if (!isCodeNotExpired) {
        console.log("Verification code expired");
        return Response.json(
          {
            success: false,
            message: "Verification code has expired, please signup again to get a new code"
          },
          { status: 400 }
        );
      } else {
        console.log("Incorrect verification code");
        return Response.json(
          {
            success: false,
            message: "Incorrect verification code"
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return Response.json(
        {
          success: false,
          message: "Error verifying user"
        },
        { status: 500 }
      );
    }
  }
// //GET or POST any
// export async function POST(request: Request) {
    
//     await dbConnect();

//     try {
//         const {username, code} = await request.json()
//         const decodedUsername = decodeURIComponent(username)
//         console.log("Decoded Username:", decodedUsername);
//         const user = await UserModel.findOne({username: decodedUsername})

//         if (!user) {
//             console.log("User not found");
//             return Response.json(
//                 {
//                     success: false,
//                     message: "User not found"
//                 },
//                 { status : 500}
//             )
//         }

//         const isCodeValid = user.verifyCode == code
//         const isCodeNotExpired = new Date(user.verifyCodeExpiry)> new Date()

//         if (isCodeValid && isCodeNotExpired) {
//             user.isVerified = true
//             await user.save()

//             return Response.json(
//                 {
//                     success: true,
//                     message: "Account verified successfully"
//                 },
//                 { status : 200}
//             )
//         }else if (!isCodeNotExpired) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "Verification code has expired, please signup again to get a new code"
//                 },
//                 { status : 400}
//             )
//         } else {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "Incorrect Verification code"
//                 },
//                 { status : 400}
//             )
//         }




//     } catch (error) {
//         console.error("Error verifying user", error)
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error verifying user"
//             },
//             { status : 500}
//         )
//     }
// }