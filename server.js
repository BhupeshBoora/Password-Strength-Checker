import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.listen(port, () =>
{
    console.log(`Server is running on Port: ${port}`);
});

app.post("/", (userReq, myRes) =>
{
    var password = userReq.body.password;
    var passwordArray = password.split("");

    var result = "Empty";


    myRes.json(result);


    //1: Check if the password contains less than 8 characters => Unacceptable =>
    //If only the password is longer than 8 characters, the below tests will be taken

    //2: Check if the password contains only numbers or only letters => Poor =>

    //3: Check if the password contains both numbers and letter => Acceptable 

    //4: Check if the password contains numbers and special characters => Good

    //5: Check if the password contains letters and special characters => Good

    //6: Check if the password contains letters and numbers as well as special characters => Excellent

    //7: Check if the password matches against the 1000 most common passwords
});