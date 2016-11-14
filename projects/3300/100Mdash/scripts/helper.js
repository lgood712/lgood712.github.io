// Globals
var CANVAS_WIDTH = 1300;
var CANVAS_HEIGHT = 800;

var CANVAS_PADDING = 100;
      
var medalsColorMap = new Map;
medalsColorMap.set(1, "#ffd700")
    .set(2, "#C0C0C0")
    .set(3, "#CD7F32");

var medalsPlaceMap = new Map;
medalsPlaceMap.set(1, "Gold")
    .set(2, "Silver")
    .set(3, "Bronze");

var newDists1 = [];
var newDists2 = [];

var arrowList1 = [];
var arrowList2 = [];

var countryCodeMap = new Map;
countryCodeMap.set("USA", "United States")
    .set("CAN", "Canada")
    .set("GBR", "United Kingdom")
    .set("TRI", "Trinidad")
    .set("RUS", "Russia")
    .set("GER", "Germany")
    .set("RSA", "South Africa")
    .set("POR", "Portugal")
    .set("NAM", "Namibia")
    .set("CUB", "Cuba")
    .set("BAR", "Barbados")
    .set("BUL", "Bulgaria")
    .set("AUS", "Australia")
    .set("PAN", "Panama")
    .set("NED", "Netherlands")
    .set("NZL", "New Zealand")
    .set("HUN", "Hungary")
    .set("BLR", "Belarus")
    .set("GRE", "Greece")
    .set("POL", "Poland")
    .set("EUA", "South Africa")
    .set("ITA", "Italy")
    .set("JAM", "Jamaica");

var xScale1 = d3.scale.linear()
    .domain([30, 0])
    .range([CANVAS_PADDING, CANVAS_WIDTH - 2*CANVAS_PADDING]);

var yScale1 = d3.scale.linear()
    .domain([1892, 2016])
    .range([CANVAS_HEIGHT - CANVAS_PADDING, CANVAS_PADDING]);

var xScale2 = d3.scale.linear()
    .domain([26, 0])
    .range([CANVAS_PADDING, CANVAS_WIDTH - 2*CANVAS_PADDING]);

var yScale2 = d3.scale.linear()
    .domain([1924, 2016])
    .range([CANVAS_HEIGHT - CANVAS_PADDING, CANVAS_PADDING]);

var numberMedalsCountryMap = new Map;

var medalsCountryMap = new Map;

var countriesOrderedList;
    
// Function to convert text_like_this to Text Like This
var attr2name = function(attr) {
    returnStr = "";
    attr = attr.replace(/_/g, " ");
    words = attr.split(" ");
    words.forEach( function(w,index) { returnStr += " " + w.charAt(0).toUpperCase() + w.substr(1); } );
    return returnStr.trim();
};

// Swap and bubble sort taken from: http://www.nczonline.net/blog/2009/05/26/computer-science-in-javascript-bubble-sort/
function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

// Function to create a map of the countries to number of medals they have won
var preProcessing = function (sprinterList) { 
    numberMedalsCountryMap.clear();

    var arrowList = [];
    var tempList = []
    countriesOrderedList = [];


    sprinterList.forEach(function(num, i){
        if(numberMedalsCountryMap.has(num.country_code)){
            numberMedalsCountryMap.set(num.country_code, numberMedalsCountryMap.get(num.country_code) + 1);
        }
        else{
            numberMedalsCountryMap.set(num.country_code, 1);
        }
        
        if(num.name == "Frank Jarvis"){
            arrowList1.push(num.meters_behind_fastest);
            arrowList1.push(num.competition_year);
        }

        if(num.name == "Hilda Strike"){
            arrowList2.push(num.meters_behind_fastest);
            arrowList2.push(num.competition_year);
        }

        var temp;

        if(medalsCountryMap.has(num.country_code)){
            temp = medalsCountryMap.get(num.country_code);
            temp[num.place-1]++;
            medalsCountryMap.set(num.country_code, temp);
        }
        else{
            temp = [0, 0, 0];
            temp[num.place-1]++;
            medalsCountryMap.set(num.country_code, temp);
        }
    });

    numberMedalsCountryMap.forEach(function (d, i){
        tempList.push(d);
        countriesOrderedList.push(i);
    });

    max = d3.max(tempList);

    var len = tempList.length,
        i, j, stop;

    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop; j++){
            if (tempList[j] > tempList[j+1]){
                swap(tempList, j, j+1)
                swap(countriesOrderedList, j, j+1);
            }
        }
    }

    countriesOrderedList.reverse();
};

// Function to generate SVG figures
var generateFigure = function(divID, xScale, yScale, title, xAxisText, yAxisText, graphNum) {
    
    var svg = d3.select(divID)
        .append("svg")
        .attr("class","figure")
        .attr("height", CANVAS_HEIGHT)
        .attr("width", CANVAS_WIDTH - 100)
        .attr("class", "formatCenter")
        .attr("id", "svg" + graphNum);

    function make_x_axis() {        
        return d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5)
    }

    svg.append("text")
        .attr("class", "graph_title")
        .style("font-size", 35)
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("x", CANVAS_WIDTH/2 - 50)
        .attr("y", CANVAS_PADDING/2)
        .text(title);

    var xAxis = d3.svg.axis()
        .scale(xScale).orient("bottom")
        .tickFormat(d3.format("d"))
        .ticks(5);

    var yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(10)
        .tickFormat(d3.format("d"));

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + (CANVAS_HEIGHT - CANVAS_PADDING) + ")")
        .call(xAxis)
        .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1.5px'});

    svg.append("text")
        .attr("class", "x label")
        .style("font-size", 24)
        .attr("text-anchor", "middle")
        .attr("x", CANVAS_WIDTH/2 - 50)
        .attr("y", CANVAS_HEIGHT - 30)
        .text(xAxisText);

    svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(0," + (CANVAS_HEIGHT - CANVAS_PADDING) + ")")
        .call(make_x_axis()
            .tickSize(-CANVAS_HEIGHT+2*CANVAS_PADDING, 0, 0)
            .tickFormat("")
        )

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + (CANVAS_WIDTH - CANVAS_PADDING - 100) + ",0)")
        .call(yAxis)
        .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1.5px', 'font-family': 'tahoma'});

    svg.append("text")
        .attr("class", "y label")
        .style("font-size", 24)
        .attr("text-anchor", "middle")
        .attr("x", -CANVAS_HEIGHT/2)
        .attr("y", (CANVAS_WIDTH - CANVAS_PADDING - 40))
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(yAxisText);
    
    return svg;
};

// Function to generate circle plots
var makeCirclesFromData = function(dataSet, svg, xScale, yScale) {

    var tooltip = d3.select("body")
        .append("div").attr("class", "tooltip")
        .style("visibility", "hidden");

    svg.selectAll(".point")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("id", function(value) {return value.country_code})
        .attr("r", function(value) { return 7;})
        .attr("cx", function(value) { return xScale(value.meters_behind_fastest);})
        .attr("cy", function(value) { return yScale(value.competition_year);})
        .style("fill", function(value) { return medalsColorMap.get(value.place);})
        .style("opacity", .70)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", function(d) {
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 10)
                .attr("stroke", "black")
                .style("stroke-width", "3px");

            tooltip.transition()
                .duration(120)
                .style("opacity", .85)
                .style("visibility", "visible");
            
            tooltip.html("<b>" + d["name"] + "</b> (" + d["country_code"] + ")<br/>" 
                       + "<b>Year:</b> " + d["competition_year"] + "<br/>"
                       + "<b>Time:</b> " + d["time"] + " s<br/>"
                       + "<b>Meters Behind:</b> " + d["meters_behind_fastest"] + " m<br/>")
                .style("left", (d3.event.pageX ) + "px")
                .style("top", (d3.event.pageY - 90) + "px");
        })
        .on("mouseout", function(d) {
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 7)
                .attr("stroke", "black")
                .style("stroke-width", "1px");;

          tooltip.transition()
            .duration(460)
            .style("opacity", 0);
        });
};

// Function to individually add country divs
var addCountryDiv = function (divID, svg, countryName, countryCode, medals, leftCord, topCord, xScale, yScale, graphNum) {
    
    var str = countryName + " " + medals;

    svg.append("text")
        .attr("x", leftCord)
        .attr("y", topCord)
        .text(str)
        .style("text-decoration", "underline")  
        .style("font-size", "18px")
        .attr("id", "foo" + graphNum);

    svg.append("rect")
        .attr("x", leftCord)
        .attr("y", topCord - 20)
        .attr("width", 136)
        .attr("height", 25)
        .attr("id", "doo" + graphNum)
        .style("fill", "white")
        .style("opacity", .20)
        .on("mouseover", function(d){
            
            var rect = d3.select(this);

            rect.transition().duration(500)
                .style("fill", "blue");

            var circles = svg.selectAll("#" + countryCode);
            circles.transition().duration(500)
                .attr("r", 10)
                .attr("stroke", "black")
                .style("stroke-width", "3px");

            var colorText = "";
            var tempMedal;

            for(var i=0; i<3; i++){

                colorText = medalsPlaceMap.get(i+1);
                tempMedal = d3.select("#" + colorText + graphNum);

                tempMedal.text("- " + colorText + " " + medalsCountryMap.get(countryCode)[i]).style("font-weight", "bold");
            }

            if(countryCode == "USA"){
                for(var k=0; k<countSubmits; k++){
                    tempMedal = d3.select("#new" + k + "" + graphNum)
                    tempMedal.style("font-weight", "bold");
                }
            }

        })
        .on("mouseout", function(d){
            var rect = d3.select(this)
            rect.transition().duration(500)
                .style("fill", "white");;

            var circles = svg.selectAll("#" + countryCode);
            circles.transition().duration(500)
                .attr("r", 8)
                .attr("stroke", "white")
                .style("stroke-width", "1px");

            for(var i=0; i<3; i++){

                colorText = medalsPlaceMap.get(i+1);
                tempMedal = d3.select("#" + colorText + graphNum);

                tempMedal.text("- " + colorText).style("font-weight", "normal");;
            }

            if(countryCode == "USA"){
                for(var k=0; k<countSubmits; k++){
                    tempMedal = d3.select("#new" + k + "" + graphNum)
                    tempMedal.style("font-weight", "normal");
                }
            }

        });
};

// Function to create all country divs
var createCountryDivs = function (divID, startX, startY, svg, xScale, yScale, graphNum, rectColor){
    
    svg.append("rect")
        .attr("x", startX)
        .attr("y", startY - 20 - 40)
        .attr("width", 136 + 40)
        .attr("height", 25*numberMedalsCountryMap.size + 45)
        .style("fill", rectColor);

    var index = 0;
    countriesOrderedList.forEach(function (countryCode){
        addCountryDiv(divID, svg, countryCodeMap.get(countryCode), countryCode, numberMedalsCountryMap.get(countryCode), startX, (startY + 25*index), xScale, yScale, graphNum);
        index++;
    });

    var width;
    var x;
    var rects = d3.selectAll("#doo" + graphNum);
    var texts = d3.selectAll("#foo" + graphNum);
    for(var i=0; i<numberMedalsCountryMap.size; i++){        
        width = texts[0][i].getBBox().width;
        x = texts[0][i].getBBox().x;
        texts[0][i].setAttribute("x", x + (136-width));
        rects[0][i].setAttribute("width", width);
        rects[0][i].setAttribute("x", x + (136-width));

    }
}

// Function to draw key
var createKey = function (divID, startX, startY, svg, xScale, graphNum){

    var colorText = "";
    var ex = 40;

    for(var i=0; i<3; i++){

        colorText = medalsPlaceMap.get(i+1);

        svg.append("circle")
            .attr("r", 8)
            .attr("cx", CANVAS_PADDING*2.10)
            .attr("cy", CANVAS_PADDING + 25*i + 55 + ex)
            .style("fill", medalsColorMap.get(i+1))
            .style("opacity", .70)
            .attr("stroke", "black")
            .style("stroke-width", "1px");

        svg.append("text")
            .attr("x", CANVAS_PADDING*2.21)
            .attr("y", CANVAS_PADDING + 25*i + 59 + ex)
            .attr("id", "" + colorText + "" + graphNum)
            .text("- " + colorText)
            .style("font-size", "15px")
            .style("opacity", .80);
    }
}

// Function to create random color
var randomColor = function() {
    return "#"+((1<<24)*Math.random()|0).toString(16);
}

// Function to create text explaining what to do
var createExtraText = function(svg){
    var ex = 40;
    svg.append("text")
        .attr("x", 2*CANVAS_PADDING)
            .attr("y", CANVAS_PADDING -11 + ex)
        .style("font-size", "15px")
        .attr("dy", ".75em")
        .text("Hover over country")
        .style("fill", "blue")
        .style("opacity", .80);

    svg.append("text")
        .attr("x", 2*CANVAS_PADDING)
        .attr("y", CANVAS_PADDING + 6 + ex)
        .style("font-size", "15px")
        .attr("dy", ".75em")
        .text("to highlight sprinters ")
        .style("fill", "blue")
        .style("opacity", .80);

    svg.append("text")
        .attr("x", 2*CANVAS_PADDING)
        .attr("y", CANVAS_PADDING + 21 + ex)
        .style("font-size", "15px")
        .attr("dy", ".75em")
        .text("on graph.")
        .style("fill", "blue")
        .style("opacity", .80);
}

// Function to create arrow
var createArrow = function (svg, xScale, yScale, arrowList){
    
    svg.append("svg:defs")
        .append("svg:marker")
        .attr("id", "arrow")    
        .attr("refX", 2)
        .attr("refY", 6)
        .attr("markerWidth", 13)
        .attr("markerHeight", 13)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M2,2 L2,11 L10,6 L2,2");

    svg.append("line")
        .attr("id", "arrowLine")
        .attr("x2", xScale(arrowList[0]) + 25)
        .attr("y2", yScale(arrowList[1]))
        .attr("x1", xScale(4.9))
        .attr("y1", yScale(arrowList[1]))
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("marker-end", "url(#arrow)");

    svg.append("text")
        .attr("x", xScale(4.7))
        .attr("y", yScale(arrowList[1] - 1))
        .text("Meters behind fastest")
        .style("font-weight", "bold");
}

// Fumction to create 2 decimal places. Taken from: http://stackoverflow.com/questions/4187146/display-two-decimal-places-no-rounding
function floorFigure(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};

// Function to add new sprinter
var addCustomSprinter = function (xScale1, yScale1, xScale2, yScale2, count) {
    var sprinter = notable_sprinters.pop(); 

    var tooltip1 = d3.select("body")
        .append("div").attr("class", "tooltip")
        .style("visibility", "hidden");

    var tooltip2 = d3.select("body")
        .append("div").attr("class", "tooltip")
        .style("visibility", "hidden"); 

    var rColor = randomColor();
    var dist1 = (100/9.63 -100/sprinter.time)*9.63;
    var dist2 = (100/10.54 -100/sprinter.time)*10.54;

    var max1 = d3.max(newDists1);
    if (max1 == undefined)
        max1 = 0;

    var f1;
    if(dist1 > max1 && dist1 > 30){
        f1 = dist1 + 5;
    }
    else if(max1 > 30){
        f1 = max1 + 5;
    }
    else{
        f1 = 30;
    }

    var max2 = d3.max(newDists2);
    if (max2 == undefined)
        max2 = 0;

    var f2;
    if(dist2 > max2 && dist2 > 26){
        f2 = dist2 + 5;
    }
    else if(max2 > 26){
        f2 = max2 + 5;
    }
    else{
        f2 = 26;
    }

    var custXScale1 = d3.scale.linear()
        .domain([f1, 0])
        .range([CANVAS_PADDING, CANVAS_WIDTH - 2*CANVAS_PADDING]);

    var custXScale2 = d3.scale.linear()
        .domain([f2, 0])
        .range([CANVAS_PADDING, CANVAS_WIDTH - 2*CANVAS_PADDING]);

    var svg1 = d3.select("#svg0");
    var svg2 = d3.select("#svg1");

    var circs1 = svg1.selectAll(".point")
        .attr("cx", function(value) { 
            return custXScale1(value.meters_behind_fastest);
        });

    var xAxis1 = d3.svg.axis()
        .scale(custXScale1).orient("bottom")
        .tickFormat(d3.format("d"))
        .ticks(5);

    svg1.select(".xaxis")
        .call(xAxis1);

    var myCircs1 = svg1.selectAll(".cust");
    if(dist1 > max1){
        newDists1.forEach(function (d, i){
            var tempV = custXScale1(d);
            myCircs1[0][i].setAttribute("cx", tempV);
        });    
    }

    var circs2 = svg2.selectAll(".point")
        .attr("cx", function(value) { 
            return custXScale2(value.meters_behind_fastest);
        });

    var xAxis2 = d3.svg.axis()
        .scale(custXScale1).orient("bottom")
        .tickFormat(d3.format("d"))
        .ticks(5);

    svg2.select(".xaxis")
        .call(xAxis2);

    var myCircs2 = svg2.selectAll(".cust");
    if(dist2 > max2){
        newDists2.forEach(function (d, i){
            var tempV = custXScale2(d);
            myCircs2[0][i].setAttribute("cx", tempV);
        });    
    }

    svg1.select("#arrowLine")
        .attr("x2", custXScale1(arrowList1[0]) + 25);

    svg2.select("#arrowLine")
        .attr("x2", custXScale2(arrowList2[0]) + 25);

    newDists1.push(dist1);
    newDists2.push(dist2);

    svg1.append("circle")
        .attr("class", "cust")
        .attr("id", "USA")
        .attr("r", 7)
        .attr("cx", custXScale1(dist1))
        .attr("cy", yScale1(2015))
        .style("fill", rColor)
        .style("opacity", .70)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", function(d) {
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 10)
                .attr("stroke", "black")
                .style("stroke-width", "3px");

            tooltip1.transition()
                .duration(120)
                .style("opacity", .85)
                .style("visibility", "visible");
            
            tooltip1.html("<b>" + sprinter.name + "</b> (" + "USA" + ")<br/>" 
                       + "<b>Year:</b> " + "2015" + "<br/>"
                       + "<b>Time:</b> " + sprinter.time + " s<br/>"
                       + "<b>Meters Behind:</b> " + floorFigure(dist1, 1) + " m<br/>")
                .style("left", (d3.event.pageX + 18) + "px")
                .style("top", (d3.event.pageY + 0) + "px");
        })
        .on("mouseout", function(d) {
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 7)
                .attr("stroke", "black")
                .style("stroke-width", "1px");;

          tooltip1.transition()
            .duration(460)
            .style("opacity", 0);
        });

    svg1.append("circle")
        .attr("r", 8)
        .attr("cx", CANVAS_PADDING*2.10)
        .attr("cy", CANVAS_PADDING + 25*(count+3) + 55 + 40)
        .style("fill", rColor)
        .style("opacity", .70)
        .attr("stroke", "black")
        .style("stroke-width", "1px");

    svg1.append("text")
        .attr("x", CANVAS_PADDING*2.21)
        .attr("y", CANVAS_PADDING + 25*(count+3) + 59 + 40)
        .attr("id", "new" + count + "" + 0)
        .text("- " + sprinter.name)
        .style("font-size", "15px")
        .style("opacity", .80);

    svg2.append("circle")
        .attr("id", "USA")
        .attr("class", "cust")
        .attr("r", 7)
        .attr("cx", custXScale2(dist2))
        .attr("cy", yScale2(2015))
        .style("fill", rColor)
        .style("opacity", .70)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", function(d) {
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 10)
                .attr("stroke", "black")
                .style("stroke-width", "3px");

            tooltip2.transition()
                .duration(120)
                .style("opacity", .85)
                .style("visibility", "visible");
            
            tooltip2.html("<b>" + sprinter.name + "</b> (" + "USA" + ")<br/>" 
                       + "<b>Year:</b> " + "2015" + "<br/>"
                       + "<b>Time:</b> " + sprinter.time + " s<br/>"
                       + "<b>Meters Behind:</b> " + floorFigure(dist2, 1) + " m<br/>")
                .style("left", (d3.event.pageX + 18) + "px")
                .style("top", (d3.event.pageY + 0) + "px");
        })
        .on("mouseout", function(d) {
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 7)
                .attr("stroke", "black")
                .style("stroke-width", "1px");;

          tooltip2.transition()
            .duration(460)
            .style("opacity", 0);
        });

    svg2.append("circle")
        .attr("r", 8)
        .attr("cx", CANVAS_PADDING*2.10)
        .attr("cy", CANVAS_PADDING + 25*(count+3) + 55 + 40)
        .style("fill", rColor)
        .style("opacity", .70)
        .attr("stroke", "black")
        .style("stroke-width", "1px");

    svg2.append("text")
        .attr("x", CANVAS_PADDING*2.21)
        .attr("y", CANVAS_PADDING + 25*(count+3) + 59 + 40)
        .attr("id", "new" + count + "" + 1)
        .text("- " + sprinter.name)
        .style("font-size", "15px")
        .style("opacity", .80);

    notable_sprinters.push(sprinter);

}