console.log('8.0');

var m = {t:100,r:100,b:100,l:100};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Step 2: define axis for x, y, and color
//Scale
var scaleX = d3.scaleTime()
    .domain([new Date(1963,11,31), new Date(2013,11,31)])
    .range([0,w]);
var scaleColor = d3.scaleOrdinal()
    .domain(['Coffee, green', 'Tea'])
    .range(['red','#03afeb']);
var scaleY = d3.scaleLinear()
    .domain([0,11000000])
    .range([h,0]);

//Step 3: define axis functions
//Axis
var axisX = d3.axisBottom()
    ;
var axisY = d3.axisLeft()
    ;

d3.queue()
    //Step 1: import data
    //.defer()
    .await(function(err, coffee, tea){

        //Step 5: draw axis

        //Step 6: implement function to draw
    });

function draw(rows){

}

function parse(d){
    return {
        item: d.ItemName,
        itemCode: d.ItemCode,
        //Step 1.1: how do we parse the year?
        value: +d.Value
    }
}