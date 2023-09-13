const express=require('express');
const bodyParser=require('body-parser')
const axios=require('axios');
const getWeekStartByRegion=require('weekstart').getWeekStartByRegion

const app=express()

app.use(express.json())
app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
require('dotenv').config()


var location='Colombo'

app.get('/',(req,res)=>{
 
  axios.get('https://api.openweathermap.org/data/2.5/weather',{params:{
    q:location,
    units:'metric',
    appid:process.env.ApiKey
  }}).then(response=>{
    const data=response.data
   
    res.render('index.ejs',{city:data.name,country:data.sys.country,temp:Math.floor(data.main.temp),icon:'https://openweathermap.org/img/wn/'+((data.weather)[0].icon)+'@2x.png'})
  }).catch(err=>{
    console.log(err)
  })

})

app.post("/",(req,res)=>{
  location=req.body.txt
  res.redirect('/')
})
app.listen('3000',()=>{
  console.log('port listening on port 3000')
})