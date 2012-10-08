// Licensed under the Tumbolia Public License. See footer for details.

;(function() {

//-----------------------------------------------------------------------------
if (window.rsprofiler) return

var rsprofiler = window.rsprofiler = {}

//-----------------------------------------------------------------------------
rsprofiler.getProfiles = function getProfiles() {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = getProfilesCB
    xhr.open("GET", "/profiles")
    xhr.send()
}

//-----------------------------------------------------------------------------
function getProfilesCB() {
    var xhr = this
    if (xhr.readyState != xhr.DONE) return

    if (xhrStatusOK(xhr.status)) {
        var profiles = JSON.parse(xhr.responseText)
        return updateProfiles(profiles)
    }
}

//-----------------------------------------------------------------------------
rsprofiler.deleteProfile = function deleteProfile(url) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = deleteProfileCB
    xhr.open("DELETE", "/profiles/" + url)
    xhr.send()
}

//-----------------------------------------------------------------------------
function deleteProfileCB() {
    var xhr = this
    if (xhr.readyState != xhr.DONE) return

    if (xhrStatusOK(xhr.status)) {
        rsprofiler.getProfiles()
    }
}

//-----------------------------------------------------------------------------
rsprofiler.showProfile = function showProfile(url) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = showProfileCB
    xhr.open("GET", "/profiles/" + url)
    xhr.send()
}

//-----------------------------------------------------------------------------
function showProfileCB() {
    var xhr = this
    if (xhr.readyState != xhr.DONE) return

    if (xhrStatusOK(xhr.status)) {
        showProfileChart(JSON.parse(xhr.responseText))
    }
}

//-----------------------------------------------------------------------------
function showProfileChartOld(profile) {
    $("#profiles-chart").html("<pre style='font-size:50%'>")
    $("#profiles-chart pre").text(JSON.stringify(profile, null, 4))
}

//-----------------------------------------------------------------------------
function showProfileChart(profile) {
    profile = removeEmptyChildren(profile.head)
    partitionize(profile)

    $("#profiles-chart svg").remove()

    var w = 1120,
        h = 600,
        x = d3.scale.linear().range([0, w]),
        y = d3.scale.linear().range([0, h]);

    var vis = d3.select("#profiles-chart")
        .attr("class", "chart")
        .style("width", w + "px")
        .style("height", h + "px")
      .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var partition = d3.layout.partition()
        .value(function(d) { return d.selfTime; });

    var root = profile

    var g = vis.selectAll("g")
        .data(partition.nodes(root))
      .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
        .on("click", click)
        .on("mouseover", updateIdentifiedNode);

    var kx = w / root.dx,
        ky = h / 1;

    g.append("svg:rect")
        .attr("width", root.dy * kx)
        .attr("height", function(d) { return d.dx * ky; })
        .attr("class", function(d) { return d.children  ? "parent"    : "child"; })
        .style("opacity", function(d) { 
            if (!d.parent) return 1;
            if (d.parent && d.parent.totalTime >= 0 && d.totalTime >= 0) {
                var value = 0.3 + (0.7 * (d.totalTime / d.parent.totalTime))
                return value
            }
        })
        .classed("invisible", function(d) { return d.invisible });

    g.append("svg:text")
        .attr("transform", transform)
        .attr("dy", ".35em")
        .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
        .text(function(d) { return d.name; })

    d3.select(window)
        .on("click", function() { click(root); })

    function click(d) {
      if (!d.children) return;

      kx = (d.y ? w - 40 : w) / (1 - d.y);
      ky = h / d.dx;
      x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
      y.domain([d.x, d.x + d.dx]);

      var t = g.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

      t.select("rect")
          .attr("width", d.dy * kx)
          .attr("height", function(d) { return d.dx * ky; });

      t.select("text")
          .attr("transform", transform)
          .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

      d3.event.stopPropagation();
    }

    function transform(d) {
      return "translate(8," + d.dx * ky / 2 + ")";
    }
}

//-----------------------------------------------------------------------------
function removeEmptyChildren(parent) {
    if (!parent.children) return
    if (!parent.children.length) {
        delete parent.children
        return
    }

    parent.children.forEach(function(child){
        removeEmptyChildren(child)
    })

    return parent
}

//-----------------------------------------------------------------------------
function profileComparer(a,b) {
    return b.url.localeCompare(a.url)
}

//-----------------------------------------------------------------------------
function updateProfiles(profiles) {
    var table = d3.select("#profiles-table")
    var tr    = table.selectAll("tr").data(profiles, function(d) {return d.url})

    tr.exit().remove()
    tr.enter().append("tr")
    tr.sort(function (a,b) { return b.url.localeCompare(a.url) })

    tr.html(function(d) {
        return "" + 
            "<td class='profile-name' title='show this profile'>" + d.name + 
            "<td><div class='trash-can' title='delete this profile'></div>" 
    })

    tr.each(function(d) {
        d3.select(this).select(".profile-name").on("click", function(){
            rsprofiler.showProfile(d.url)
        })
        d3.select(this).select(".trash-can").on("click", function(){
            rsprofiler.deleteProfile(d.url)
        })
    })
}

//-----------------------------------------------------------------------------
// typical profiling data - selfTime/totalTime values on all nodes in a tree -
// is not how a partition tree in d3 is specified.  In d3, a partition only
// considers "values" on leaf nodes, and not non-leaf nodes.  So, for d3,
// we'll use "selfTime" as the value, and for every non-leaf node, we'll add
// a new child leaf node with the "selfTime" value.  Kinda wonky, but the
// data model works.  Maybe color those synthethic nodes transparent?
//-----------------------------------------------------------------------------
function partitionize(node) {
    if (!node.children) return
    if (!node.children.length) return

    node.children.forEach(function(child){
        partitionize(child)
    })

    node.children.push({
        selfTime:  node.selfTime,
        invisible: true
    })
}

//-----------------------------------------------------------------------------
function updateIdentifiedNode(node) {
    if (node.invisible) return

    var func = node.functionName
    var file = node.url
    var line = node.lineNumber

    if (!func || func == "") 
        func = "<anonymous>"
    else 
        func += "()"

    if (!file || file == "") file = "<no file>"
    if (!line)               line = ""

    var message = func + " in " + file + ":" + line + "\n" +
        "   called:    " + node.numberOfCalls + " times\n" +
        "   selfTime:  " + node.selfTime      + "\n" +
        "   totalTime: " + node.totalTime

    $("#identified-node").text(message)
}

//-----------------------------------------------------------------------------
function xhrStatusOK(status) {
    if (status === 0)  return true
    if (status == 200) return true
    return false
}

//-----------------------------------------------------------------------------
rsprofiler.getProfiles()

// setInterval(function(){rsprofiler.getProfiles()}, 5000)

})();

//-----------------------------------------------------------------------------
// Copyright (c) 2012 Patrick Mueller
// 
// Tumbolia Public License
// 
// Copying and distribution of this file, with or without modification, are
// permitted in any medium without royalty provided the copyright notice and this
// notice are preserved.
// 
// TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
// 
//   0. opan saurce LOL
//-----------------------------------------------------------------------------
