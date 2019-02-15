const express = require("express");
let app = express();
const PORT = 8080;
const bodyParser = require( "body-parser" );
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use( bodyParser.urlencoded( { extended : true } ) );
app.use(cookieParser())

// const urlDatabase = {
//     "b2xVn2": "http://www.lighthouselabs.ca",
//     "9sm5xK": "http://www.google.com"
// }

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
    const id = req.cookies.user_id
    const userURLDatabase = urlsForUser(id)
    // console.log(req.cookies.user_id)
    console.log(users[req.cookies.user_id])
    let templateVars = {
        urls: urlDatabase,
        username: req.cookies.user_id,
        currentUser: users[req.cookies.user_id],
        userURL: userURLDatabase
        // email: req.cookies[user_id].email
    };

    res.render("urls_index", templateVars);
});

// app.get("urls/:id"), (req,res) => {
//     const id = req.cookies.user_id
//     const userURLDatabase = urlsForUser(id)
//     // console.log(req.cookies.user_id)
//     console.log(users[req.cookies.user_id])
//     let templateVars = {
//         urls: urlDatabase,
//         username: req.cookies.user_id,
//         currentUser: users[req.cookies.user_id],
//         userURL: userURLDatabase
//         // email: req.cookies[user_id].email
//     };

//     res.render("urls_id", templateVars);
// }

app.get("/urls/new", (req, res) => {

    if (req.cookies.user_id) {
        let templateVars = {username: req.cookies.email};
        res.render("urls_new", templateVars);
    } else {
        res.redirect('/login')
    }

});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase,
        // user: users[req.cookies]
        username: req.cookies,
        currentUser: users[req.cookies.user_id]
    };
    res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
    // res.redirect(longURL);
});

app.get("/register", (req, res) => {
    let templateVars = {
        username: req.cookies,
        currentUser: users[req.cookies.user_id]
    };
    res.render("urls_register",templateVars)
});

app.get("/login", (req, res) => {
    const templateVars = {
        username: req.cookies,
        currentUser: users[req.cookies.user_id]
    };
    res.render("urls_login",templateVars)
});

app.post( "/" , ( req , res ) => {
	res.render( "urls_new" , { users : usersdb.findByName( req.body.filter ) });
});

app.get("/u/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase,
        username: req.cookies,
        currentUser: users[req.cookies.user_id]
    };

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
    }
    // let shortURLCreated =''
    // for (key in urlDatabase) {
    //     //console.log(`${urlDatabase[key]} vs ${longURL}`)
    //     if (urlDatabase[key] === longURL) {
    //         //console.log(`long ${urlDatabase.key}`)
    //         shortURLCreated = key;
    //         existURL += 1;
    //         //console.log(existURL);
    //     }
    // }

    // if (existURL === 0) {
    const shortURLCreated = generateRandomString();
    urlDatabase[shortURLCreated] = {longURL: longURL, userID: req.cookies.user_id};
    // }
    // console.log(urlDatabase);

    res.redirect('/urls/' + shortURLCreated)
    
}); 

app.post('/urls/:shortURL/delete', (req, res) => {
    // const found = !((req.params.shortURL) in urlDatabase)
    // if (!found) {
    //     return res.status(404).send()
    // }
    // console.log(urlDatabase)
    // console.log(req.cookies.user_id ,'vs', urlDatabase[req.params.shortURL.userID])

    if (req.cookies.user_id === urlDatabase[req.params.shortURL].userID) {
        delete urlDatabase[req.params.shortURL];
    } else {
        return res.status(403).send();
    } 
        res.redirect('/urls');
});


app.post('/urls/:shortURL/', (req, res) => {
    // urlDatabase[req.params.shortURL] = longURL;
    if (req.cookies.user_id === urlDatabase[req.params.shortURL].userID) {
        urlDatabase[req.params.shortURL] = req.body.longURL;
    } else {
        return res.status(403).send();
    } 
    
    res.redirect('/urls')
})

app.post('/login', (req,res) => {
    // console.log(req.body.username)


    const email = req.body.email
    const password = req.body.password
    const user = loginCheck(email, password)
    console.log(email,password,user)
    if (!user) {
        return res.status(403).send();
    } else {
        const randomUserID = emailLookup(email)
        res.cookie('user_id', randomUserID);
        console.log('req.cookies: ', req.cookies)
        res.redirect('/urls')
    }

});

app.post('/logout', (req,res) => {
    // console.log(req.body.username)
    res.clearCookie('user_id');
    console.log(users)
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
            res.cookie('user_id', userID)
            res.redirect('/urls')
        } else {
            res.redirect('/register')
        }
    }
});


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    return Math.random().toString(36).substring(7)

}

// function httpAdd(){
//     if (!req.body.longURL.includes("http://")){
//         longURL = `http://${req.body.longURL}`;
//     } else {
//         longURL = req.body.longURL;
//     }
// }

function loginCheck(email, password) {
    for (user in users) {
//bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword)
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
    //console.log(objURL)
}