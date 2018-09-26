// d3Linear.js

import d3 from '../api/d3.v3.min.js';
import { EventEmitter } from 'events';

var ANIMATION_DURATION = 600;
var TOOLTIP_WIDTH = 150;
var TOOLTIP_HEIGHT = 150;
var TOOLTIP_WIDTH = 120;
var TOOLTIP_HEIGHT = 120;

var d3Linear = {};

d3Linear.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  svg.append('g').attr('class', 'd3-dummy-nodes');
  svg.append('g').attr('class', 'd3-nodes');
  svg.append('g').attr('class', 'd3-history-nodes');
  svg.append('g').attr('class', 'd3-tooltips');

  svg.append('g').attr('class', 'd3-dummy-hists');

  var dispatcher = new EventEmitter();
  this.update(el, state, dispatcher);

  return dispatcher;
};

d3Linear.update = function(el, state, dispatcher) {
  // Re-compute the scales, and render the data points
  var scales = this._scales(el, state.domain);
  var prevScales = this._scales(el, state.prevDomain);

  this._drawDummyNodes(el, scales, state.dummyData, prevScales, dispatcher);
  this._drawHistory(el, scales, state.history, state.histShiftCounter, prevScales, dispatcher);
  this._drawNodes(el, scales, state.data, prevScales, dispatcher);

  this._drawTooltips(el, scales, state.data, prevScales);
  this._drawDummyHistory(el, scales, state.dummyDataHist, prevScales, dispatcher);
};

d3Linear._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  // var width = el.offsetWidth *0.6;
  // var width = 1200;
  var width = 900;
  var height = el.offsetHeight -20;

  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    // .range([height, 0])
    .range([height, 100])
    .domain(domain.y);

  var z = d3.scale.linear()
    // .range([5, 20])
    // .domain([1, 10]);
    .range([10, 100])
    .domain([10, 70]);

  return {x: x, y: y, z: z};
};

d3Linear._drawNodes = function(el, scales, data, prevScales, dispatcher) {
  var g = d3.select(el).selectAll('.d3-nodes');

  g.append("g").attr("id", "d3-node");


  var node = g.select("#d3-node").selectAll('.d3-node')
    .data(data, function(d) { return d.id; });

  var image = g.selectAll('.image')
    .data(data, function(d) { return d.id; });

  // to display image as pattern
  image.enter().append('pattern')
    .attr('id', function(d) { return d.id })
    .attr("height", "1")
    .attr("width", "1")
    .attr("viewBox", "0 0 100 100")
    .attr("preserveAspectRatio", "none")
    .append('image')
      .attr('x', '0')
      .attr('y', '0')
      .attr("height", "100")
      .attr("width", "100")
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", function(d) { return d.image });

  // ENTER
  node.enter().append('circle')
      .attr('class', 'd3-node')
      .attr('cx', function(d) {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
      .attr('cy', function(d) {
        if (prevScales) {
          return prevScales.y(d.y);
        }
        return scales.y(d.y);
      })
      .attr('r', function(d) {
        if (prevScales) {
          return prevScales.z(d.z);
        }
        return scales.z(d.z);
      })
      .style('fill', function(d) {
        if (d.image) {
          return ("url(#" + d.id + ")");
        }
      })
      .style('stroke', function(d) {
        if (d.focused==true) {
          return "yellow";
        }
        // else if (d.saved==true) {
        //   return "red";
        // }
        else {
          return "#323639";
        }
      });

  // ENTER & UPDATE
  node.on('click', function(d) {
        dispatcher.emit('point:nodeClick', d);
        var sel = d3.select(this);
        sel.moveToFront();
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) {
        if (prevScales) {
          // return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
      .attr('cy', function(d) { return scales.y(d.y); })
      .attr('r',  function(d) { return scales.z(d.z); })
      .style('stroke', function(d) {
        if (d.focused==true) {
          return "yellow";
        }
        // else if (d.saved==true) {
        //   return "red";
        // }
        else {
          return "#323639";
        }
      });

  // EXIT
  if (prevScales) {
    node.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) { return scales.x(d.x); })
        .attr('cy', function(d) { return scales.y(d.y); })
        .attr('r', function(d) { return scales.z(d.z); })
        .remove();
  }
  else {
    node.exit()
        .remove();
  }
};

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};

d3Linear._drawDummyNodes = function(el, scales, dummyData, prevScales, dispatcher) {
  var g = d3.select(el).selectAll('.d3-dummy-nodes');

  // g.append("g").attr("id", "d3-dummy-arrow");
  g.append("g").attr("id", "d3-dummy-node");

  var dummyNode = g.select("#d3-dummy-node")
    .selectAll('.d3-dummy-node')
    .data(dummyData, function(d) { return d.id; });

  var image = g.selectAll('.image')
    .data(dummyData, function(d) { return d.id; });

  image.enter().append('pattern')
    .attr('id', function(d) { return d.id })
    .attr("height", "1")
    .attr("width", "1")
    .attr("viewBox", "0 0 100 100")
    .attr("preserveAspectRatio", "none")
    .append('image')
      .attr('x', '0')
      .attr('y', '0')
      .attr("height", "100")
      .attr("width", "100")
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", function(d) { return d.image });

  // enter node
  dummyNode.enter().append('circle')
    .attr('class', 'd3-dummy-node')
    .attr('cx', function(d) {
      if (prevScales) {
        return prevScales.x(d.x);
      }
      return scales.x(d.x);
    })
    .attr('cy', function(d) {
      if (prevScales) {
        return prevScales.y(d.y);
      }
      return scales.y(d.y);
    })
    .attr('r', function(d) { return d.z; })
    .style('fill', function(d) {
      if (d.image) {
        return ("url(#" + d.id + ")");
      }
    })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); })
      .attr('cy', function(d) { return scales.y(d.y); });

  dummyNode.on('click', function(d) {
        dispatcher.emit('point:dummyNodeClick', d);
      });

  dummyNode.exit().remove();
  // dummyArrow.exit().remove();

}

d3Linear._drawDummyHistory = function(el, scales, dummyDataHist, prevScales, dispatcher) {
  var g = d3.select(el).selectAll('.d3-dummy-hists');

  // g.append("g").attr("id", "d3-dummy-arrow");
  g.append("g").attr("id", "d3-dummy-hist");

  var dummyHist = g.select("#d3-dummy-hist")
    .selectAll('.d3-dummy-hist')
    .data(dummyDataHist, function(d) { return d.id; });

  var image = g.selectAll('.image')
    .data(dummyDataHist, function(d) { return d.id; });

  image.enter().append('pattern')
    .attr('id', function(d) { return d.id })
    .attr("height", "1")
    .attr("width", "1")
    .attr("viewBox", "0 0 100 100")
    .attr("preserveAspectRatio", "none")
    .append('image')
      .attr('x', '0')
      .attr('y', '0')
      .attr("height", "100")
      .attr("width", "100")
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", function(d) { return d.image });

  // enter node
  dummyHist.enter().append('circle')
    .attr('class', 'd3-dummy-node')
    .attr('cx', function(d){
      if (d.id=="left") {
        return "860";
      }
      return "880";
    })
    .attr('cy', "55")
    .attr('r', "10")
    .style('fill', function(d) {
      if (d.image) {
        return ("url(#" + d.id + ")");
      }
    });

  dummyHist.on('click', function(d) {
        dispatcher.emit('point:dummyHistClick', d);
      });

  dummyHist.exit().remove();
  // dummyArrow.exit().remove();

}

d3Linear._drawHistory = function(el, scales, history, cnt, prevScales, dispatcher) {
  var g = d3.select(el).selectAll('.d3-history-nodes');

  g.append("g").attr("id", "d3-history-text");
  g.append("g").attr("id", "d3-history-arrow");
  g.append("g").attr("id", "d3-history-line");
  g.append("g").attr("id", "d3-history-node");

  // for arrow tip
  g.append("defs").append("marker")
    .attr("id", "historyArrowTip")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 3)
    .attr("refY", 5)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .style("fill", "#DADADA")
    .append("path")
    .attr("d", "M 0 0 10 5 0 10 0 5");

  var historyNode = g.select("#d3-history-node")
    .selectAll('.d3-history-node')
    .data(history, function(d) { return d.historyId; });
  var image = g.selectAll('.image')
    .data(history, function(d) { return d.historyId; });
  var historyArrow = g.select("#d3-history-arrow")
    .selectAll(".d3-history-arrow")
    .data(history, function(d) { return d.historyId; });
  var historyLine = g.select("#d3-history-line")
    .selectAll(".d3-history-line")
    .data(history, function(d) { return d.historyId; });
  var historyText = g.select("#d3-history-text")
    .selectAll(".d3-history-text")
    .data(history, function(d) { return d.historyId; });

  image.enter().append('pattern')
    .attr('id', function(d) { return d.historyId })
    .attr("height", "1")
    .attr("width", "1")
    .attr("viewBox", "0 0 100 100")
    .attr("preserveAspectRatio", "none")
    .append('image')
      .attr('x', '0')
      .attr('y', '0')
      .attr("height", "100")
      .attr("width", "100")
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", function(d) { return d.image });

    historyNode.enter().append('circle')
        .attr('class', 'd3-history-node')
        .attr('cx', function(d) {
          return 70 * (history.length - d.historyId.length + 2 +cnt);
        })
        .attr('cy', 55)
        .attr('r', 30)
        .style('fill', function(d) {
          if (d.image) {
            return ("url(#" + d.id + ")");
          }
        })
        .transition()
          .duration(ANIMATION_DURATION)
          .attr('cx', function(d) {
            return 70 * (history.length - d.historyId.length + 2 +cnt);
          })
          .style('stroke', function(d) {
            if (d.focused==true) {
              return "yellow";
            }
            else if (d.saved==true) {
              return "red";
            }
            else {
              return "#323639";
            }
          });

    historyArrow.enter().append('line')
      .attr("class", "d3-history-arrow")
      .attr("marker-end", "url(#historyArrowTip)")
      .attr("x1", function(d) {
        return 70 * (history.length - d.historyId.length + 2 +cnt);
      })
      .attr("y1", 55)
      .attr("x2", function(d) {
        return 70 * (history.length - d.historyId.length + 1 +cnt) + 33;
      })
      .attr("y2", 55)
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('x1', function(d) {
          return 70 * (history.length - d.historyId.length + 2 +cnt);
        })
        .attr("x2", function(d) {
          return 70 * (history.length - d.historyId.length + 1 +cnt) + 33;
        });

    historyLine.enter().append('line')
      .attr("class", "d3-history-line")
      .attr("x1", 0)
      .attr("y1", 100)
      .attr("x2", el.offsetWidth)
      .attr("y2", 100);

    historyText.enter().append("text")
      .attr("class", "d3-history-text")
      .text("History")
      .attr("x", 15)
      .attr("y", 10)
      .attr("dy", ".35em")
      .style("fill", "#DADADA")
      .style("font-size", "15px")
      .style("font-family", "sans-serif");

    // ENTER & UPDATE
    historyNode.on('click', function(d) {
          dispatcher.emit('point:historyClick', d);
        })
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) {
          return 70 * (history.length - d.historyId.length + 2 +cnt);
        })
        .style('stroke', function(d) {
          if (d.focused==true) {
            return "yellow";
          }
          else if (d.saved==true) {
            return "red";
          }
          else {
            return "#323639";
          }
        });

    historyArrow.on('click', function(d) {
      //
    })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x1', function(d) {
        return 70 * (history.length - d.historyId.length + 2 +cnt);
      })
      .attr("x2", function(d) {
        return 70 * (history.length - d.historyId.length + 1 +cnt) + 33;
      });
      historyLine.on('click', function(d) {
        //
      })
      .transition()
        .duration(ANIMATION_DURATION)
        .attr("x2", el.offsetWidth);

    // EXIT
    historyNode.exit().remove();
    historyArrow.exit().remove();
    historyLine.exit().remove();
    historyText.exit().remove();
}

d3Linear._drawTooltips = function(el, scales, data, prevScales) {

  var g = d3.select(el).selectAll('.d3-tooltips');

  g.append("g").attr("id", "d3-tooltip-rect");
  g.append("g").attr("id", "d3-tooltip-text");

  var tooltipRect = g.select("#d3-tooltip-rect").selectAll('.d3-tooltip-rect')
    .data(data, function(d) { return d.id; });
  var tooltipText = g.select("#d3-tooltip-text").selectAll('.d3-tooltip-text')
    .data(data, function(d) { return d.id; });

  // Enter
  tooltipRect.enter().append('rect')
      .attr('class', 'd3-tooltip-rect')
      .attr('width', TOOLTIP_WIDTH)
      .attr('height', TOOLTIP_HEIGHT)
      .style("fill", "#DADADA")
      .attr('x', function(d) {
        if (prevScales) {
          return prevScales.x(d.x) - TOOLTIP_WIDTH/2;
        }
        return scales.x(d.x) - TOOLTIP_WIDTH/2;
      })
      .transition()
          .duration(ANIMATION_DURATION)
          .attr('x', function(d){ return scales.x(d.x) - TOOLTIP_WIDTH/2; })
          .attr('y', function(d) {
            if (d.focused == true) {
              return scales.y(d.y) + scales.z(d.z)*20 - TOOLTIP_HEIGHT;
            }
            return scales.y(d.y) + scales.z(d.z)*3 - TOOLTIP_HEIGHT;
          });
  // Enter and update
  tooltipRect.transition()
    .duration(ANIMATION_DURATION)
        .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; })
        .attr('y', function(d) {
          if (d.focused == true) {
            return scales.y(d.y) + scales.z(d.z)*20 - TOOLTIP_HEIGHT;
          }
          return scales.y(d.y) + scales.z(d.z)*3 - TOOLTIP_HEIGHT;
        });
  // Exit
  tooltipRect.exit()
      .remove();

  // Enter
  tooltipText.enter().append('text')
      .attr('class', 'd3-tooltip-text')
      .attr('x', function(d){ return scales.x(d.x); })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      // .text(function(d) {
      //   return d.tag;
      // })
      .html(function(d) {
        var x = scales.x(d.x) - TOOLTIP_WIDTH/2;
        var dx = -75;
        // var t1 = d.tag[0];
        // var t2 = "<tspan dx=" +dx+ " dy=1.0em>" + d.tag[1] + "</tspan>";
        // var t3 = "<tspan dx=" +dx+ " dy=1.0em>" + d.tag[2] + "</tspan>";
        // var t4 = "<tspan dx=" +dx+ " dy=1.0em>" + d.tag[3] + "</tspan>";
        var t1 = d.tag_de[0];
        var t2 = "<tspan dx=" +dx+ " dy=1.0em>" + d.tag_de[1] + "</tspan>";
        var t3 = "<tspan dx=" +dx+ " dy=1.0em>" + d.tag_de[2] + "</tspan>";
        var t4 = "<tspan dx=" +dx+ " dy=1.0em>" + d.tag_de[3] + "</tspan>";
        return t1 + t2 + t3 + t4;
      })
      .style("font-size", "23px")
      .style("fill", "#323639")
      .style("font-family", "sans-serif")
      .attr('x', function(d) {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
      .transition()
          .duration(ANIMATION_DURATION)
          .attr('x', function(d){ return scales.x(d.x); })
          .attr('y', function(d) {
            if (d.focused == true) {
              return scales.y(d.y) + scales.z(d.z)*20 - TOOLTIP_HEIGHT +25;
            }
            return scales.y(d.y) + scales.z(d.z)*3 - TOOLTIP_HEIGHT +25;
          });

  // Enter and update
  tooltipText.transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x); })
      .attr('y', function(d) {
        if (d.focused == true) {
          return scales.y(d.y) + scales.z(d.z)*20 - TOOLTIP_HEIGHT +25;
        }
        return scales.y(d.y) + scales.z(d.z)*3 - TOOLTIP_HEIGHT +25;
      });
  // Exit
  tooltipText.exit()
      .remove();

}



export default d3Linear;
