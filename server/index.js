const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
// let peopleArray = []

const port = 3005;

let app = express()

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})


app.get('/people', (req, res) => {
    axios.get('https://swapi.co/api/people/').then(response => {
        console.log('back count', response.data) 

        let peopleCounter = Math.ceil(response.data.count / 10)

        // 'https://swapi.co/api/people/?page=2'

        for(let i = 2; i < 4; i++){
            console.log(i)

            axios.get(`https://swapi.co/api/people/?page=${i}`).then(result => {
                console.log('in the loop', result.data.next)
                peopleArray.push(result.data.next)
            })
        }

        console.log(peopleArray, 'peopleArray')

    })
})

app.get('/people/:sortBy', (req, res) => {

    let peopleArray = []

    let param = req.params.sortBy

    axios.get(`https://swapi.co/api/people`).then(result => {

        peopleArray = result.data.results
        
        if(param === 'name'){
            let name = peopleArray.slice(0);
            name.sort((a, b) => {
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            })
            res.send(name)
            
        }else if(param === 'height'){
            let height = peopleArray.slice(0);
            height.sort(function(a, b){
                return a.height - b.height
            })
            res.send(height)
            
        }else if(param === 'mass'){
            let mass = peopleArray.slice(0);
            mass.sort(function(a, b){
                return a.mass - b.mass
            })
            res.send(mass)
            
        }else{
            console.log('none of the above')
        }
    })
    
})


app.get('/planets', (req, res) => {
    axios.get('https://swapi.co/api/planets/').then(result => {
        console.log(result.data)
    })
})
       
    