import {WebHook} from 'svix'
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
                    clerkid: data.id,
                    email: data.email_addresses[0].email_address,
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
                   
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo:data.image_url,
                }

                await userModel.findOneAndUpdate({clerkid:data.id}, userData);
                res.json({success: true, message:"User updated successfully"})

                break;

            }

            case "user.deleted":{
                await userModel.findOneAndDelete({clerkid:data.id});
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

export  {clerkWebhooks}