import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.listen(port, () =>
{
    console.log(`Server is running on Port: ${port}`);
});

app.post("/", async (userReq, myRes) =>
{
    try
    {
        var password = userReq.body.password;
        var analysis;

        if (!password)
        {
            analysis = "No password was provided";
            return myRes.json({Result: analysis});
        }

        var passwordHash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
        var firstFiveHash = passwordHash.slice(0, 5);
        var restHash = passwordHash.slice(5);
    
        var hasLetters = /[a-zA-Z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasSpecial = /[^\da-zA-Z]/.test(password);
        var hasSpace = /\s/.test(password);
      
        var response = await axios.get(`https://api.pwnedpasswords.com/range/${firstFiveHash}`, 
            {
                headers:
                {
                    "User-Agent": "PasswordStrengthCheckerProject/1.0"
                }
            }
        );

        var responseHashes = response.data.split("\n");
        var found = responseHashes.find(resHash => resHash.startsWith(restHash));
        
        if (found)
        {
            analysis = "Password found in several breached databases";
        }
        else if (hasSpace)
        {
            analysis = "Password contains space";
        }
        else if (password.length < 8)
        {
            analysis = "Password is too short";
        }
        else
        {
            if (hasLetters && hasNumbers && hasSpecial)
            {   
                analysis = "Excellent strength";
            } 
            else if (hasLetters && hasNumbers || hasLetters && hasSpecial || hasNumbers && hasSpecial)
            {
                analysis = "Good strength";
            }
            else if (hasLetters || hasNumbers || hasSpecial)
            {
                analysis = "Poor strength";
            }
        }

        myRes.status(200).json({result: analysis});
    }

    catch (error)
    {
        console.log(error.message);
        myRes.status(500).json("Something went wrong on the server");
    }

});