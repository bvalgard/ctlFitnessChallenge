const margin1 = { top: 40, right: 280, bottom: 60, left: 80 };
const graphWidth1 = 640 - margin1.right - margin1.left;
const graphHeight1 = 390 - margin1.top - margin1.bottom;

const svg1 = d3.select('.canvas1')
  .append('svg')
  .attr('width', graphWidth1 + margin1.left + margin1.right)
  .attr('height', graphHeight1 + margin1.top + margin1.bottom);

svg1.append('text')
  .text('Total Steps / Team Rank')
  .attr('fill', '#ccc')
  .attr('font-size', 26)
  .attr('x', 65)
  .attr('y', 20)

const graph1 = svg1.append('g')
  .attr('width', graphWidth1)
  .attr('height', graphHeight1)
  .attr('transform', `translate(${margin1.left}, ${margin1.top})`);

// create axes groups
const xAxisGroup1 = graph1.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight1})`)



const yAxisGroup1 = graph1.append('g')
  .attr('class', 'y-axis');

const y1 = d3.scaleLinear()
    .range([graphHeight1, 0]);

const x1 = d3.scaleBand()
  .range([0, graphWidth1])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create & call axes
const xAxis1 = d3.axisBottom(x);
const yAxis1 = d3.axisLeft(y)
  .ticks(10)
  .tickFormat(d => d + ' orders');

// Tool Tip
const barTip = d3
  .tip()
  .attr("class", "d3-tip card") // We add the d3-tip class instead of the tip class
  .html((event, d) => { // It's (event, d) instead of just (d) in v6
    let content = `<div class="Team:">Team: ${d.teamName} </div>`;
    content += `<div class="steps">Steps: ${addCommas(d.totalSteps)}</div>`;
    content += `<div class="delete">Entires: ${d.totalEntries}</div>`;
    return content;
  });
 
graph1.call(barTip);


const updateTeam = (data) => { 

    teamA = data[0];
    teamB = data[1];
    teamC = data[2];
    teamD = data[3];
    
    // Sort decednding order
        var data = data.sort(function(a,b) {
          return a.totalSteps - b.totalSteps;
        });
      
          const y = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.totalSteps)])
            .range([graphHeight1,0]);
      
          // this will set the x position (x.name) and width of bars
          const x = d3.scaleBand()
            .domain(data.map(item => item.teamName))
            .range([0,graphWidth1])
            .paddingInner(0.45) // This changes distance between bars
            .paddingOuter(0.45); // this changes padding between bar group and y axis
      
      
          //join the data to rects
          const rects = graph1.selectAll('rect')
          .data(data)
      
          rects.attr('width', x.bandwidth)
            .attr('height', d => graphHeight1 - y(d.totalSteps))
            .attr('fill', '#00bfa5')
            .attr('x', d => x(d.teamName))
            .attr('y', d => y(d.totalSteps));
      
          //append the enter selection to the DOM
          // //  this rounds just the tops of the bars 
          // // https://dev.to/chooblarin/bar-chart-with-rounded-corner-by-d3js-2hid
          rx = 12;
          ry = 12;
          rects.enter()
          .append('path')
            .attr('fill', '#00bfa5')
            // rounded courners
            .attr("d", item => `
            M${x(item.teamName)},${y(item.totalSteps) + ry}
            a${rx},${ry} 0 0 1 ${rx},${-ry}
            h${x.bandwidth() - 2 * rx}
            a${rx},${ry} 0 0 1 ${rx},${ry}
            v${graphHeight1 - y(item.totalSteps) - ry}
            h${-(x.bandwidth())}Z
          `);
          
            graph1.selectAll('path')
            .on('mouseover', (event, d) => {
              d3.select(event.currentTarget)
                .transition().duration(100)
                .attr('fill', '#00ffdd')
                barTip.show(event, d);
            })
            .on('mouseleave', (event, d) => {
              d3.select(event.currentTarget)
                .transition().duration(100)
                .attr('fill', '#00bfa5')
                barTip.hide();
            })


      
          // create and call the axes
          const xAxis1 = d3.axisBottom(x);
          const yAxis1 = d3.axisLeft(y)
          .ticks(8)
          // .tickFormat(d => d + ' steps');
      
          xAxisGroup1.call(xAxis1);
          yAxisGroup1.call(yAxis1);

          // se if there is a way to add this to xAxisGroup1 above
          xAxisGroup1.selectAll('text')
          .attr('class', 'x-axis')
          .attr('transform', 'rotate(-40)')
          .attr('text-anchor', 'end');


    };

  
const updateTeamData = (steps, teamID) => {

  // this is for the very first time competition is 
  // setup. To make sure there is a database entry
  // ifnot set team steps to 0
  try {
    if (!teamSteps) {
      teamSteps=0;
    }
  } catch(err) {
    teamSteps=0;
  }

    if (teamID == teamA['teamName']) {
        teamID = teamA['teamName'];
        teamSteps = teamA['totalSteps'];
        teamEntries = teamA['totalEntries'];
    } 
    
    else if (teamID == teamB['teamName']) {
        teamID = teamB['teamName'];
        teamSteps = teamB['totalSteps'];
        teamEntries = teamB['totalEntries'];
    } 
    
    else if (teamID == teamC['teamName']) {
        teamID = teamC['teamName'];
        teamSteps = teamC['totalSteps'];
        teamEntries = teamC['totalEntries'];
    } 
    
    else if (teamID == teamD['teamName']) {
        teamID = teamD['teamName'];
        teamSteps = teamD['totalSteps'];
        teamEntries = teamD['totalEntries'];
    }

    updatedTeamSteps = steps + teamSteps;
    updatedTeamEntries = teamEntries += 1; 

   
    db.collection('teams').doc(teamID).update({'totalSteps': updatedTeamSteps, 'totalEntries': updatedTeamEntries});
    updateTeam(teamData);
}
