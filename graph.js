const daysInYear = 25;
const trials = 1000;
const scalex = 200;

// generate a set for a given size of group
// and then return the number of unique birthdays
function singleTrial(groupSize) {
  return Array(groupSize)
    .fill(0)
    .reduce((acc) => acc.add(Math.floor(Math.random() * daysInYear)), new Set())
    .size;
}

// Given a certain number of trails, generate n trials for a given group size
// and find the proportion of which had people with unique birthdays
function singleObservation(n, groupSize) {
  const contained = Array(n)
    .fill(0)
    .map(() => singleTrial(groupSize))
    .filter(uniqueDays => uniqueDays !== groupSize)

  return contained.length / trials;
}

function generateData() {
  return Array(daysInYear)
    .fill(0)
    .map((_, i) => ({ value: singleObservation(trials, i), idx: i}))
}

function scaffold() {
  const blanks = Array(daysInYear).fill(0).map((_, i) => i);

  d3.select('#graph')
    .selectAll('rect')
    .data(blanks).enter()
    .append('rect')
    .attr('height', 30)
    .attr('x', 0)
    .attr('y', d => d * 30)
    .attr('fill', 'black');

  d3.select('#graph')
    .selectAll('text')
    .data(blanks).enter()
    .append('text')
    .attr('y', d => d * 30 + 20)
    .attr('fill', 'black');

  redraw();
}

function redraw() {
  const observations = generateData();

  d3.selectAll('rect')
    .attr('width', d => observations[d].value * scalex)
    .attr('fill', d => observations[d].value > .5 ? 'green' : 'red');

  d3.selectAll('text')
    .text(d => observations[d].value)
    .attr('x', d => observations[d].value * scalex + 30)
    .attr('fill', d => observations[d].value > .5 ? 'green' : 'red');
}

scaffold();
setInterval(redraw, 500);
