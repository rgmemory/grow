const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
// let peopleArray = []

const port = 3005;

let app = express();

app.use(bodyParser.json());

let promises = [];
let people = [];
let peopleArray = [];

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/people", (req, res) => {
    let peopleArray = []

    axios.get('https://swapi.co/api/people').then(result => {
  
        for(let i = 0; i < result.data.results.length; i++){
            peopleArray.push(result.data.results[i])
        }

        for (let i = 2; i < 10; i++) {
            let tempString = `https://swapi.co/api/people/?page=${i}`;
            promises.push(axios.get(tempString));
          }
        
          Promise.all(promises).then(results => {
              results.forEach(item => {        
                    people.push(item.data.results)
              })
              for(let i = 0; i < people.length; i++){
                  for(let j = 0; j < people[i].length; j++){
                      peopleArray.push(people[i][j])
                  }
              }
              res.send(peopleArray)
          })
    })
});

app.get("/people/:sortBy", (req, res) => {
//   let peopleArray = [];
let peopleArray = []

    axios.get('https://swapi.co/api/people').then(result => {
        let param = req.params.sortBy;
  
        for(let i = 0; i < result.data.results.length; i++){
            peopleArray.push(result.data.results[i])
        }

        for (let i = 2; i < 10; i++) {
            let tempString = `https://swapi.co/api/people/?page=${i}`;
            promises.push(axios.get(tempString));
          }
        
          Promise.all(promises).then(results => {
              results.forEach(item => {        
                    people.push(item.data.results)
              })
              for(let i = 0; i < people.length; i++){
                  for(let j = 0; j < people[i].length; j++){
                      peopleArray.push(people[i][j])
                  }
              }
            //   res.send(peopleArray)
          })
    })


  axios.get(`https://swapi.co/api/people`).then(result => {
    peopleArray = result.data.results;

    if (param === "name") {
      let name = peopleArray.slice(0);
      name.sort((a, b) => {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
      res.send(name);
    } else if (param === "height") {
      let height = peopleArray.slice(0);
      height.sort(function(a, b) {
        return a.height - b.height;
      });
      res.send(height);
    } else if (param === "mass") {
      let mass = peopleArray.slice(0);
      mass.sort(function(a, b) {
        return a.mass - b.mass;
      });
      res.send(mass);
    }
  });
});

app.get("/planets", (req, res) => {
  axios.get("https://swapi.co/api/planets/").then(result => {
    console.log(result.data);

    res.send(result.data.results);
  });
});

// setTimeout(message, 4000)

// run a loop for each number of pages there are

// in the loop have a settimeout function that calls the api with the correct number url

// app.get('/people', (req, res) => {
//     for(let i = 2; i < 5; i++){
//         axios.get(`https://swapi.co/api/people/?page=${i}`).then(result => {
//             // console.log('-----------------------------------------------', result.data)
//             people.push(result.data)

//             console.log('people(-----------------------------------------------', people)

//             // setTimeout(() => {
//                 //         people = result.data
//                 //     }, 0)
//             })
//         }
//         res.send(people)

//     // console.log('people', people)
// })
