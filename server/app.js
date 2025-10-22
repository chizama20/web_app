const express = require('express'); 
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbSevice = require('./dbService');    

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create

app.post('/insert', (request, response) => {
    const { name } = request.body;
    const db = dbSevice.getDbServiceInstance();

    const result = db.insertNewName(name);  

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));

});

//read
app.get('/getAll', (request, response) => {   
    const db = dbSevice.getDbServiceInstance();

    const result = db.getAllData()
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

//update
app.patch('/update', (request, response) => {
    const { id, name } = request.body;  
    const db = dbSevice.getDbServiceInstance();

    const result = db.updateNameById(id, name);

    result
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));

});

//delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbSevice.getDbServiceInstance();
    const result = db.deleteRowById(id);

    result
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));
});



// ---- USER ROUTES ----
const DbUserService = require('./dbUserService');
const userDb = DbUserService.getInstance();

app.post('/register', async (req, res) => {
  const { username, password, firstname, lastname, salary, age } = req.body;
  const result = await userDb.register(username, password, firstname, lastname, salary, age);
  res.json(result);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await userDb.login(username, password);
  res.json(result);
});

app.get('/search/name', async (req, res) => {
  const { firstname, lastname } = req.query;
  const result = await userDb.searchByName(firstname, lastname);
  res.json(result);
});

app.get('/search/userid/:username', async (req, res) => {
  const { username } = req.params;
  const result = await userDb.searchByUserId(username);
  res.json(result);
});

app.get('/search/salary', async (req, res) => {
  const { min, max } = req.query;
  const result = await userDb.searchBySalaryRange(min, max);
  res.json(result);
});

app.get('/search/age', async (req, res) => {
  const { min, max } = req.query;
  const result = await userDb.searchByAgeRange(min, max);
  res.json(result);
});

app.get('/search/after/:username', async (req, res) => {
  const { username } = req.params;
  const result = await userDb.searchUsersRegisteredAfter(username);
  res.json(result);
});

app.get('/search/never-signed', async (req, res) => {
  const result = await userDb.searchUsersNeverSignedIn();
  res.json(result);
});

app.get('/search/same-day/:username', async (req, res) => {
  const { username } = req.params;
  const result = await userDb.searchUsersSameDayAs(username);
  res.json(result);
});

app.get('/search/today', async (_req, res) => {
  const result = await userDb.searchUsersRegisteredToday();
  res.json(result);
});

app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbSevice.getDbServiceInstance();

    const result = db.searchByName(name);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
