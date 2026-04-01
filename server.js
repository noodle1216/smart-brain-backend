require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const imageurl = require('./controllers/imageurl');
const image = require('./controllers/image');

//only works on localhost
// const db = knex({
//   client: 'pg',
//   connection: {
//     host: '127.0.0.1',
//     port: 5432,
//     user: 'mac',
//     password: '',
//     database: 'smart_brain'
//   }
// });

//Render version
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  } 
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
	res.send('success');
})

app.post('/signin', signin.handleSignin(db, bcrypt)); //cleaner alternatives 
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { imageurl.handleImageurl(req,res)});

//Fake Clarifai response (for practice/demo:test face box rendering)
// app.post('/imageurl', (req, res) => {
//   res.json({
//     outputs: [
//       {
//         data: {
//           regions: [
//             {
//               region_info: {
//                 bounding_box: {
//                   left_col: 0.3,
//                   top_row: 0.2,
//                   right_col: 0.7,
//                   bottom_row: 0.6
//                 }
//               }
//             }
//           ]
//         }
//       }
//     ]
//   });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`app is running on port ${PORT}`);
});

/* endpoints we expect
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user
*/