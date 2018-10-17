const daysInYear = 25;
const scalex = 200;

const store = Array(daysInYear).fill(0).map(() => [0]);

// generate a set for a given size of group
// and then return the number of unique birthdays
function randomGroup(groupSize) {
  return Array(groupSize)
    .fill(0)
    .reduce((acc) => acc.add(Math.floor(Math.random() * daysInYear)), new Set())
    .size;
}

// Given a certain number of trails, generate n trials for a given group size
// and find the proportion of which had people with unique birthdays
function singleObservation(groupSize) {
  return randomGroup(groupSize) < groupSize ? 1 : 0;
}

function singleTrial() {
  return Array(daysInYear)
    .fill(0)
    .map((_, i) => ({ value: singleObservation(i), idx: i}));
}

function reduceStore(value) {
  return value.reduce((a, b) => a + b) / value.length;
}

function redraw() {
  const observations = singleTrial();
  observations.forEach((obs, i) => {
    store[i].push(obs.value)
  });

  d3.select('#single')
    .selectAll('rect')
    .attr('width', d => observations[d].value * scalex / 20)
    .attr('fill', d => observations[d].value > .5 ? 'green' : 'red');

  d3.select('#overall')
    .selectAll('rect')
    .attr('width', d => reduceStore(store[d]) * scalex)
    .attr('fill', d => reduceStore(store[d]) > .5 ? 'green' : 'red');

  d3.select('#overall')
    .selectAll('text')
    .text(d => Math.round(reduceStore(store[d]) * 100) / 100  )
    .attr('x', d => reduceStore(store[d]) * scalex + 30)
    .attr('fill', d => reduceStore(store[d]) > .5 ? 'green' : 'red');
}

function scaffold(selector) {
  const blanks = Array(daysInYear).fill(0).map((_, i) => i);

  d3.select(selector)
    .selectAll('rect')
    .data(blanks).enter()
    .append('rect')
    .attr('height', 30)
    .attr('x', 0)
    .attr('y', d => d * 30);

  d3.select(selector)
    .selectAll('text')
    .data(blanks).enter()
    .append('text')
    .attr('y', d => d * 30 + 20);
}

scaffold('#single');
scaffold('#overall');
setInterval(redraw, 100);
