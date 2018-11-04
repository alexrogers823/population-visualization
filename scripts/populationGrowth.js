const cities = [];
fetch('https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json')
  .then(blob => blob.json())
  .then(data => {
    cities.push(...data);
    const states = [...new Set(cities.map(city => city.state))];
    console.log(states);
  });

// This function to be used with the sort method on object-based arrays
function compare(a, b) {
  const stateA = a.state;
  const stateB = b.state;

  let comparison = 0;
  if (stateA > stateB) {
    comparison = 1;
  } else if (stateA < stateB) {
    comparison = -1;
  }
  return comparison;
}

const canvas = d3.select('svg');

canvas.append('g')
  .attr('width', 50)
  .attr('height', 50);

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
