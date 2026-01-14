
import { getGoogleAuthURL, oauth2Client } from "../lib/googleAuth.js";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js";
import { google } from "googleapis";


export const googleLogin = (_, res) => {
  const url = getGoogleAuthURL();
  res.redirect(url);
};

export const googleCallback = async (req,res)=>{

    try {
        const code = req.query.code;
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2=google.oauth2({version:"v2", auth: oauth2Client});
        const {data}= await oauth2.userinfo.get();

        let user = await User.findOne({email:data.email});

        if(!user){
             user= await User.create({
                fullName:data.name,
                email:data.email,
                profilePic:data.picture,
                provider:"google",
                googleId:data.id
            });
        }

        generateToken(user._id,res);
        res.redirect(ENV.CLIENT_URL);
    } catch (error) {
       next(error)
    }

}


