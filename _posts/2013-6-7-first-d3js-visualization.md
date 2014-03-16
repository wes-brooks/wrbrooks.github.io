---
layout: post
title:  "First D3.js visualization"
date:   2013-6-7
---

#####Estimated effect of mining employment on poverty, 1970

<style type='text/css'>
#annotation {
  position: absolute;
  width: 200px;
  height: auto;
  padding: 10px;
  background-color: white;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  -webkit-box-shadow: 1px 1px 3px rgba(0,0,0,0.4);
  -moz-box-shadow: 1px 1px 3px rgba(0,0,0,0.4);
  box-shadow: 1px 1px 3px rgba(0,0,0,0.4);
  pointer-events: none;
  float:right
}
#annotation.hidden {
  display: none
}
#annotation p {
  margin:0;
  font-family: sans-serif;
  line-height: 20px;
}
</style>

<div id='pov-pex-1970' style="width:100%; max-width:600px; position:relative">
  <div id='annotation' class='hidden'>
    <p><strong><span id='county_label'>Important label</span></strong></p>
    <p><span id='value'>100</span></p>
  </div>
</div>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://d3js.org/topojson.v1.min.js"></script>
<script src="http://d3js.org/queue.v1.min.js"></script>
<script>
var width = $('#pov-pex-1970')[0].scrollWidth,
    height = 300;

var projection = d3.geo.albers()
    .center([0, 46.2])
    .parallels([42, 50])
    .rotate([90,0])
    .scale(5000)
    .translate([width / 2, height / 2]);

var svg = d3.select("#pov-pex-1970").append("svg")
    .attr("class", "img-responsive")
    .style("background-color", "rgb(240, 240, 240)");


//connect the values to the shapes via the centroids:
matchPolygons = function (geo, coefs) {
    for(var i=0; i<geo.length; i++) {
        var found = false;
        for(var j=0; j<coefs.length; j++) {
            if(geo[i].properties.fips==coefs[j].fips) {
                geo[i].indx = j;
                geo[i].centroid = {'x':coefs[j].x, 'y':coefs[j].y};
                found=true;
                break;
            }
        }
        if(!found) { geo[i].indx = NaN; geo[i].centroid=NaN; }
    }
    return geo;
}


//find the corners of the drawing area (used to scale the drawing):
var box_extents = function(coords, projection) {
    //Get the extents in raw form:
    var xlims = d3.extent([].concat.apply([], coords.map(function(a) {return a.map(function(b) {return b[0]})})))
    var ylims = d3.extent([].concat.apply([], coords.map(function(a) {return a.map(function(b) {return b[1]})})))
    
    //Project the corner points to pixels and return them
    return [projection([xlims[1], ylims[1]]), projection([xlims[0], ylims[0]])];
}


//translate values to colors:
var color_map = function(xrange, colrange, xcrit, colcrit) {
  //If we specified a critical value, make separate scales above and below it:
  if (xcrit != 'null' && colcrit != 'null') {
    var colneg = d3.scale.linear()
      .domain([xrange[0],xcrit])
      .range(['rgb('+String(colrange[0][0])+','+String(colrange[0][1])+','+String(colrange[0][2])+')', 'rgb('+String(colcrit[0])+','+String(colcrit[1])+','+String(colcrit[2])+')']);
  
    var colpos = d3.scale.linear()
      .domain([xrange[1],xcrit])
      .range(['rgb(' + String(colrange[1][0])+','+String(colrange[1][1])+','+String(colrange[1][2])+')', 'rgb('+String(colcrit[0])+','+String(colcrit[1])+','+String(colcrit[2])+')']);
    
    return function(x) {
      if (x<=0) {return colneg(x)}
      else {return colpos(x)}
    }
  }
  
  //if we didn't specify a critical value:
  else {  
    return d3.scale.linear()
      .domain(xrange)
      .range(['rgb('+String(colrange[0][0])+','+String(colrange[0][1])+','+String(colrange[0][2])+')', 'rgb('+String(colrange[1][0])+','+String(colrange[1][1])+','+String(colrange[1][2])+')']);
  }
}


//wait for the data to load
queue()
    .defer(d3.csv, "//somesquares.org/static/csv/poverty/coefs-1970.csv")
    .defer(d3.csv, "//somesquares.org/static/csv/poverty/centroids.csv")
    .defer(d3.json, "//somesquares.org/static/json/wisconsin-topo.json")
    .await(ready);


var proj, c;
var out = [];
var features;
//once the data is loaded, draw the map:
function ready(error, coefs, centroids, topology) {
  features = topojson.feature(topology, topology.objects['wisconsin-geo']).features;
  
  //Remove the water
  var rem = [75,14];
  for (var i=0; i<rem.length; i++) {
    features.splice(rem[i],1);
  }
  features = matchPolygons(features, coefs);
  
  c = coefs
  
  //Find the extents of the plot area
  var corners = box_extents(features.map(function(x) {return x.geometry.coordinates[0]}), projection);
  var xrange = corners[0][0] - corners[1][0]
  var yrange = corners[1][1] - corners[0][1]
  svg.attr("height", yrange*width/xrange + 15).attr('width',width)

  //Scale the figure to match the plot area
  var sx = d3.scale.linear()
    .domain([corners[1][0], corners[0][0]])
    .range([5,width-15]);

  var sy = d3.scale.linear()
    .domain([corners[0][1], corners[1][1]])
    .range([0,yrange*width/xrange]);

  //Set up the scale, projection, and path functions:
  var scale = function(a) {return [sx(a[0]), sy(a[1])]}    
  proj = function(x) {return scale(projection(x))}
  var path = d3.geo.path().projection(proj);
  
  //extract the values to plot:
  //var out = [];
  for(var i=0; i<features.length; i++) {
    if(!isNaN(features[i].indx)) {
      out.push(parseFloat(coefs[features[i].indx]['pex']));
      features[i].out = parseFloat(coefs[features[i].indx]['pex']);
    }
    else {
      out.push(NaN);
      features[i].out = NaN;
    }
  }

  //establish the color mapping:
  var color = color_map(d3.extent(out),
    [[94,60,153],[230,97,1]],
    0,
    [255,255,255]
  );

  //draw the shapes and fill them based on our color mapping:
  svg.selectAll("path")
      .data(features)
      .enter().append("path")      
      .attr("d", path)
      .style("fill", function(d) {
        if(!isNaN(d.out)) { return color(d.out); }
        else { return "#ccc"; }
      })
      .style('stroke', 'rgb(220,220,220)')
      .style('stroke-width', '0.5px')
      .on('mouseover', function(d,i) {
        var xPosition = parseFloat(d.centroid.x);
        var yPosition = parseFloat(d.centroid.y);
        var loc = proj([xPosition, yPosition])
        d3.select('#annotation')
          .style('left', loc[0]+'px')
          .style('top', loc[1]+'px')
          .select('#value')
          .text(String(d3.round(d.out,2)));
        d3.select('#annotation')
          .select('#county_label')
          .text(d.properties.county);
        d3.select('#annotation').classed('hidden', false);
      })
      .on('mouseout', function() {
        //d3.select('#tooltip').remove()
        d3.select('#annotation').classed('hidden', true);
      });
      
  //range for a legend:
  var min = d3.min(out)
  var max = d3.max(out)
  var legend = [min, min/2, 0, max/2, max]
  
  //draw icons for the legend 
  svg.selectAll("rect")
    .data(legend)
    .enter()
    .append("rect")
    .attr("x",20)
    .attr('y', function(d,i) {return yrange * width/xrange - 15 - 25*i})
    .attr('width',24)
    .attr('height',24)
    .attr('fill', function(d,i) {return color(d)});
    
  //labels for the legend
  var tags = [String(d3.round(min,1)),
    "",
    "0",
    "",
    String(d3.round(max,1))];
    
  //draw labels on the legend:
  svg.selectAll("text")
    .data(legend)
    .enter()
    .append("text")
    .attr("x",50)
    .attr('y', function(d,i) {return yrange * width/xrange +1 - 25*i})
    .text(function(d,i) {return tags[i]})
    .attr('font-weight','bold');
    
  //title for the legend:
  svg.append('text').attr('x',5).attr('y',yrange * width/xrange - 125).text('Odds Ratio').attr('font-weight','bold');
}
</script>