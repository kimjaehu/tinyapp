const express = require("express");
let app = express();
const PORT = 8080;
const bodyParser = require( "body-parser" );

app.set("view engine", "ejs");
app.use( bodyParser.urlencoded( { extended : true } ) );

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
}

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Helo <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase};
    res.render("urls_index", templateVars);
});

app.post( "/" , ( req , res ) => {
	res.render( "urls_new" , { users : usersdb.findByName( req.body.filter ) });
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
    res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
    //console.log(req.body.longURL);  // Log the POST request body to the console
    //let longURLCreated = req.body.longURL;
    let existURL = 0;
    if (!req.body.longURL.includes("http://")){
        longURL = `http://${req.body.longURL}`;
    } else {
        longURL = req.body.longURL;
    }true
    for (key in urlDatabase) {
        if (urlDatabase.key === longURL) {
            console.log(`long ${urlDatabase.key}`)
            let shortURLCreated = key;
            existURL += 1;
            console.log(existURL);
        }
    }

    if (existURL === 0) {
    shortURLCreated = generateRandomString();
    urlDatabase[shortURLCreated] = longURL;
    }
    console.log(urlDatabase);
    res.redirect('urls/' + shortURLCreated)
    
}); 

app.get("/u/:shortURL", (req, res) => {
    res.redirect(urlDatabase[req.params.shortURL]);
    // res.redirect(longURL);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    return Math.random().toString(36).substring(7)

}