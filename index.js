import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.static('public'));

app.get('/',async (req,res)=>{
    try{
        const request = await axios.get('https://bored-api.appbrewery.com/random');
        res.render('index.ejs',{ 
            data : request.data, 
            type: request.data.type, 
            participants : request.data.participants 
        });
    } catch(error){
        console.error('Failed to make request : ',error.message);
        res.status(500).send('Failed to fetch task! Please try again.');
    }
});

app.post('/',async (req,res)=>{
    try {
        const type = req.body.type;
        const participants = req.body.participants;
        const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`);
        const result = response.data;
        res.render('index.ejs',{
            data: result[Math.floor(Math.random()*result.length)]
        });
    } catch (error) {
        console.error('Failed to make request : ',error.message);
        res.render('index.ejs',{
            error: 'No activities that match your criteria! Sorry :('
        })
    }
});

app.listen(port,()=>{ console.log(`Listening on port ${port}`) });