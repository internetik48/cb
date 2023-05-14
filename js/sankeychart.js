function sankeychart(html_element_id, color_array, w, h, mr, ml, csv_file_path, isright) {

    var units = "همت";

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: mr, bottom: 30, left: ml },
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.1f"),    // zero decimal places
        format = function (d) { return formatNumber(d) + " " + units; },
        color = d3.scaleOrdinal(color_array);

    // append the svg object to the body of the page
    var svg = d3.select(html_element_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    // load the data
    d3.csv(csv_file_path, function (error, data) {

        //set up graph in same style as original example but empty
        graph = { "nodes": [], "links": [] };

        data.forEach(function (d) {
            graph.nodes.push({ "name": d.source });
            graph.nodes.push({ "name": d.target });
            graph.links.push({
                "source": d.source,
                "target": d.target,
                "value": +d.value
            });
        });

        // return only the distinct / unique nodes
        graph.nodes = d3.keys(d3.nest()
            .key(function (d) { return d.name; })
            .object(graph.nodes));

        // loop through each link replacing the text with its index from node
        graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });

        // now loop through each nodes to make nodes an array of objects
        // rather than an array of strings
        graph.nodes.forEach(function (d, i) {
            graph.nodes[i] = { "name": d };
        });

        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; });

        // add the link titles
        link.append("title")
            .text(function (d) {
                return d.target.name + " ← " +
                    d.source.name + "\n" + format(d.value);
            });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.drag()
                .subject(function (d) {
                    return d;
                })
                .on("start", function () {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        // colors = d3.schemeTableau10, // array of colors


        // var color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
        // if (G && nodeGroups === undefined) nodeGroups = G;
        // if (G) node.attr("fill", ({index: i}) => colors[i]);

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", sankey.nodeWidth() * 2)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", function (d) {
                return d.color = color(d.x + 4);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            });



        if (isright == 0) {
            // add in the title for the nodes
            node.append("text")
                .attr("x", 20)
                .attr("y", function (d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("transform", null)
                .text(function (d) { return (d.name); })
                .filter(function (d) { return d.x < width / 2; })
                .attr("x",  sankey.nodeWidth())
                .attr("text-anchor", "middle");
        }
        else {
            // add in the title for the nodes
            node.append("text")
                .attr("x", -20)
                .attr("y", function (d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function (d) { return (d.name); })
                .filter(function (d) { return d.x < width / 2; })
                .attr("x", sankey.nodeWidth())
                .attr("text-anchor", "middle");
        }


        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + d.x + ","
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                    ) + ")");
            sankey.relayout();
            link.attr("d", path);
        }
    });
}

sankeychart("div#sankey-src", ["#4ac4f3", "#92dbf7", "#3b9cc2"], 600, 500, 150, 30, "./files/sankey_res.csv",1)
sankeychart("div#sankey-ex", ["#ff968f", "#FF695F", "#e55e55"], 600, 500, 50, 150, "./files/sankey_exp.csv",0)