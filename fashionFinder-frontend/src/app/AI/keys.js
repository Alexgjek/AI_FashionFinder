
const cors = require("cors");
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

const db = require('./db');

let myKeys = [{
"Color": "", 
"Sleevelength": "", 
"ClothesType": ["Tops", "Bottoms", "Dresses", "Outerwear","Activewear", "Loungewear", "Swimwear", "Accessories", "Formalwear", "Workwear", "Maternity Clothing", "Children's Clothing"], 
"Gender": "", 
"NeckType": "", 
"Size": "", 
"ShoesType": ["Athletic Shoes", "Casual Shoes", "Formal Shoes", "Boots", "Sandals", "Specialized Sports Shoes", "Outdoor Shoes", "Work Shoes", "Fashion Shoes", "Waterproof Shoes"]
}]

myKeys[0].Color="red"
myKeys[0].Sleevelength="long"
myKeys[0].ClothesType="shirt"
myKeys[0].Gender="female"
myKeys[0].NeckType="crew"
myKeys[0].Size="small"
myKeys[0].ShoesType= "Heels"

console.log("myKeys", myKeys);

var inputValue = "I want a large pink short sleeve v neck top female";

console.log("text", inputValue);

const { compareSync } = require("bcryptjs")
const express = require("express");
const OpenAI =require("openai")
const app = express()
app.use(cors());
app.use(express())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const openai = new OpenAI({
    apiKey: OPENAI_KEY
})

const saveResult = async (content) => {
    let dirName = path.join(__dirname, 'output');
    console.log(`Saving result to ${dirName}`);
    let fileName = moment().format("YYYYMMDDHHmmssSSS") + ".json";
    await fs.ensureDir(dirName);
    await fs.writeFile(path.join(dirName, fileName), JSON.stringify(content), {
        encoding: "utf8"
    })
}

app.get('/', (req, res, next) => {
    res.send("AI API IS WORKING...");
})

app.get('/getResponse', async (req, res) =>{
    let prompt = inputValue + ", Extrat the following keys \"" + Object.keys(myKeys[0]).join(",") + "\" as a json object";
    const response =  await openai.chat.completions.create({
        // model:'davinci-002',
        // model:'text-davinci-003',
        model: "gpt-3.5-turbo",
        // prompt: UserInput,
        messages: [{"role":"user","content":prompt}],
        // messages:[{"role":"user","content":"essay on global warming"}],
        max_tokens:100 
    })
    console.log (response.choices[0].message)

    var attributes = JSON.parse(response.choices[0].message.content)
    res.send(attributes)
})

app.post('/prompt', async (req, res) =>{
    let prompt = req.body.prompt + ", Extrat the following keys \"" + Object.keys(myKeys[0]).join(",") + "\" as a json object";
    const response =  await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role":"user","content":prompt}],
        max_tokens:100 
    })

    console.log(JSON.stringify(response));

    var attributes = JSON.parse(response.choices[0].message.content);

    /**
     * TODO
     * Pass these attributes to MongoDB to filter the results
     * and get the links back (links)
     * then send back the result to the user using res.send(links)
     */
    let matches = await db.findMatches(attributes);

    // res.send(attributes);
    res.send(matches);

    if(attributes.Color == "Not Specified" || attributes.Color == "N/A" || attributes.Color == "NA" || attributes.Color == "Any" || attributes.Color == "null" ){
        console.log("What color are you looking for?")
    }  

    if(attributes.ClothesType == "Not Specified" || attributes.ClothesType == "N/A" || attributes.ClothesType == "NA" || attributes.ClothesType == "Any" || attributes.ClothesType == "null" ){
        console.log("What clothing item are you looking for?")
    } 

    if(attributes.Gender == "Not Specified" || attributes.Gender == "N/A" || attributes.Gender == "NA" || attributes.Gender == "Any" || attributes.Gender == "null" || attributes.Gender == "unisex" || attributes.Gender == "unspecified"  || attributes.Gender == ""){
        console.log("What is your gender?")
    } 

    if(attributes.Size == "Not Specified" || attributes.Size == "N/A" || attributes.Size == "NA" || attributes.Size == "Any" || attributes.Size == "null" || attributes.Size == "unisex" || attributes.Size == "unspecified"  || attributes.Size == ""){
        console.log("What is your size?")
    } 

    saveResult({
        prompt: req.body.prompt,
        result: JSON.stringify(attributes)
    })
    
})

app.listen(3005, ()=>{
    //console.log("server started")
}) 

console.log('Server running at http://localhost:'+ 3005 + '/');
