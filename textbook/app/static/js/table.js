var POINTS = [];

$(function(){
    fixVerticalTabindex('#TimeDistance', 2);
    updateTableStatus();
    handleChange();
    handleClear();
    createGraph();
    handleDrawLine();
});

/*
    Updates the table visual status based on the points input into it
*/
function updateTableStatus(){
    xRow = $('.x-row td');
    yRow = $('.y-row td');
    clearRow = $('.clear-row td');

    previousPoints = POINTS.slice();
    POINTS = [];   

    disableNext = false;
    for (let i = 0; i < xRow.length; i++) {
        var tdX = $(xRow[i]);
        var tdY = $(yRow[i]);
        var tdClear = $(clearRow[i]);

        if(disableNext){
            // Disable point
            toggleColumn(tdX, tdY, tdClear, false);
        } else {
            // Enable point
            toggleColumn(tdX, tdY, tdClear, true);
            // Check if the next point needs to be disabled
            var point = {x: parseInt($('input', tdX).val()), y: parseInt($('input', tdY).val())};
            if (!(!isNaN(point.x) && !isNaN(point.y))) {
                /* 
                If either point is not present, or if one of the points is not numeric,
                set flag to disable next columns
                */
                disableNext = true;
                if(i == 0){
                    toggleGraph(false);
                }
            } else {
                // point is present. Add it to array
                POINTS.push([point.x, point.y]);
                if(i == 0){
                    toggleGraph(true);
                }
            }
        }
    }
    if (!arraysEqual(previousPoints, POINTS)){
        tableUpdated();
    }
}

function tableUpdated(){
    createGraph();
}

// From https://stackoverflow.com/questions/4025893/how-to-check-identical-array-in-most-efficient-way
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if((arr1[i][0] !== arr2[i][0]) || (arr1[i][1] !== arr2[i][1])) // This only works for arrays of length == 2
            return false;
    }
    return true;
}

function toggleGraph(graphVisible){
    var message = $('#message-container');
    var graph = $('#graph-container');
    if(graph.is(':visible') != graphVisible){ // Check if state needs to change
        var first = graphVisible ? message : graph;
        var second = graphVisible ? graph: message;
        first.fadeToggle(false, function(){
            second.fadeToggle(true);
        });
    }
}


function toggleColumn(tdX, tdY, tdClear, enabled){
    tdX.toggleClass('disabled', !enabled);
    tdY.toggleClass('disabled', !enabled);
    tdClear.toggleClass('disabled', !enabled);
    $('input', tdX).prop('disabled', !enabled);
    $('input', tdY).prop('disabled', !enabled);
}

function handleChange(){
    $("#TimeDistance input").keyup(function (e) {
        updateTableStatus();
    });
}

function fixVerticalTabindex(selector, nRows) {
    $(selector).each(function(i, tbl) {
        // For each row
        var row_i = 0;
        $('tr', tbl).each(function(j, row){
            var inputs = $('input', row);
            if(inputs.length > 0){ // Check if there are inputs in this row
                // For each input
                input_i = 0;
                inputs.each(function(k, input){
                    $(input).attr('tabindex', row_i + input_i + 1);
                    input_i += nRows;
                });
                row_i++;
            }
        });      
    });
}

function handleClear(){
    $('a.clear').click(function(){
        td_index = $(this).closest('td').index() - 1;
        table = $(this).closest('table');
        // Clear all points at this index
        var inputX = $($('.x-row input')[td_index]);
        var inputY = $($('.y-row input')[td_index]);
        inputX.val('');
        inputY.val('');
        // TODO cascade values from items ahead of this one back one position
        // Update table status
        updateTableStatus();
    });
}

function handleDrawLine(){
    $('#plot_table').click(drawLine);
}

function createGraph(){

    var margin = {top: 20, right: 15, bottom: 20, left: 15}
    , width = 450 - margin.left - margin.right
    , height = 340 - margin.top - margin.bottom;
  
    var x = d3.scaleLinear()
                .domain([0, d3.max(POINTS, function(d) { return d[0]; })])
                .range([ 0, width ]);
    
    var y = d3.scaleLinear()
                .domain([0, d3.max(POINTS, function(d) { return d[1]; })])
                .range([ height, 0 ]);

    d3.select('svg').remove(); // Ideally we should just update the data and animate
            
    var chart = d3.select('#graph')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.axisBottom(x);

    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

    // draw the y axis
    var yAxis = d3.axisLeft(y);

    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

    var g = main.append("svg:g"); 

    // Draw lines
    var line = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); });
    for (let i = 0; i < POINTS.length-1; i++) {
        var point1 = POINTS[i];
        var point2 = POINTS[i+1];
        g.append('path')
            .attr('class', 'graph-line')
            .datum([point1,point2])
            .attr('d', line);
    }

    // Draw points
    g.selectAll("scatter-dots")
        .data(POINTS)
        .enter().append("svg:circle")
            .attr("cx", function (d,i) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 8);
}

function drawLine(){
    // Show lines
    $('.graph-line').css('visibility', 'visible');
}
