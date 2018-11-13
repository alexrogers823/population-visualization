// const cities = [];
// fetch('https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json')
//   .then(blob => blob.json())
//   .then(data => {
//     cities.push(...data);
    // const states = [...new Set(cities.map(city => city.state))];
//     console.log(states);
//   });
// const cities = [];

// Find out how to do this without pushing into a global variable
async function loadData() {
  const data = await fetch('https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json');
  const json = await data.json();
  return json;
}

async function test() {
  const cities = [];
  await loadData(cities);
  console.log(cities);
}

async function prepareState(index) {
  const span = document.querySelector('span');
  const allCities = await loadData();
  console.log(allCities);
  const states = [...new Set(allCities.map(city => city.state))]
                  .sort();
  console.log(states.length);
  const cities = allCities.filter(city => city.state === states[index])
                          .slice(0, 10);

  span.textContent = states[index];
  // console.log(cities);
  return cities;
}



// test();




// This function to be used with the sort method on object-based arrays
// function compare(a, b) {
//   const stateA = a.state;
//   const stateB = b.state;
//
//   let comparison = 0;
//   if (stateA > stateB) {
//     comparison = 1;
//   } else if (stateA < stateB) {
//     comparison = -1;
//   }
//   return comparison;
// }

const [width, height] = [1000, 500];

const canvas = d3.select('svg').append('g')
  .attr('width', width)
  .attr('height', height);

// sample data. just for testing before async/await. Growth %
const sampleData = [
  {
    city: "New York",
    state: "New York",
    population: "2456933",
  growth_from_2000_to_2013: "3.9%",
  },
  {
    city: "Chicago",
    state: "Illinois",
    population: "245934",
  growth_from_2000_to_2013: "1.5%",
  },
  {
    city: "Los Angeles",
    state: "California",
    population: "1723745",
  growth_from_2000_to_2013: "5.3%",
  },
  {
    city: "Minneapolis",
    state: "Minnesota",
    population: "456823",
  growth_from_2000_to_2013: "4.8%",
  },
  {
    city: "Atlanta",
    state: "Georgia",
    population: "588923",
  growth_from_2000_to_2013: "-2.7%",
  },
  {
    city: "Houston",
    state: "Texas",
    population: "502984",
  growth_from_2000_to_2013: "4.2%",
  },
  {
    city: "St. Louis",
    state: "Missouri",
    population: "233987",
  growth_from_2000_to_2013: "7.9%",
  },
  {
    city: "San Francisco",
    state: "California",
    population: "998734",
  growth_from_2000_to_2013: "0.6%",
  },
  {
    city: "Seattle",
    state: "Washington",
    population: "492834",
  growth_from_2000_to_2013: "-1.3%",
  },
  {
    city: "Miami",
    state: "Florida",
    population: "703958",
  growth_from_2000_to_2013: "4.0%"
  }
];

// data looks like this
// {
//   city: "New York",
//   growth_from_2000_to_2013: "4.8%",
//   latitude: 40.7127837,
//   longitude: -74.0059413,
//   population: "8405837",
//   rank: "1",
//   state: "New York"
// }

// Use async/await syntax for practice, instead of the fetch/then
// Using v4/v5 syntax for D3 for practice
// Set interval will be 2.5-3 seconds this time
// Play with size of circles to represent total population (data viz highlight)

// Goal:
// Show an interactive, +/- axis of population growth of cities by state
// also calculate by year
// years 2000 to 2013 are on x-Axis
// will be based on population number, using growth number to estimate in previous years
// shown as a line graph, with each city getting a different color
// y-axis values will change with each state, based on min and max of populations in cities
// or, y-axis values changing by range of population growth for cities

// we actually may have two different graphs here, lol
// line graph: showing progression of population (y-axis) through the years (x-axis)
// scatter plot graph: showing all cities sorted (x-axis) and their population growth (y-axis)

// Setting axis range of current growth dataset
function growthRange(data) {
  const min = Math.floor(Math.min(...data.map(n => parseFloat(n.growth_from_2000_to_2013))));
  const max = Math.ceil(Math.max(...data.map(n => parseFloat(n.growth_from_2000_to_2013))));
  return [min, max];
}

async function makeAxis(state) {
  const data = await prepareState(state);
  console.log(data);
  const [growthMin, growthMax] = growthRange(data);

  // x-axis
  const cityScale = d3.scaleLinear()
  .domain([1, data.length])
  .range([50, width-50]);

  const cityAxis = d3.axisBottom(cityScale)
  .ticks(data.length)
  .tickSize(2)
  .tickPadding(5)
  .tickFormat((d, i) => {
    // console.log(d);
    // console.log(i);
    if (i === data.length) return '.';
    return data[i].city;
  });

  // canvas.append('g')
  // .attr('transform', `translate(0, ${height-20})`)
  // .call(cityAxis);

  // y-axis
  const growthScale = d3.scaleLinear()
  .domain([growthMax, growthMin])
  .range([50, height-50]);

  const growthAxis = d3.axisLeft(growthScale)
  .ticks(getTickNumber(growthMin, growthMax))
  .tickSize(2)
  .tickPadding(5);

  // canvas.append('g')
  // .attr('transform', `translate(20, 0)`)
  // .call(growthAxis);

  // Making grid lines
  // canvas.append('g')
  // .attr('class', 'grid')
  // // .attr('transform', `translate(0, 0`)
  // .call(d3.axisLeft()
  // .scale(growthScale)
  // .tickSize(-width, 0, 0)
  // .tickFormat(''));


  return [data, cityScale, growthScale, cityAxis, growthAxis];

}

async function updateGraph(state) {
  const [data, cityScale, growthScale, cityAxis, growthAxis] = await makeAxis(state);

  const t = d3.transition().duration(1000);


  // Re-calling the axis'
  const spawnCityAxis = canvas.append('g')
                        .attr('class', 'xAxis')
                        .attr('transform', `translate(0, ${height-20})`);

  const spawnGrowthAxis = canvas.append('g')
                          .attr('class', 'yAxis')
                          .attr('transform', 'translate(20, 0)');

  // Removing previous axis

  spawnCityAxis.transition(t).call(cityAxis);
  spawnGrowthAxis.transition(t).call(growthAxis);


  const callGrid = canvas.append('g')
  .attr('class', 'grid');
  // .attr('transform', `translate(0, 0`)


  callGrid.call(d3.axisLeft()
  .scale(growthScale)
  .tickSize(-width, 0, 0)
  .tickFormat(''));

  // Binding and making shapes
  const circles = canvas.selectAll('.circle')
  .data(data);

  circles.exit()
    .transition(t)
    .attr("fill-opacity", 0.1)
    .attr('cy', growthScale(0))
    .remove();


  circles.transition(t)
    .attr('cx', (d, i) => cityScale(1+i))
    .attr('cy', (d, i) => growthScale(parseFloat(d.growth_from_2000_to_2013)));

  circles.enter()
  .append('circle')
  .attr('class', 'circle')
  .attr('cx', (d, i) => cityScale(1+i)) //So circles are made from 1 instead of 0
  .attr('cy', growthScale(0))
  .attr('r', (d, i) => setRadius(d.population))
  .attr('fill-opacity', 0.1)
  .transition(t)
  .attr('fill-opacity', 1)
  .attr('cy', (d, i) => growthScale(parseFloat(d.growth_from_2000_to_2013)))
  .attr('fill', '#bb2222');

  return t;

}

// updateGraph(6);

let stateNum = 0;
setInterval(() => {
  const dur = updateGraph(stateNum);
  d3.select('.grid').transition(dur).remove();
  d3.select('.xAxis').transition(dur).remove();
  d3.select('.yAxis').transition(dur).remove();
  // callGrid.remove();
  stateNum = (stateNum > 50) ? 0 : stateNum + 1;
}, 3000);


// Setting amount of ticks
function getTickNumber(min, max) {
  return Math.ceil((max-min)/5);
}

// Setting radius based on population
function setRadius(population) {
  const num = parseFloat(population);
  const divider = 50000;

  if (num < 250000) return 5;
  return (num > 1000000) ? 20 : num / divider;
}


// const [growthMin, growthMax] = growthRange(sampleData);

// x-axis
// const cityScale = d3.scaleLinear()
//   .domain([1, 10])
//   .range([50, width-50]);
//
// const cityAxis = d3.axisBottom(cityScale)
//   .ticks(10)
//   .tickSize(2)
//   .tickPadding(5)
//   .tickFormat((d, i) => sampleData[i].city)

// canvas.append('g')
//   .attr('transform', `translate(0, ${height-20})`)
//   .call(cityAxis);

// y-axis
// const growthScale = d3.scaleLinear()
// .domain([growthMax, growthMin])
// .range([50, height-50]);
//
// const growthAxis = d3.axisLeft(growthScale)
//   .ticks(12)
//   .tickSize(2)
//   .tickPadding(5);

// canvas.append('g')
// .attr('transform', `translate(20, 0)`)
// .call(growthAxis);


// Grid lines
// canvas.append('g')
//   .attr('class', 'grid')
//   // .attr('transform', `translate(0, 0`)
//   .call(d3.axisLeft()
//           .scale(growthScale)
//           .tickSize(-width, 0, 0)
//           .tickFormat(''));

// Labels

// Setting radius based on population
// function setRadius(population) {
//   const num = parseFloat(population);
//   const divider = 125000;
//   return (num < 625000) ? 5 : num / divider;
// }
//
//
// // Binding and making shapes (sample only)
// const circles = canvas.selectAll('.circle')
//   .data(sampleData);
//
// circles.enter()
//   .append('circle')
//   .attr('class', 'circle')
//   .attr('cx', (d, i) => cityScale(1+i)) //So circles are made from 1 instead of 0
//   .attr('cy', (d, i) => growthScale(parseFloat(d.growth_from_2000_to_2013)))
//   .attr('r', (d, i) => setRadius(d.population));
