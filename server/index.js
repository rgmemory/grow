const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const port = 3005;

let app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//Gets a list of people using a loop that dynamically adjusts to the number of people the API makes available.
app.get("/people", (req, res) => {
  console.log(req.query, "req.query");

  axios.get("https://swapi.co/api/people").then(result => {
    let loopCounter = Math.ceil(result.data.count / 10) + 1;

    let promises = [];
    let peopleArray = [];
    let people = [];

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


      //sorting
      if (req.query.sortBy === "name") {
        let name = peopleArray.slice(0);
        name.sort((a, b) => {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });
        res.send(name);
      } else if (req.query.sortBy === "height") {
        let height = peopleArray.slice(0);
        height.sort(function(a, b) {
          return a.height - b.height;
        });
        res.send(height);
      } else if (req.query.sortBy === "mass") {
        let mass = peopleArray.slice(0);
        mass.sort(function(a, b) {
          return a.mass - b.mass;
        });
        res.send(mass);
      } else {
        res.send(peopleArray);
      }
    });
  });
});

//Gets a list of planets using a loop that dynamically adjusts to the number of planets the API makes available.
app.get("/planets", (req, res) => {
  async function test() {
    let residentsArray = [];
    let result = await axios.get("https://swapi.co/api/planets");

    let planetsArray = result.data.results;

    let loopCounter = Math.ceil(result.data.count / 10) + 1;

    for (let i = 2; i < loopCounter; i++) {
      let tempString = `https://swapi.co/api/planets/?page=${i}`;
      let additionalPlanets = await axios.get(tempString);

      additionalPlanets.data.results.forEach(current => {
        planetsArray.push(current);
      });
    }

    for (let i = 0; i < planetsArray.length; i++) {
      residentsArray = planetsArray[i].residents;

      if (residentsArray.length >= 1) {
        for (let j = 0; j < residentsArray.length; j++) {
          let tempString = residentsArray[j];

          let resident = await axios.get(tempString);
          planetsArray[i].residents[j] = resident.data.name;
        }
      } else {
        console.log("no residents", i);
      }
    }

    return planetsArray;
  }

  test().then(result => res.send(result));
});
