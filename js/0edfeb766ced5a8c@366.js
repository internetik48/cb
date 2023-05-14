// https://observablehq.com/@d3/pack@366
import define1 from "./7a9e12f9fb3d8e06@459.js";

function _1(md){return(
md``
)}

function _chart(Pack,flare){return(
Pack(flare, {
  value: d => d.size, // size of each node (file); null for internal nodes (folders)
  label: (d, n) => d.name.split(/(?=[A-Z][a-z])/g),
  title: (d, n) => `${n.ancestors().reverse().map(({data: d}) => d.name).join(".")}\n${n.value.toLocaleString("en")}`,
  width: 500,
  height: 500
})
)}

function _flare(FileAttachment){return(
FileAttachment("flare.json").json()
)}

function _4(howto){return(
howto("Pack")
)}

function _Pack(d3,location){return(
function Pack(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
  path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
  parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
  children, // if hierarchical data, given a d in data, returns its children
  value, // given a node d, returns a quantitative value (for area encoding; null for count)
  sort = (a, b) => d3.descending(a.value, b.value), // how to sort nodes prior to layout
  label, // given a leaf node d, returns the display name
  title, // given a node d, returns its hover text
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links, if any
  width = 100, // outer width, in pixels
  height = 100, // outer height, in pixels
  margin = 1, // shorthand for margins
  marginTop = margin, // top margin, in pixels
  marginRight = margin, // right margin, in pixels
  marginBottom = margin, // bottom margin, in pixels
  marginLeft = margin, // left margin, in pixels
  padding = 3, // separation between circles
  fill = "#9adaf7", // fill for leaf circles
  fillOpacity, // fill opacity for leaf circles
  stroke = "#9adaf7", // stroke for internal circles
  strokeWidth, // stroke width for internal circles
  strokeOpacity, // stroke opacity for internal circles
} = {}) {

  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  const root = path != null ? d3.stratify().path(path)(data)
      : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

  // Compute the values of internal nodes by aggregating from the leaves.
  value == null ? root.count() : root.sum(d => Math.max(0, value(d)));

  // Compute labels and titles.
  const descendants = root.descendants();
  const leaves = descendants.filter(d => !d.children);
  leaves.forEach((d, i) => d.index = i);
  const L = label == null ? null : leaves.map(d => label(d.data, d));
  const T = title == null ? null : descendants.map(d => title(d.data, d));

  // Sort the leaves (typically by descending value for a pleasing layout).
  if (sort != null) root.sort(sort);

  // Compute the layout.
  d3.pack()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .padding(padding)
    (root);

  const svg = d3.create("svg")
      .attr("viewBox", [-marginLeft, -marginTop, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "Yekan")
      .attr("font-size", 9)
      .attr("text-anchor", "middle");

  const node = svg.selectAll("a")
    .data(descendants)
    .join("a")
      .attr("xlink:href", link == null ? null : (d, i) => link(d.data, d))
      .attr("target", link == null ? null : linkTarget)
      .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#fff" : fill)
      .attr("fill-opacity", d => d.children ? null : fillOpacity)
      .attr("stroke", d => d.children ? stroke : null)
      .attr("stroke-width", d => d.children ? strokeWidth : null)
      .attr("stroke-opacity", d => d.children ? strokeOpacity : null)
      .attr("r", d => d.r);

  if (T) node.append("title").text((d, i) => T[i]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    const leaf = node
      .filter(d => !d.children && d.r > 10 && L[d.index] != null);

    leaf.append("clipPath")
        .attr("id", d => `${uid}-clip-${d.index}`)
      .append("circle")
        .attr("r", d => d.r);

    leaf.append("text")
        .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.index}`, location)})`)
      .selectAll("tspan")
      .data(d => `${L[d.index]}`.split(/\n/g))
      .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, D) => `${(i - D.length / 2) + 0.85}em`)
        .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
        .text(d => d);
  }

  return svg.node();
}
)}

function _CirclePacking(Pack){return(
Pack
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["flare.json", {url: new URL("../files/exp14.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["Pack","flare"], _chart);
  main.variable(("flare")).define("flare", ["FileAttachment"], _flare);
  main.variable().define(["howto"], _4);
  main.variable(("Pack")).define("Pack", ["d3","location"], _Pack);
  main.variable(("CirclePacking")).define("CirclePacking", ["Pack"], _CirclePacking);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  return main;
}
