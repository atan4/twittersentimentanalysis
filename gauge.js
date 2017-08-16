var config  = require('/config.js'),
    plotly  = require('plotly')(config.plotly.username, config.plotly.apiKey);

const gauge = function makeGauge(){
  // Enter a speed between 0 and 180
  var level = 100;
   
  // Trig to calc meter point
  var degrees = 180 - level,
    radius = .5,
    radians = degrees * Math.PI / 180,
    x = radius * Math.cos(radians),
    y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
     stream:{token: config.plot.token, maxpoints:200},
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
    rotation: 90,
    text: [''],
    textinfo: 'text',
    textposition:'inside',      
    marker: {colors:['#ff9800', '#fdab31', '#fcbe63', '#fad194', '#f9e4c6', '#f7f7f7',
                           'rgba(255, 255, 255, 0)']},
    labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
    hoverinfo: 'none',
    hole: .5,
    type: 'pie',
    showlegend: false,
  }];

  var layout = {
    // filename: "streamTest",
    // fileopt: "overwrite",
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '',
    height: 1000,
    width: 1000,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

// Plotly.plot('myDiv', data, layout, {displayModeBar: false}, function (err, resp) {
//     if (err) return console.log("ERROR", err)

//     console.log(resp)

//     var plotlystream = Plotly.stream(token, function () {})
//     var signalstream = Signal({tdelta: 100}) //


//     plotlystream.on("error", function (err) {
//         signalstream.destroy()
//     })

//     // Okay - stream to our plot!
//     signalstream.pipe(plotlystream)
// })

  Plotly.newPlot('myDiv', data, layout, {displayModeBar: false});
}