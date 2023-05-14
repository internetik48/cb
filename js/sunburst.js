import define from "./chart.js";
import defineexp from "./chartjs2.js";
import { Runtime, Library, Inspector } from "./runtime.js";
const runtime = new Runtime();
runtime.module(define, Inspector.into(document.getElementById("parent-container")));
runtime.module(defineexp, Inspector.into(document.getElementById("sunburst-exp")));