import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import https from "https"; // Corrected import statement
import { log } from "console";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Define a route for the root URL
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (req, res) {
  res.redirect( "/");
});

app.post("/", function (req, res) {
  const fName = req.body.Fname;
  const lName = req.body.Lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsondata = JSON.stringify(data);
  console.log(jsondata);

  const url = "https://us21.api.mailchimp.com/3.0/lists/7219f568ac";
  const options = {
    method: "POST",
    auth: "sandeep:382d88a22cea5cce874d0ea55495c55c-us21",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      console.log("subscribed Successfully");
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsondata);
  request.end();

  console.log(" " + fName + " " + lName + " " + email);
});

app.listen(process.env.PORT||3000, function (req, res) {
  console.log("Welcome to the Server");
});
