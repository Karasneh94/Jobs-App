'use strict';

const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);

let jobsArray = [];

function Jobs (id, title, company, location, url , description)
{

    this.id = id;
    this.title = title;
    this.company = company;
    this.location = location;
    this.url = url;
    this.description = description;

    jobsArray.push(this);
}


app.get('/' , homePage);
app.get('/search', searchJobs);
app.get('/results', resultJobs);
app.post('/results', addJob);
app.get('mylist', viewMylist);
app.get('details/:id', viewJob);
app.put('details/:id', editJob);
app.delete('details/:id', editJob);




function homePage(request, response){
const url = `https://jobs.github.com/positions.json?location=usa`;
superagent.get(url).then(result => {
    result.body.forEach(element => {
        new Jobs(element.id, element.title, element.company, element.location, element.url, element.description);
    }); 
    response.render('index', {data: jobsArray});
}).catch(err => console.log(err));
}


function searchJobs(request, response) {

    response.render('pages/search');
    
}

function resultJobs(request, response) {

    const desc = request.body.search;
    const url = `https://jobs.github.com/positions.json?description=${desc}&location=usa`;

    superagent.get(url).then(result => {

        response.render('pages/results', {data: result.body});
    }).catch(err => console.log(err));
    
}

function addJob(request, response) {
    
    const sql = `INSERT INTO myList (title, company, location, url) VALUES ($1 $2 $3 $4)`;
    const values = [requist.body.title, requist.body.company, requist.body.location, requist.body.url,];

    client.query(sql, values).then(result => {
        response.redirect('/mylist');
    })


}

function viewMylist(request, response) {

    const sql = `SELECT * FROM myList`;
    client.query(sql).then(result => {
        response.render('pages/mylist', {data: result.rows});
    })
    
}

function viewJob(request, response) {

    const id = requist.params.id;
    const sql = `SELECT * FROM mylist WHERE id = ${id}`;

    client.query(sql).then(result => {

        response.render('pages/details', result.rows[0]);

    })

    
}

function editJob(requist, params) {
    
    const sql =  const sql = `SELECT * FROM mylist WHERE id = ${id}`;



}






client.connect().then(() => app.listen(PORT, () => console.log(`Listening on ${PORT}`)));