
  var maxTick = 2;

  //-----------------------------------------------------------------------------------
  // Calculates needle path
  //-----------------------------------------------------------------------------------
  const calcNeedle = function(l){ //takes in level
  // Trig to calc meter point
    degrees = 180 - l,
        radius = .35,
        radians = degrees * Math.PI / 180,
        x = radius * Math.cos(radians),
        y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';

    path = mainPath.concat(pathX,space,pathY,pathEnd);
    return path;
  }

  //-----------------------------------------------------------------------------------
  // Obtains layout data based on the path created
  //-----------------------------------------------------------------------------------
  const getLayout = function(p){
    var layout = {
      // filename: "streamTest",
      // fileopt: "overwrite",
      shapes:[{
          type: 'path',
          path: p,
          layer: 'above',
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '',
      autosize: true,
      // height: 600,
      // width: 600,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
    };
    return layout;
  }

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'speed',
      // text: level,
      hoverinfo: 'text+name'},
    { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
    rotation: 90,
    text: [''],
    textinfo: 'text',
    textposition:'inside',      
    marker: {colors:['#ff9800', '#fdab31', '#fcbe63', '#fad194', '#f9e4c6', '#f7f7f7',
                           'rgba(255, 255, 255, 0)']},
    labels: 'none',
    hoverinfo: 'none',
    hole: .5,
    type: 'pie',
    showlegend: false,

  }];

  //first plot that's drawn with tick initially at 0 or 90 degrees
  // Plotly.newPlot('plotly', data, getLayout(calcNeedle(90)), {displayModeBar: false});

var d3 = Plotly.d3;

viewWidth = $(window.top).width();
viewHeight = $(window.top).height();

console.log("viewWidth is first established as " + viewWidth);
console.log("viewHeight is first established as " + viewHeight);
    var WIDTH_IN_PERCENT_OF_PARENT = 40,
      HEIGHT_IN_PERCENT_OF_PARENT = 80
      console.log("Estiablished width is " + WIDTH_IN_PERCENT_OF_PARENT);

const calcPercent = function(){
  if (viewWidth > 1024){
    var WIDTH_IN_PERCENT_OF_PARENT = 40,
      HEIGHT_IN_PERCENT_OF_PARENT = 80;

var gd3 = d3.select("div[id='plotly']")
    .style({
        width: WIDTH_IN_PERCENT_OF_PARENT + 'vw',
        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
        'margin-top': (95 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + '%'
    });
  }else{
    var WIDTH_IN_PERCENT_OF_PARENT = 100,
      HEIGHT_IN_PERCENT_OF_PARENT = 70;

    var gd3 = d3.select("div[id='plotly']")
      .style({
          width: WIDTH_IN_PERCENT_OF_PARENT + 'vw',
          height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh'
          // 'margin-top': (95 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + '%'
      });
  };

  console.log("WIDTH IN PERCENT OF PARENT IS " + WIDTH_IN_PERCENT_OF_PARENT);
  console.log("HEIGHT IN PERCENT OF PARENT IS " + HEIGHT_IN_PERCENT_OF_PARENT);
}

calcPercent();

$(window).on('resize', function(){
  viewWidth = $(window.top).width();
  console.log("THE WIDTH OF THIS NAME DID IS " + viewWidth);
  calcPercent();
})

calcPercent();

var gd3 = d3.select("div[id='plotly']")
    // .style({
    //     width: WIDTH_IN_PERCENT_OF_PARENT + 'vw',
    //     height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
    //     'margin-top': (95 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + '%'
    // });
var resultGraph = gd3.node();
Plotly.newPlot(resultGraph, data, getLayout(calcNeedle(90)), {displayModeBar: false});
window.onresize = function() { Plotly.Plots.resize( resultGraph ); };


//-----------------------------------------------------------------------------------
// Draws needle
//-----------------------------------------------------------------------------------
const drawNeedle = function(){
  //Must check to determine the min/max of gauge. Generally average does not exceed absolute value of 2 past the first few tweets
  score = document.getElementById("average").innerHTML || 0;

  if (Math.abs(score) > maxTick){
    maxTick = Math.abs(score);
    console.log("Max Tick has been updated to: " + maxTick);
    level = +score + maxTick;
    // console.log(score + " + " + maxTick + " = " + level);
    level = +level * (90/maxTick);
    console.log("level is: " + level);

  }else{
    // console.log("Max Tick stays the same: " + maxTick);
    level = +score + maxTick;
    // console.log(score + " + " + maxTick + " = " + level);
    level = +level * (90/maxTick);
    console.log("level is: " + level);
  }

  //recalculates needle with new level, reassigns the path of needle
  calcNeedle(level);

  //reupdates layout with new path
  var layout_update = getLayout(path);

Plotly.update('plotly', data, layout_update, {displayModeBar: false});
return("worked");
}


