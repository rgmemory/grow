const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const port = 3005;

let app = express();

app.use(bodyParser.json());

let promises = [];
let planets = [];
let people = [];
let peopleArray = [];
let planetPromises = [];
let itemArray = [];
let axiosPlanetArray = [];
let axiosResults = [];

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


//Gets a list of people using a loop that dynamically adjusts to the number of people the API makes available.
app.get("/people", (req, res) => {
  let peopleArray = [];

  axios.get("https://swapi.co/api/people").then(result => {
    let loopCounter = Math.ceil(result.data.count / 10) + 1;

    for (let i = 0; i < result.data.results.length; i++) {
      peopleArray.push(result.data.results[i]);
    }

    for (let i = 2; i < loopCounter; i++) {
      let tempString = `https://swapi.co/api/people/?page=${i}`;
      promises.push(axios.get(tempString));
    }

    Promise.all(promises).then(results => {
      results.forEach(item => {
        people.push(item.data.results);
      });
      for (let i = 0; i < people.length; i++) {
        for (let j = 0; j < people[i].length; j++) {
          peopleArray.push(people[i][j]);
        }
      }
      res.send(peopleArray);
    });
  });
});

//Sorts the people from the API according to name, height, and mass.
app.get("/people/:sortBy", (req, res) => {
  let peopleArray = [];

  let param = req.params.sortBy;

  axios.get("https://swapi.co/api/people").then(result => {
    for (let i = 0; i < result.data.results.length; i++) {
      peopleArray.push(result.data.results[i]);
    }

    for (let i = 2; i < 10; i++) {
      let tempString = `https://swapi.co/api/people/?page=${i}`;
      promises.push(axios.get(tempString));
    }

    Promise.all(promises).then(results => {
      results.forEach(item => {
        people.push(item.data.results);
      });
      for (let i = 0; i < people.length; i++) {
        for (let j = 0; j < people[i].length; j++) {
          peopleArray.push(people[i][j]);
        }
      }

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
});



//Gets a list of planets using a loop that dynamically adjusts to the number of planets the API makes available.
app.get("/planets", (req, res) => {
  let planetsArray = [];

  axios.get("https://swapi.co/api/planets").then(result => {
    let loopCounter = Math.ceil(result.data.count / 10) + 1;

    for (let i = 0; i < result.data.results.length; i++) {
      planetsArray.push(result.data.results[i]);
    }

    for (let i = 2; i < loopCounter; i++) {
      let tempString = `https://swapi.co/api/planets/?page=${i}`;
      promises.push(axios.get(tempString));
    }

    Promise.all(promises).then(results => {
      results.forEach(item => {
        planets.push(item.data.results);
      });
      for (let i = 0; i < planets.length; i++) {
        for (let j = 0; j < planets[i].length; j++) {
          planetsArray.push(planets[i][j]);
        }
      }

      for (let x = 0; x < planetsArray.length; x++) {
        console.log(planetsArray[x].name, "----", x + 1);
        let residentCounter = 0;

        for (let i = 0; i < planetsArray[x].residents.length; i++) {
          residentCounter++;

          let tempString = planetsArray[x].residents[i];

          axiosPlanetArray.push(axios.get(tempString));
        }

        if (axiosPlanetArray.length >= 1) {
          Promise.all(axiosPlanetArray).then(results => {
            results.forEach((item, index) => {
              //////////////////I'm able to retrive the residents of each planet and console.log them but I'm still working on getting them in the correct order
              //////////////////and replacing them in data that I send back to the user
              console.log(item.data.name);
            });
          });
        }

        axiosPlanetArray = [];
      }

      res.send(planetsArray);
    });
  });
});
