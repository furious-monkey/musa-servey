import Index from "views/Index.js";
import Maps from "views/examples/Maps.js";
import Chart from "views/chart.js";

var routes = [
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/index",
    name: "Musa Survey",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/chart",
    name: "Musa Survey",
    icon: "ni ni-tv-2 text-primary",
    component: Chart,
    layout: "/admin"
  },
];
export default routes;
