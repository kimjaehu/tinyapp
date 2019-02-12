let express = require("express");
let app = express();
const PORT = 8080;
const bodyParser = require( "body-parser" );

app.set("view engine", "ejs");
app.use( bodyParser.urlencoded( { extended : true } ) );

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

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.post( "/" , ( req , res ) => {
	res.render( "urls_new" , { users : usersdb.findByName( req.body.filter ) });
});


app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
});  

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});