var width = 960, height = 500;
var projection = d3.geo.equirectangular();
var path = d3.geo.path().projection(projection);
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "formatCenter");

var div = d3.select("#map").append("div")
    .attr("id", "show")
    .attr("class", "mapTooltip")
    .style("opacity", 0);

var g = svg.append("g");
var worldData;
var CountryData;
var score;
var minScore;
var maxScore;
var domainScore = new Array(8);
var countryNotParticipate = [10, 248, 275, 304, 336, 384, 480, 531, 534, 535, 570, 574, 580, 624,626,659,728,732,744,831,832,833,854];

d3.json("data/world-50m.json", function(error, world) {
    worldData = world;
            
    d3.json("data/CountryOfMedals.json", function(error, country) {
        CountryData = country;
        score = CountryData.map(function (country){
            return country.gold + country.siliver + country.brown;
        });
            
    maxScore = d3.max(score);
    minScore = d3.min(score);
    domainScore = [minScore, 4, 6, 8, 12, 15, 18, maxScore];
    var colorRange = ['rgb(253,224,221)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)','rgb(73,0,106)'];
    var colorScale = d3.scale.linear()
    .domain(domainScore).range(colorRange);
            
    g.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features).enter().append("path").attr("d", path)
    .style("stroke", "black")
    .style("stroke-width", "0.2px")
    //scale countries which got at least one medal
    .style("fill", function(country){
        var i = 0;
        for(; i<CountryData.length; i++){
            var gotOneMedal = false;
            if (country.id == CountryData[i].id){
                gotOneMedal = true;
                break;
            }
        }
        if(gotOneMedal == false){
            if(countryNotParticipate.indexOf(country.id) == -1){
                return 'rgb(255,247,243)';
            }
            else{
                return "#969696";
            }
        }
        else{
            return colorScale(score[i]);
        }
                
    })
    .on("mouseover", function (country) {
        d3.select(this).transition().duration(300).style("stroke", "#CC0033").style("stroke-width", "2px");

        var i = 0;
        for(; i<CountryData.length; i++){
            var gotOneMedal = false;
            if (country.id == CountryData[i].id){
                gotOneMedal = true;
                break;
            }
        }
        if (gotOneMedal) {
            div.style("opacity", 1)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY -30) + "px");

            document.getElementById("show").innerHTML += "<span>" + CountryData[i].country + "</span>"+ "<br>"; 

            var svgGold = d3.select("#show").append("svg").attr("width", 50).attr("height", 30);
            svgGold.append("circle").attr("cx", 10)
            .attr("cy", 15)
            .attr("r", 9)
            .style("fill", "#ffd700")
            .style("stroke", "black");
            svgGold.append("text").text(CountryData[i].gold).attr("x", 25).attr("y", 19);

            var svgSiliver = d3.select("#show").append("svg").attr("width", 50).attr("height", 30);
            svgSiliver.append("circle").attr("cx", 10)
            .attr("cy", 15)
            .attr("r", 9)
            .style("fill", "#C0C0C0")
            .style("stroke", "black");
            svgSiliver.append("text").text(CountryData[i].siliver).attr("x", 25).attr("y", 19);

            var svgBrown = d3.select("#show").append("svg").attr("width", 50).attr("height", 30);
            svgBrown.append("circle").attr("cx", 10)
            .attr("cy", 15)
            .attr("r", 9)
            .style("fill", "#CD7F32")
            .style("stroke", "black");
            svgBrown.append("text").text(CountryData[i].brown).attr("x", 25).attr("y", 19);

            document.getElementById("show").innerHTML += "<br> Fastest male medalist in this country: <br>";

            if(CountryData[i].fast_man_name == "N/A"){
                document.getElementById("show").innerHTML += "No male medalists.";
            }
            if(CountryData[i].fast_man_name != "N/A"){
                document.getElementById("show").innerHTML += "<span>" + CountryData[i].fast_man_name + "   " + CountryData[i].fast_man_time + "</span>";
            }
            document.getElementById("show").innerHTML += "<br> Fastest female medalist in this country: <br>";
                    
            if(CountryData[i].fast_woman_name == "N/A"){
                document.getElementById("show").innerHTML += "No female medalists.";
            }
            if(CountryData[i].fast_woman_name != "N/A"){
                document.getElementById("show").innerHTML += "<span>" + CountryData[i].fast_woman_name + "   " + CountryData[i].fast_woman_time + "</span>";
            }
            d3.selectAll("span").style("font-size","16px");
        }   
    })
    .on("mouseout", function () {
        d3.select(this).transition().duration(10).style("stroke", "black")
        .style("stroke-width", "0.2px");
                
        div.style("opacity", 0);

        document.getElementById("show").innerHTML = "";
    });

    var colorLegend = ['#969696', 'rgb(255,247,243)','rgb(253,224,221)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)','rgb(73,0,106)'];
    var legend = svg.selectAll("g.legend")
        .data(colorLegend)
        .enter().append("g")
        .attr("class", "legend");
             
    var ls_w = 15, ls_h = 15;
             
    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i*ls_h) - 5*ls_h - 5;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return d; })
        .style("opacity", 0.8);
             
    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return height - (i*ls_h) - 4*ls_h - 9;})
        .text(function(d, i){ 
            if (i == 0) return "Never participated in Olympic Games."
            else if (i == 1) return "Never won a medal."
            else return "<="+ domainScore[i-2]; 
        })
        .style("font-size", "12px");
            
    legend.append("text")
        .attr("x", 15)
        .attr("y", 280)
        .text("Total number of medals:")
        .style("font-size", "12px")
        .style("opacity", 0.8);
    });

});