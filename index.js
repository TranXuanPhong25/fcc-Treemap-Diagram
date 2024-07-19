
const DATA = [
   {
      "title": "Video Game Sales",
      "description": "Top 100 Most Sold Video Games Grouped by Platform",
      "url": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
   },
   {
      "title": "Kickstarter Pledges",
      "description": "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
      "url": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
   },
   {
      "title": "Movie Sales",
      "description": "Top 100 Highest Grossing Movies Grouped By Genre",
      "url": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
   }
]
const DEFAULT_DATA_ID = 0;
const TOOL_TIP_PADDING = 20;
const WIDTH = 1000;
const HEIGHT = 600;
const LEGEND_RECT_SIZE = 30;
const LEGEND_HEIGHT = 200;
const title = d3.select("#title")
const description = d3.select("#description")
const TITLE_PADDING = 4;
const tooltip = d3.select("#tooltip")
const x = document.querySelectorAll(".btn")
   .forEach(btn => btn.addEventListener("click", function () {

      render(btn.attributes["btn-id"].value)

   }))

const render = (dataId) => {
   fetch(DATA[dataId].url)
      .then(response => response.json())
      .then(data => {
         console.log(data);
         title.text(DATA[dataId].title)
         description.text(DATA[dataId].description)
         const fader = (color) => {
            return d3.interpolateRgb(color, '#fff')(0.1);
         };

         const color = d3.scaleOrdinal([
            '#1f77b4',
            '#aec7e8',
            '#ff7f0e',
            '#ffbb78',
            '#2ca02c',
            '#98df8a',
            '#d62728',
            '#ff9896',
            '#9467bd',
            '#c5b0d5',
            '#8c564b',
            '#c49c94',
            '#e377c2',
            '#f7b6d2',
            '#7f7f7f',
            '#c7c7c7',
            '#bcbd22',
            '#dbdb8d',
            '#17becf',
            '#9edae5'
         ].map(fader));
         if (document.querySelector("svg")) {
            d3.selectAll("svg").remove()
         }
         const svg = d3.select("#chartContainer")
            .append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);
         const root = d3.treemap(data)
            .tile(d3.treemapSquarify)
            .size([WIDTH, HEIGHT])
            .padding(1)
            (d3.hierarchy(data)
               .sum(d => d.value)
               .sort((a, b) => b.value - a.value));
         const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
         leaf.append("rect")
            .attr("class", "tile")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("fill", d => d3.color(color(d.data.category)).brighter(0.5))
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .on("mousemove", (event, d) => {
               tooltip.style("opacity", 1)
                  .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                  .style("left", `${event.pageX + TOOL_TIP_PADDING}px`)
                  .style("top", `${event.pageY + TOOL_TIP_PADDING}px`)
                  .attr("data-value", d.data.value)
            })
            .on("mouseout", () => {
               tooltip.style("opacity", 0)
            })
         leaf.append('text')
            .attr("font-size", "10px")
            .attr("class", "tile-text select-none ")
            .selectAll('tspan')
            .data(function (d) {
               return d.data.name.split(/(?=[A-Z][^A-Z])/g);
            })
            .enter()
            .append('tspan')
            .attr('x', function () {
               const gParentData = d3.select(this.parentNode.parentNode).datum();
               return TITLE_PADDING + gParentData.x0;
            })
            .attr('y', function (d, i) {
               const gParentData = d3.select(this.parentNode.parentNode).datum();
               return TITLE_PADDING + gParentData.y0 + 14 + i * 14;
            })
            .text(d => d);
         const largestLength = d3.max(color.domain().map(d=>d.length ))
         
         const legend = d3.select("#chartContainer").append("svg")
            .attr("width", WIDTH)
            .attr("height", LEGEND_HEIGHT)
            .attr("class", "legend mt-4")
            .attr("id", "legend");
         const legendItem = legend.selectAll("g")
            .data(color.domain())
            .join("g")
            .attr("transform", (d, i) => `translate(${(i % 7) * LEGEND_RECT_SIZE * 5}, ${Math.floor(i / 7) * LEGEND_RECT_SIZE})`); 
            legendItem.append("rect")
            .classed("legend-item", true)
            .attr("width", LEGEND_RECT_SIZE)
            .attr("height", LEGEND_RECT_SIZE)
            .attr("fill", d => color(d))
         legendItem.append("text")
            .attr("x", LEGEND_RECT_SIZE+LEGEND_RECT_SIZE/5)
            .attr("y", LEGEND_RECT_SIZE / 2)
            
            .attr("text-anchor", "left")
            .attr("fill", "black")
            .attr("font-size", "11px")
            .text(d => d)

      })
}
render(DEFAULT_DATA_ID);