let express = require("express");
let app = express();
const PORT = 8080;
// let bodyParser = require( "body-parser" );

app.set("view engine", "ejs");
// app.use( bodyParser.urlencoded( { extended : true } ) );

let urlDatabase = {
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

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
    res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});