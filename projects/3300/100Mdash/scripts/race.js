var countSubmits = 0;

//produces an svg simulation of a 100 meter dash
//takes a div selection and array of runner objects as parameters
var loadRace = function(canvas, chosen) {
    
    var width = 1200,
        height = 300,
        offset = 20,
        img_dim = 40;
    
    var svg = canvas.append("svg")
        .attr("width", width + 4*offset)
        .attr("height", height);
    
    //title
    svg.append("text")
        .text("100 Meter Simulator")
        .attr("x", width/2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("class", "graph_title")
        .style("font-weight", "bold")
        .style("font-size", "36px");
    svg.append("text")
        .text('Press the "Enter" key to watch the race, hover over names/figures,')
        .attr("x", width/2)
        .attr("y", 55)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");
     svg.append("text")
        .text('or use the slider to see different moments in the race!')
        .attr("x", width/2)
        .attr("y", 72)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");
    
    //list of runners in simulation
    svg.append("group").attr("id", "list");
    var txt_y = 50;
    svg.selectAll("#list text")
        .data(chosen)
        .enter().append("text")
        .text(function(d) { return d.name; })
        .attr("id", function(d) { return "txt" + d.r_id; })
        .attr("x", 200)
        .attr("y", function(d) { txt_y += 20; return txt_y; })
        .attr("text-anchor", "end")
        .style("font-size", "18px")
        .style("text-decoration", "underline");
    
    //highlight rectangles
    txt_y = 35;
    svg.selectAll("#list rect")
        .data(chosen)
        .enter().append("rect")
        .attr("id", function(d) { return "box" + d.r_id; })
        .attr("x", 0)
        .attr("y", function(d) { txt_y += 20; return txt_y; })
        .attr("width", 200)
        .attr("height", 20)
        .style("fill", "white")
        .style("opacity", .20)
        .on("mouseover", function(d) { 
                svg.select("#box"+d.r_id).transition().duration(200).style("fill", "blue"); 
                svg.select("g#hov" + d.r_id).style("display", ""); 
                var r_id = d.r_id;
                svg.selectAll("image").style("opacity", function(d) { 
                        if (d.r_id != r_id && d.time != best_time) { return 0.3; } 
                }) 
        })
        .on("mouseout", function(d) { 
            svg.select("#box"+d.r_id).transition().duration(200).style("fill", "white"); 
            svg.select("g#hov" + d.r_id).style("display", "none");
            svg.selectAll("image").style("opacity", 1);
        });
    
    for(var i=0; i<5; i++){        
        var rect = d3.select("#box" + chosen[i].r_id);
        var text = d3.select("#txt" + chosen[i].r_id);
        var w = text[0][0].getBBox().width;
        var x = rect[0][0].getBBox().x;
        rect[0][0].setAttribute("width", w);
        rect[0][0].setAttribute("x", x + (200-w));
    }
    
    var best_time = d3.min(chosen, function(d){ return d.time; });

    var xScale = d3.scale.linear().domain([0,100]).range([20,1200])
    //plot line
    svg.append("line")
        .attr("x1", offset)
        .attr("y1", 200.5)
        .attr("x2", width + offset)
        .attr("y2", 200.5)
        .attr("stroke", "black");
    svg.append("text")
        .text("100m")
        .attr("x", width + offset)
        .attr("y", 240)
        .attr("class", "label")
        .attr("text-anchor", "middle");
    svg.append("text")
        .text("0m")
        .attr("x", 20)
        .attr("y", 240)
        .attr("class", "label")
        .attr("text-anchor", "middle");
    //the chosen runners appended as silhouette images
    svg.selectAll("chosen")
        .data(chosen)
        .enter().append("image")
        .attr("x", 30)
        .attr("y", 200-img_dim)
        .attr("width", img_dim)
        .attr("height", img_dim)
        .attr("xlink:href", "http://i874.photobucket.com/albums/ab308/shotklok13/runner.png")
        .on("mouseover", function(d) { svg.select("g#hov" + d.r_id).style("display", "");
                                      var r_id = d.r_id;
                                      svg.selectAll("image").style("opacity", function(d) { 
                                                                if (d.r_id != r_id && d.time != best_time) { return 0.3; } 
                                        });
                                     })
        .on("mouseout", function(d) { svg.select("g#hov" + d.r_id).style("display", "none");
                                      svg.selectAll("image").style("opacity", 1); })
        //animating the race and appending hover labels
        .transition()
        .ease("linear")
        .duration(best_time*200)
        .attr("x", function(d) { return xScale((best_time/d.time)*100) + offset - img_dim/2; })
        .each("end",
            function(d) {
                var x_pos = xScale((best_time/d.time)*100) + offset;
                var hovs = svg.append("svg:g").attr("id", "hov" + d.r_id).style("display", "none");
                hovs.append("text")
                    .text(d.name + ' (' + d.competition_year + ') - ' + d.time + 's')
                    .attr("y", 100)
                    .attr("x", x_pos)
                    .attr("text-anchor", "middle")
                    .attr("class", "label");
                hovs.append("line")
                    .attr("x1", x_pos)
                    .attr("y1", 105)
                    .attr("x2", x_pos)
                    .attr("y2", 225)
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1)
                    .style("opacity", 0.70)
                    .attr("class", "long_up");
                hovs.append("line")
                    .attr("x1", x_pos)
                    .attr("y1", 225)
                    .attr("x2", width + offset)
                    .attr("y2", 225)
                    .attr("stroke", "blue")
                    .style("opacity", 0.70)
                    .attr("class", "dist_line");
                hovs.append("line")
                    .attr("x1", width + offset + 0.5)
                    .attr("y1", 206)
                    .attr("x2", width + offset + 0.5)
                    .attr("y2", 225)
                    .attr("stroke", "blue")
                    .style("opacity", 0.70)
                    .attr("class", "short_down");
                hovs.append("text")
                    .text((100-Math.round((100/d.time)*best_time * 100) / 100).toFixed(2) + ' m')
                    .attr("y", 222)
                    .attr("x", ((x_pos + width + offset) / 2))
                    .attr("text-anchor", "middle")
                    .attr("class", "distance");
            }
        );
    


    //slider
    var val_display = svg.append("text")
            .attr("x", width/2)
            .attr("y", 275)
            .text(best_time+"s");
    d3.select("#canvas").append("input")
        .attr("type", "range")
        .attr("id", "fullwidthrange")
        .attr("value", 0)
        .attr("max", 1)
        .attr("min", .01)
        .attr("step", 0.01)
        .style("margin-left", offset +"px")
        .on("input", function() {
            var slide_value = document.getElementById("fullwidthrange").value;
            d3.selectAll("image")
                .data(chosen)
                .attr("x", function(d) { //adjusting x for image on slide input
                    //adjusting x for labels and lines as well
                    x_pos = xScale((best_time/d.time)*100) + offset;
                    d3.select("g#hov" + d.r_id).select(".label")
                        .attr("x", x_pos*slide_value);
                    d3.select("g#hov" + d.r_id).select(".distance")
                        .attr("x", ((x_pos+width+offset)/2)*slide_value)
                        .text((100*slide_value - ((100/d.time)*best_time*slide_value)).toFixed(2) + ' m');
                    d3.select("g#hov" + d.r_id).select(".short_down")
                        .attr("x1", (xScale(100) + offset)*slide_value)
                        .attr("x2", (xScale(100) + offset)*slide_value);
                    d3.select("g#hov" + d.r_id).select(".dist_line")
                        .attr("x1", x_pos*slide_value)
                        .attr("x2", xScale(100*slide_value) + offset - img_dim/2);
                    d3.select("g#hov" + d.r_id).select(".long_up")
                        .attr("x1", x_pos*slide_value)
                        .attr("x2", x_pos*slide_value);
                    
                    return slide_value*x_pos - img_dim/2; 
                })
            val_display.text((slide_value*best_time).toFixed(2) + "s");
        })
        .transition()
        .duration(best_time*200)
        .tween("value", function() {
            var i = d3.interpolate(this.value, this.max);
            return function(t) { this.value = i(t); };
        });
    

    //dropdowns for selecting runners
    var select_div = canvas.append("div").attr("id", "select_div").style("margin-left", offset*2+"px");
    for (var i=0; i<5; i++) {
        var selector  = select_div.append("select").attr("style", "width: 19%").style("margin", "3px"),
            options = selector.selectAll('option').data(notable_sprinters).attr("style", "width: 19%");

        // Enter selection
        options.enter().append("option")
            .attr("id", function(d) { return d.r_id; })
            .text(function(d) { return d.r_id+" - "+d.name+" ("+d.competition_year+") - "+d.time+"s"; })
            .attr("selected", function(d) { 
                        if (d == chosen[i]) { return "selected"; }
            });
    }
    
    
    var inputs_valid = function() { 
        if (document.getElementById("custom_name").value.length == 0 || document.getElementById("custom_time").value.length == 0){
            d3.select("#submit").attr("disabled", true);
        } else {
            d3.select("#submit").attr("disabled", null);
        }
    };
    //inputs for adding user time
    var adder = canvas.append("div").attr("id", "add_runner").style("text-align", "center");
    adder.html("<br> Add yourself: ").style("font-family", "Montserrat").style("font-size", "20px").style("font-weight", "bold");
    adder.append("input")
        .attr("type", "text")
        .attr("class", "inputs")
        .attr("id", "custom_name")
        .attr("placeholder", "Your name here")
        .style("margin", "auto")
        .on("input", function() { inputs_valid(); });
    adder.append("input")
        .attr("type", "number")
        .attr("class", "inputs2")
        .attr("id", "custom_time")
        .attr("placeholder", "Your time here")
        .on("keyup", function() { inputs_valid(); })
        .attr("min", 10)
        .attr("max", 23)
        .attr("step", 0.1);
    adder.append("button")
        .text("Submit time")
        .attr("id", "submit")
        .attr("disabled", true)
        .on("click", function() {
            var date = new Date();
            var new_name = document.getElementById("custom_name").value.replace(/(<([^>]+)>)/ig,"");
            var new_time = document.getElementById("custom_time").value;
            if (new_time < 10) { new_time = 10; } else if (new_time > 23) { new_time = 23; }
            notable_sprinters.push({"r_id":notable_sprinters.length,"name":new_name,"competition_year":date.getFullYear(),"time":new_time, "country_code": "USA"});
            chosen[4] = notable_sprinters[notable_sprinters.length-1];
            //clearing current race and adding custom runner to new race
            canvas.selectAll("*").remove();
            addCustomSprinter(xScale1, yScale1, xScale2, yScale2, countSubmits);
            countSubmits++;
            loadRace(canvas, chosen);
        })
        .on("keyup", function(event) {
            if(event.keyCode == 13){
                $("#submit").click();
            }
        });
    
    //receiving selection input
    var sels = d3.selectAll("select")[0];
    d3.selectAll("select").on("input", function() {
        var ind = 0;
        var new_run = [];
        var rnr;
        sels.forEach(function() { 
            rnr = sels[ind].value;
            rnr = rnr.substr(0, rnr.indexOf(" "));
            rnr = notable_sprinters[parseInt(rnr)];
            new_run.push(rnr); 
            ind++; 
        });
        //clearing current race and replacing with new race
        canvas.selectAll("*").remove();
        loadRace(canvas, new_run);
    });
    
    $(document).keyup(function(event){
        if(event.keyCode == 13){
            if (!d3.select("#submit").attr("disabled")) {
                $("#submit").click();
            } else {
                canvas.selectAll("*").remove();
                loadRace(canvas, chosen);
            }
        }
    });

}

//canvas
var my_canvas = d3.select("#canvas");

var choose = [];
//creating array of runners to be used in initial simulation on page load, random 4 + Usain Bolt
var rand_ind;
choose.push(notable_sprinters[0]);
while (choose.length < 5) { 
    rand_ind = Math.abs(Math.floor(Math.random()*notable_sprinters.length));
    if (choose.indexOf(notable_sprinters[rand_ind]) < 0) {
        choose.push(notable_sprinters[rand_ind]);
    }
}

//produces race simulation on page load
loadRace(my_canvas, choose);