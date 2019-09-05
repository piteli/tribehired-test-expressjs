const express = require('express');
const path = require('path');
const firebase = require("firebase");
const firebase_config = {
    apiKey : "AIzaSyBjoD6CzgATxsX2P3gOrJmxCVbSH-sZLq0",
    authDomain : "tribehired-test.firebaseapp.com",
    databaseURL : "https://tribehired-test.firebaseio.com",
    storageBucket : ""
};

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(express.urlencoded());

app.post('/api/auth/login', (req, res) => {
    const user_data = req.body;

    if (!firebase.apps.length)firebase.initializeApp(firebase_config);
    firebase.database().ref('/users/').orderByChild('email').equalTo(user_data.email).once('value').then((snapshot) => {
        if(snapshot.val() == null || snapshot.val() == undefined){
            return res.json({success : false , message : "Invalid email or password. Please try again"});
        }
        firebase.database().ref('/users/').orderByChild('password').equalTo(user_data.password).once('value').then((snapshot2) => {
            return res.json({success : true , message : "Success!"});
        })
    })
  });

  app.post('/api/auth/register', (req, res) => {
    const user_data = req.body;

    if (!firebase.apps.length)firebase.initializeApp(firebase_config);
    firebase.database().ref('/users/').push().set({
        username: user_data.username,
        email: user_data.email,
        password : user_data.password
      }).then((snapshot) => {
        return res.json({success : true , message : "Success!"}); 
    }).catch((err) => {
        return res.json({success : false , message : err}); 
    })
  });

  app.get('/api/users/fetch', (req, res) => {
    if (!firebase.apps.length)firebase.initializeApp(firebase_config);
    firebase.database().ref('/users/').orderByChild('username').equalTo(req.query.search).once('value').then((snapshot) => {
        let array = [];
        for(var key in snapshot.val()){
            array.push(snapshot.val()[key]);
        }
        return res.json(array); 
    }).catch(() => {
        return res.json([]);
    })
  });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);