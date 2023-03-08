//To require express
const express=require("express");

//To require https for making get requests
const https=require("https");

//To require body-parser
const bodyParser=require("body-parser");

//Acquiring express module
const app=express();
//Using body-parser
app.use(bodyParser.urlencoded({extended: true}));
//To import css and images to localhost
app.use(express.static("public"));

//To handle get requests from home route("/")
app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html");
})

//To handle post responses from home route("/")
app.post("/",function(req,res){
    const city=req.body.ct;
    const apiKey="d4ddd5d908d601cc745fb3e401ead706#";
    
    //  create a url from the api key 
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=Metric&lang=en&appid="+apiKey;

    //https get method to retrieve information from any server using its url.
    https.get(url,function(response){
        console.log(response.statusCode); //To print status Code
        //To check for failed requests
        if(response.statusCode==404){
            res.sendFile(__dirname+"/failure.html");
        }

        //To Tap into the data on the server
        response.on("data",function(data){

            //To convert data from hexadecimal into json format
            const weatherData=JSON.parse(data);  //creating an object to store the data in json format

            const lon=weatherData.coord.lon; //Longitude of your city
            const lat=weatherData.coord.lat; //Latitude of your city
            const description=weatherData.weather[0].description; //To tap into a more specific data
            const temp=weatherData.main.temp;
            const pressure=weatherData.main.pressure;
            const humidity=weatherData.main.humidity;
            const windSpeed=weatherData.wind.speed;
            const icon=weatherData.weather[0].icon;
            const iconURL="http://openweathermap.org/img/wn/"+icon+"@2x.png";

            // 
            res.write(
                '<head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title></title> <link rel="stylesheet" href="CSS and Images/styles.css"></head>'
            )
            res.write("<h1>You are currently searching in "+city+" latitude ("+lat+") longitude ("+lon+")</h1><br>")
            res.write("<h1>Current weather conditions in "+city+" : "+description+"</h1>");
            res.write("<h2>Current Temp is: "+temp+" degree celcius </h2>");
            res.write("<h2>Pressure is: "+pressure+" millibars</h2>")
            res.write("<h2>Humidity is: "+humidity+"</h2>");
            res.write("<h2>Wind is currently going at a speed of "+windSpeed+" kilometers per hour </h2>")
            res.write("<img src="+iconURL+">");
            res.send();
        
        })
    })
    
})

//To handle post requests from ("/failure") route
app.post("/failure",function(req,res){
    res.redirect("/");
})

//Listen to channel 3000(port/server)
app.listen(3000,function(){
    console.log("Server started on port 3000.");
})