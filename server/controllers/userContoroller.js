import pkg from 'svix'
const { Webhook } = pkg

import userModel from '../models/userModel.js';

// api controller funtion to manage clerk user with database 
//http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {
    try {
        //create  asvix instance with clerk secret webhook //
        const wbhook = new WebHook(process.env.CLERK_SECRET_WEBHOOK);

        await wbhook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers['svix-id'],
            "svix-timestamp":req.headers['svix-timestamp'],
            "svix-signature":req.headers['svix-signature']
        })

        const {data, type} = req.body;
        switch (type) {
            case "user.created":{

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses && data.email_addresses[0] ? data.email_addresses[0].email_address : "unknown@email.com",
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo:data.image_url,
                }

                await userModel.create(userData);
                res.json({success: true, message:"User created successfully"})
                break;

            }
               
            case "user.updated":{

                const userData = {
                   
                    email: data.email_addresses && data.email_addresses[0] ? data.email_addresses[0].email_address : "unknown@email.com",
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo:data.image_url,
                }

                await userModel.findOneAndUpdate({clerkId:data.id}, userData);
                res.json({success: true, message:"User updated successfully"})

                break;

            }

            case "user.deleted":{
                await userModel.findOneAndDelete({clerkId:data.id});
                res.json({success: true, message:"User deleted successfully"})
                break;

            }
               
        
            default:
                break;
        }
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message})
    }

    
}




//api usercredits contoller function to get user available credits data

const userCredits = async (req, res) => {
    try {
        const clerkid = req.clerkid;

        let userData = await userModel.findOne({ clerkId: clerkid });

        if(!userData){
            // Development Fallback: If webhook didn't catch the user creation, create them dynamically
            userData = await userModel.create({
                clerkId: clerkid,
                email: "unknown@email.com",
                photo: "https://www.gravatar.com/avatar/?d=mp",
                firstName: "User",
                lastName: "",
                creditBalance: 1000
            })
        }

        res.json({success: true, credits:userData.creditBalance})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message})
    }
}

export {clerkWebhooks, userCredits}