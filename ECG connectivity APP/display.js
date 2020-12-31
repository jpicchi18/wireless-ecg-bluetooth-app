function showControl() {
    document.getElementById('controlsView').style.setProperty('display', 'block');
    document.getElementById('startView').style.setProperty('display', 'none');
    graph.initialize();
}

function showStart() {
    document.getElementById('controlsView').style.setProperty('display', 'none');
    document.getElementById('startView').style.setProperty('display', 'block');
}


var graph = {};
graph.initialize = function() {
  graph.dps = [];
  graph.xVal = 0;
  graph.dataLength = 500;
  graph.chart = new CanvasJS.Chart("chartContainer", {
      title :{
          text: "Dynamic Data"
      },
      axisY: {
          includeZero: false
      },
      data: [{
          type: "line",
          dataPoints: graph.dps
      }]
   });
}

graph.updateChart = function(yVal) {
      graph.dps.push({
          x: graph.xVal,
          y: yVal
      });
      graph.xVal++;


  if (graph.dps.length > graph.dataLength) {
      graph.dps.shift();
  }

  graph.chart.render();
  }
