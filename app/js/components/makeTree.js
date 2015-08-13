var d3 = require('d3');

var exports = {};

  // D3 code that actually makes the tree
  exports.makeTree = function(data, svgDomNode, clickCallBack) {
    var treeData = data[0];
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    var nodeCircleRadius = 15; // 4.5 was original size

    // size of the diagram
    var viewerWidth = $(document).width() - 350;
    var viewerHeight = $(document).height() - 200;

    var tree = d3.layout.tree()
        .size([viewerWidth, viewerHeight]);



    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // define a d3 line projection for use by paths
    var line = d3.svg.line()
        // .interpolate('basis')
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.title.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });


    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function(a, b) {
            // return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            return b.id < a.id ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select(svgDomNode)/*.append("svg")*/
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        var scale = zoomListener.scale();
        var x = -source.y0;
        var y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        var offset = viewerWidth / 4;  // Jim added
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")"); // added offset
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        // d = toggleChildren(d);
        // update(d);
        centerNode(d);
        clickCallBack(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        // var levelWidth = [1];
        // var childCount = function(level, n) {

        //     if (n.children && n.children.length > 0) {
        //         if (levelWidth.length <= level + 1) levelWidth.push(0);

        //         levelWidth[level + 1] += n.children.length;
        //         n.children.forEach(function(d) {
        //             childCount(level + 1, d);
        //         });
        //     }
        // };
        // childCount(0, root);
        // var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        // tree = tree.size([newHeight, viewerWidth]);
        tree = tree.nodeSize([50, 50]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        var node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            // .call(dragListener)  // Jim removed as we are not dragging nodes
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return "title: " + d.title + ", id: " + d.id;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        // nodeEnter.append("circle")
        //     .attr('class', 'ghostCircle')
        //     .attr("r", 30)
        //     .attr("opacity", 0.2) // change this to zero to hide the target area
        // .style("fill", "red")
        //     .attr('pointer-events', 'mouseover')
        //     .on("mouseover", function(node) {
        //         overCircle(node);
        //     })
        //     .on("mouseout", function(node) {
        //         outCircle(node);
        //     });

        // Update the text to reflect whether node has children or not.
        // node.select('text')
        //     .attr("x", function(d) {
        //         return d.children || d._children ? -10 : 10;
        //     })
        //     .attr("text-anchor", function(d) {
        //         return d.children || d._children ? "end" : "start";
        //     })
        //     .text(function(d) {
        //         return d.name;
        //     });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", nodeCircleRadius) // was 4.5
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            // .duration(duration)
            .attr("class", "link")
            // ORIGINAL
            // .attr("d", function(d) {
            //     var o = {
            //         x: source.x0,
            //         y: source.y0
            //     };
            //     return diagonal({
            //         source: o,
            //         target: o
            //     });
            // });
            .attr("d", function(d) {
                return line([
                    {
                        y: source.x0,
                        x: source.y0
                    },
                    {
                        y: source.x0,
                        x: source.y0
                    },
                    {
                        y: source.x,
                        x: source.y
                    },
                    {
                        y: source.x,
                        x: source.y
                    }
                ]);
            });



            // .attr("d", function(d) {
            //     return line([
            //         {
            //             y: d.source.x,
            //             x: d.source.y
            //         },
            //         // {
            //         //     y: d.target.x,
            //         //     x: d.target.y - 50
            //         // },
            //         {
            //             y: d.source.x,
            //             x: d.source.y
            //         }
            //     ]);
            // });


        // Transition links to their new position.
        link.transition()
            .duration(duration)
            // ORIGINAL
            // .attr("d", diagonal);
            .attr("d", function(d) {
                return line([
                    {
                        y: d.source.x,
                        x: d.source.y
                    },
                    {
                        y: d.source.x,
                        x: d.source.y + 50
                    },
                    {
                        y: d.target.x,
                        x: d.target.y - 50
                    },
                    {
                        y: d.target.x,
                        x: d.target.y
                    }
                ]);
            });
            // .attr("d", function(d) {
            //     console.log('link.transition');
            //     var o = {
            //         x: source.x,
            //         y: source.y
            //     };
            //     return line([
            //             {
            //                 y: source.x0,
            //                 x: source.y0
            //             },
            //             {
            //                 y: d.target.x,
            //                 x: d.target.y - 50
            //             },
            //             {
            //                 y: d.target.x,
            //                 x: d.target.y
            //             }
            //         ]);
            // });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            // ORIGINAL
            // .attr("d", function(d) {
            //     var o = {
            //         x: source.x,
            //         y: source.y
            //     };
            //     return diagonal({
            //         source: o,
            //         target: o
            //     });
            // })
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return line([
                    {
                        y: source.x0,
                        x: source.y0
                    },
                    {
                        y: source.x0,
                        x: source.y0
                    },
                    {
                        y: source.x,
                        x: source.y
                    },
                    {
                        y: source.x,
                        x: source.y + 50
                    }
                ]);
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    // toggleChildren(root);   // sets tree to be initially fully collapsed, remove for opposite behaviour
    update(root);
    centerNode(root);
    // toggleChildren(root);   // open root's children
    update(root);
  }

module.exports = exports;
