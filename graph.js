const margin = { top: 40, right: 50, bottom: 60, left: 70 };
const graphWidth = 560 - margin.right - margin.left;
const graphHeight = 390 - margin.top - margin.bottom;

const svg = d3.select('.canvas2')
  .append('svg')
  .attr('width', graphWidth + margin.left + margin.right)
  .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// axes groups
const xAxisGroup = graph.append('g')
  .attr('class', 'x-axis')
  .attr('transform', "translate(0," + graphHeight + ")");

const yAxisGroup = graph.append('g')
  .attr('class', 'y-axis');
  
// d3 line path generator

const line = d3.line()
  // change line to curve rather than straight lines
  .curve(d3.curveCardinal) // https://bl.ocks.org/d3noob/843b6b434bc1006da0234a95d2e89479
  .x(function(d){ return x(new Date(d.date))})
  .y(function(d){ return y(d.steps) }); 


// line path element
const path = graph.append('path');

// create dotted line group and append to graph
const dottedLines = graph.append('g')
  .attr('class', 'lines')
  .style('opacity', 0);

// create x dotted line and append to dotted line group
const xDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

// create y dotted line and append to dotted line group
const yDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);


Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function short_months(dt)
   { 
     return Date.shortMonths[dt]; 
   }




// Tool Tip
const tip = d3
  .tip()
  .attr("class", "d3-tip card") // We add the d3-tip class instead of the tip class
  .html((event, d) => { // It's (event, d) instead of just (d) in v6
    ttMonth = new Date(d.date).getMonth();
    ttMonth = short_months(ttMonth)
    ttDay = myDate = new Date(d.date).getDate();
    ttYear = myDate = new Date(d.date).getFullYear();
    ttSteps = addCommas(d.steps)
    ttEntries = d.entries;

    let content = `<div class="Date:">Date: ${ttMonth} ${ttDay}, ${ttYear}</div>`;
    content += `<div class="steps">Steps: ${ttSteps}</div>`;
    content += `<div class="delete">Entires: ${ttEntries}</div>`;
    return content;
  });
 
graph.call(tip);
 
// // this is setting the entries to 0
// var entries = 0;

// update function
const update = (data) => {

  data = data.filter(item => item.team == team);

  
  // sort data based on date objects
  data.sort((a,b) => new Date(a.date) - new Date(b.date));

  // This is to give me the total number of steps for checking, but I don't need this
  // var MYtotal = 0;
  // for (i in data) {
  //   MYtotal = MYtotal + parseInt(data[i].steps);
    
  // }
  // console.log(MYtotal);

  // Sum steps together if they're from the same day
  // TODO: var, let, const? what is totalSteps and updateID
  
  totalSteps = 0;
  updateID = '';
  arrayLength = data.length;
  if (arrayLength) {
    const lastEntryDate = new Date(data[arrayLength -1]['date']);
    const lastEntryDay = lastEntryDate.getDate();
    const lastEntryMonth = lastEntryDate.getMonth();
    const lastEntryYear = lastEntryDate.getFullYear();
    
    updateID = data[arrayLength -1]['id'];

    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear(); 
  
    if (lastEntryDay == todayDay && lastEntryMonth == todayMonth && lastEntryYear == todayYear) {

      totalSteps = data[arrayLength -1]['steps'];
      dayEntries = data[arrayLength -1]['entries'];

    };
  };


  // set scale domains
  x.domain(d3.extent(data, d => new Date(d.date)));
  y.domain([0, d3.max(data, d =>  d.steps)]);

  // update path data 
  path.data([data])
    .attr('fill', 'none')
    .attr('stroke', '#00bfa5')
    .attr('stroke-width', 2)
    .attr('d', line);





  // create circles for objects
  const circles = graph.selectAll('circle')
    .data(data)
   
    graph.append('text')
      .text(`Steps for ${team}`)
      .attr('fill', '#ccc')
      .attr('font-size', 26)
      .attr('x', 120)
      .attr('y', -20);
    
      // update title with new team name 
    d3.selectAll("svg text")
      .filter(function() {
        return /^Steps for/.test(d3.select(this).text()); // select the text that starts with Steps for
      }).text(`Steps for ${team}`);


  // remove unwanted points
  circles.exit().remove();
  
  //update current points
  circles
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.steps)); 


  // add new points
  circles.enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.steps))
    .attr('fill', '#ccc');

  // graph.append('text')
  //   .text(`Steps for ${team}`)
  //   .attr('fill', '#ccc')
  //   .attr('font-size', 26)
  //   .attr('x', 150)
  //   .attr('y', 25);

 graph.selectAll('circle')
   .on('mouseover', (event, d) => {
       d3.select(event.currentTarget)
         .transition().duration(100)
         .attr('r', 8)
         .attr('fill', '#fff')
         tip.show(event, d);

       // set x dotted line coords (x1, x2, y1,y2)
       xDottedLine
         .attr('x1', x(new Date(d.date)))
         .attr('x2', x(new Date(d.date)))
         .attr('y1', graphHeight)
         .attr('y2', y(d.steps));

        yDottedLine
          .attr('x1', 0)
          .attr('x2', x(new Date(d.date)))
          .attr('y1', y(d.steps))
          .attr('y2', y(d.steps));

        // show the dotted line group (.style, opacity)
        dottedLines.style('opacity', 1);


   })
   .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget)
            .transition().duration(100)
            .attr('r', 4)
            .attr('fill', '#ccc')
            tip.hide();

        // hide teh dotted line group (.style, opacity)
        dottedLines.style('opacity', 0);



   })
   

   // Tick numbers ()
   var numberOfTicks = 6;
   if (arrayLength <= 5) {
    numberOfTicks = arrayLength;
   };


  // create axes
  const xAxis = d3.axisBottom(x)
    .ticks(numberOfTicks)
    .tickFormat(d3.timeFormat('%b %d'));
    
  const yAxis = d3.axisLeft(y)
    .ticks(10);
    // .tickFormat(d => d + 'm'); // how to add with out getting rid of , in thousands


  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // rotate axis text
  xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');


};





var teamData = []

db.collection('teams').onSnapshot(res => {

  res.docChanges().forEach(change => {

    const teamDoc = {...change.doc.data(), id: change.doc.id};

    switch (change.type) {
      case 'added':
        teamData.push(teamDoc);
        break;
      case 'modified':
        const index = teamData.findIndex(item => item.id == teamDoc.id);
        teamData[index] = teamDoc;
        break;
      case 'removed':
        teamData = teamData.filter(item => item.id !== teamDoc.id);
        break;
      default:
        break;
    }
  });

  updateTeam(teamData);
});

// data and firestore
var data = [];

db.collection('step_competition').orderBy('date').onSnapshot(res => {

  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id};

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  });

  update(data);

});
