console.log('8.1');

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

//Axis
var axisX = d3.axisBottom()
    .scale(scaleX)
    .tickSize(-h);
var axisY = d3.axisLeft()
    .scale(scaleY)
    .tickSize(-w);

//Line generator
var lineGenerator = d3.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.value)})

d3.queue()
    .defer(d3.csv, '../data/fao_coffee_world_1963_2013.csv',parse)
    .defer(d3.csv, '../data/fao_tea_world_1963_2013.csv',parse)
    .await(function(err, coffee, tea){

        //Draw axes
        plot.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisX);
        plot.append('g').attr('class','axis axis-y')
            .call(axisY);

        draw(coffee);
    });

function draw(rows){
    //UPDATE
    var node = plot.selectAll('.node')
        .data(rows,function(d){return d.year});
    //ENTER
    var nodeEnter = node.enter()
        .append('circle')
        .attr('class','node')
        .on('click',function(d,i){
            console.log(d);
            console.log(i);
            console.log(this);
        })
        .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip.select('.title')
                .html(d.item + ', ' + d.year.getFullYear())
            tooltip.select('.value')
                .html(d.value);

            tooltip.transition().style('opacity',1);

            d3.select(this).style('stroke-width','3px');
        })
        .on('mousemove',function(d){
            var tooltip = d3.select('.custom-tooltip');
            var xy = d3.mouse( d3.select('.container').node() );
            tooltip
                .style('left',xy[0]+10+'px')
                .style('top',xy[1]+10+'px');
        })
        .on('mouseleave',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip.transition().style('opacity',0);

            d3.select(this).style('stroke-width','0px');
        });
    //UPDATE + ENTER
    nodeEnter
        .merge(node)
        .attr('r',3)
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)})
        .style('fill',function(d){return scaleColor(d.item)});
    //EXIT
    node.exit().remove();


    //Draw path
    plot.insert('path','.node')
        .datum(rows)
        .attr('d',function(datum){
            return lineGenerator(datum);
        })
        .style('fill','none')
        .style('stroke-width','2px')
        .style('stroke',function(datum){
            return scaleColor(datum[0].item);
        });
}

function parse(d){
    return {
        item: d.ItemName,
        itemCode: d.ItemCode,
        year: new Date(+d.Year,11,31),
        value: +d.Value
    }
}