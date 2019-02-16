const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require( "body-parser" );
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use( bodyParser.urlencoded( { extended : true } ) );
app.use(cookieSession({
  name: 'session',
  keys: ['strings'],
}))
//Iniial database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
	"userRandomID": {
		id: "userRandomID", 
		email: "user@example.com", 
		password: "purple-monkey-dinosaur"
	},
	"user2RandomID": {
		id: "user2RandomID", 
		email: "user2@example.com", 
		password: "dishwasher-funk"
	}
}


//app.get: render stored in ./views/
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
	const id = req.session.user_id
	const userURLDatabase = urlsForUser(id)
	let templateVars = {
		urls: urlDatabase,
		username: req.session.user_id,
		currentUser: users[req.session.user_id],
		userURL: userURLDatabase
	};

	res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
	//check cookie for login, if not logged in => /login page
	if (req.session.user_id) {
		let templateVars = {username: req.session.email};
		res.render("urls_new", templateVars);
	} else {
		res.redirect('/login')
	}
});

app.get("/urls/:shortURL", (req, res) => {
	let templateVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase,
		username: req.session,
		currentUser: users[req.session.user_id]
	};
	res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
	res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.get("/register", (req, res) => {
	let templateVars = {
		username: req.session,
		currentUser: users[req.session.user_id]
	};
	res.render("urls_register",templateVars)
});

app.get("/login", (req, res) => {
	const templateVars = {
		username: req.session,
		currentUser: users[req.session.user_id]
	};
	res.render("urls_login",templateVars)
});

app.get("/u/:id", (req, res) => {
	let templateVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase,
		username: req.session,
		currentUser: users[req.session.user_id]
	};

	res.render("urls_show", templateVars);
});

//app.post
app.post( "/" , ( req , res ) => {
	res.render( "urls_new" , { users : usersdb.findByName( req.body.filter ) });
});

app.post("/urls", (req, res) => {
	//ensuring http:// gets stored in the database
	httpAdd(req.body.longURL);
	//to be added see function duplicateCheck():
	//check to see if URL exists, if it does, just redirect
	const shortURLCreated = generateRandomString();
	urlDatabase[shortURLCreated] = {
		longURL: longURL,
		userID: req.session.user_id
	};
	res.redirect('/urls/' + shortURLCreated)
    
}); 

app.post('/urls/:shortURL/delete', (req, res) => {
	if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
		delete urlDatabase[req.params.shortURL];
	} else {
		return res.status(403).send();
	} 
	res.redirect('/urls');
});


app.post('/urls/:shortURL/', (req, res) => {
	
	if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
		//ensuring http:// gets stored in the database
		httpAdd(req.body.longURL);
		urlDatabase[req.params.shortURL].longURL = longURL;
	} else {
		return res.status(403).send();
	} 
	res.redirect('/urls')
})

app.post('/login', (req,res) => {
	const email = req.body.email
	const password = req.body.password
	const user = loginCheck(email, password)
	if (!user) {
		return res.status(403).send();
	} else {
		const randomUserID = emailLookup(email)
		req.session.user_id = randomUserID;
		res.redirect('/urls')
	}
});

app.post('/logout', (req,res) => {
  req.session = null
	res.redirect('/urls')
});

app.post('/register', (req,res) => {
	const userID = generateRandomString();
	const email= req.body.email;
	let password = req.body.password;
	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = emailLookup(email)
	if (!email || !password) {
		return res.status(404).send()
	} else {
		if (!user) {
			users[userID]= {'id': userID, 'email': email, 'password': hashedPassword}
			req.session.user_id = userID
			res.redirect('/urls')
		} else {
			res.redirect('/register')
		}
	}
});

//locahost:8080
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

//functions
function generateRandomString() {
	return Math.random().toString(36).substring(7)
}

function loginCheck(email, password) {
	for (user in users) {
		if (users[user].email === email &&  bcrypt.compareSync(password, users[user].password)) {
			return user;
		}
	}
}

function emailLookup(email) {
	for (user in users) {
		if (users[user].email === email) {
			return user;
		}
	}
}

function urlsForUser(id) {
	const objURL = {};
	for (url in urlDatabase) {
		if (urlDatabase[url].userID === id){
			objURL[url] = urlDatabase[url].longURL
		}
	} 
	return objURL
}

//for improvements: work on
function urlDuplicateCheck() {
	for (key in urlDatabase) {
		if (urlDatabase[key] === longURL) {
			shortURLCreated = key;
			existURL += 1;
		}
	}
}

function httpAdd(userURL){
	if (!userURL.includes("http://")){
		longURL = `http://${userURL}`;
	} else {
		longURL = userURL;
	}
	return longURL;
}