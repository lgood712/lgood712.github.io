//PIE CHARTS	
// adapted from http://jsfiddle.net/ragingsquirrel3/qkHK6/

var w = 600,
    h = 300,
    r = h/3,
    x_pos = w/3,
    y_pos = h/2,
    color = d3.scale.category20c();

//Chart 1: Medals by Age
var age_medals = [],
    pct,
    group1 = {"age_range":"<20 Years Old","medal_count":0},
    group2 = {"age_range":"20-23 Years Old","medal_count":0},
    group3 = {"age_range":"24-27 Years Old","medal_count":0},
    group4 = {"age_range":"27-30 Years Old","medal_count":0},
    group5 = {"age_range":">30 Years Old","medal_count":0};

all_sprinters.forEach(function(d,i) { 
    if (d.age < 21){ group1.medal_count++; }
    else if (20 < d.age && d.age < 24){ group2.medal_count++; }
    else if (24 < d.age && d.age < 28){ group3.medal_count++; }
    else if (28 < d.age && d.age < 31){ group4.medal_count++; }
    else { group5.medal_count++; }
});

age_medals.push(group1, group2, group3, group4, group5);
        
var pie_svg = d3.select('#pie_canvas').append("svg").data([age_medals]).attr("width", w).attr("height", h)
    .append("g")
    .attr("transform", "translate(" + x_pos + "," + y_pos + ")")
    .attr("class", "formatCenter");
		
//titling graph
pie_svg.append("text")
    .attr("x", (w / 3))             
    .attr("y", -110)
    .attr("text-anchor", "middle")  
    .style("font-size", "17px")		
    .style("font-weight", "bold")
    .text("How Old are Olympic Medal Sprinters?")
    .attr("class", "graph_title");
pie_svg.append("text")
    .attr("x", w/3)             
    .attr("y", -90)
    .attr("text-anchor", "middle")  
    .style("font-size", "14px")		
    .text("Percentage of Medals by Age");

//creating key
pie_svg.append("group").attr("id", "labels");
var vert_pos = -60;
pie_svg.selectAll("#labels text")
    .data(age_medals)
    .enter()
    .append("svg:text")
    .attr("text-anchor", "middle")  
    .style("font-size", "14px")	
    .text(function(d) { return d.age_range + " " + (Math.round(d.medal_count*10000/all_sprinters.length)/100).toString() + "%"; })
    .attr("x", w/3)
    .attr("y", function(d) { vert_pos += 20; return vert_pos; })
    .attr("fill", function(d, i){return color(i);});

		
var pie = d3.layout.pie().value(function(d){return d.medal_count;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = pie_svg.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
    .attr("fill", function(d, i){return color(i);})
    .attr("d", function (d) {
        return arc(d);
    });

//add inner text
arcs.append("svg:text")
    .attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d, i) {
        pct = Math.round(age_medals[i].medal_count*10000/all_sprinters.length)/100;
        return pct.toString()+"%";
    }
);


//Chart 2: Where are Medalists From?
        
var area_medals = [],
    area1 = {"area": "North America", "medal_count": 0},
    area2 = {"area": "Caribbean", "medal_count": 0},
    area3 = {"area": "Africa", "medal_count": 0},
    area4 = {"area": "Western Europe", "medal_count": 0},
    area5 = {"area": "Eastern Europe", "medal_count": 0},
    area6 = {"area": "Other", "medal_count": 0};
    
        
all_sprinters.forEach(function(d,i) {
    if (d.race == area1.area){ area1.medal_count++; }
    else if (d.race == area2.area){ area2.medal_count++; }
    else if (d.race == area3.area){ area3.medal_count++; }
    else if (d.race == area4.area){ area4.medal_count++; }
    else if (d.race == area5.area){ area5.medal_count++; }
    else { area6.medal_count++; }
});

area_medals.push(area1, area2, area3, area4, area5, area6);

var pie_svg2 = d3.select('#pie_canvas2').append("svg").data([area_medals]).attr("width", w).attr("height", h)
    .append("g")
    .attr("transform", "translate(" + x_pos + "," + y_pos + ")");

//titling graph
pie_svg2.append("text")
    .attr("x", (w / 3))             
    .attr("y", -110)
    .attr("text-anchor", "middle")  
    .style("font-size", "17px")		
    .style("font-weight", "bold")
    .text("Where in the World are Medalists From?")
    .attr("class", "graph_title");
pie_svg2.append("text")
    .attr("x", w/3)             
    .attr("y", -90)
    .attr("text-anchor", "middle")  
    .style("font-size", "14px")		
    .text("Percentage of Medals by Global Region");

//creating key
pie_svg2.append("group").attr("id", "labels");
vert_pos = -60;
pie_svg2.selectAll("#labels text")
    .data(area_medals)
    .enter()
    .append("svg:text")
    .attr("text-anchor", "middle")  
    .style("font-size", "14px")	
    .text(function(d) { return (d.area).replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) + " " + (Math.round((d.medal_count)*10000/all_sprinters.length)/100).toString() + "%"; })
    .attr("x", w/3)
    .attr("y", function(d) { vert_pos += 18; return vert_pos; })
    .attr("fill", function(d, i){return color(i);});

		
pie = d3.layout.pie().value(function(d){return d.medal_count;});

// declare an arc generator function
arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
arcs = pie_svg2.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
    .attr("fill", function(d, i){return color(i);})
    .attr("d", function (d) {
        return arc(d);
    });

//add inner text
arcs.append("svg:text")
    .attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text( function(d, i) {
        pct = Math.round((area_medals[i].medal_count)*10000/all_sprinters.length)/100;
        if (pct > 8) {return pct.toString()+"%";}
    }
);