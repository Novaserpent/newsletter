const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");
const https = require("https");
app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/c93c11b734";
    const options = {
        method: "POST",
        auth: "ShB:26cbecd23bfc2c5558632a13a7e45e7f-us17"
    };

    const request = https.request(url, options, function(response) {
        
        console.log(response.statusCode);

    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
        response.on("data", function(data) {
        console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.redirect("/");
})




app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});

// API Key
// 26cbecd23bfc2c5558632a13a7e45e7f-us17

// List ID
// c93c11b734