var canvas = null;
var ctx = null;
const update_interval = 1000;
const max_lines = 64;
const min_color = 10;
const max_color = 246;
var timeout = null;

var init = function()
{
    canvas = document.getElementById("visualizer");
    ctx = canvas.getContext("2d");
    render();
}

var render = function()
{
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var height = ctx.canvas.height;
    var width = ctx.canvas.width;
    ctx.clearRect(0, 0, width, height);

    var count = Math.random() * max_lines;
    for(var i = 0; i < count; ++i)
    {
        var color_value = Math.trunc((Math.random() * (max_color - min_color)) + min_color);
        ctx.strokeStyle = 'rgba(' +
            color_value +
            ',' +
            color_value +
            ',' +
            color_value +
            ',1.0)';
        var start_x = Math.random() * width;
        var start_y = Math.random() * height;
        var end_x = Math.random() * width;
        var end_y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(end_x, end_y);
        ctx.stroke();
    }
    
    timeout = setTimeout(render, update_interval);
}

window.onload = init;
