/* Global variables */
let selectedValue = 'habit'; // Initialize with a default value if needed
var toggleStates = {}; // Initialize toggleStates as an empty object
let _smallCircleSize = 12;
let _regularCircleSize = 16;
let _midCircleSize = 22;
let _enlargedCircleSize = 18;
//const users = ["System Developer", "AI User", "AI Subject", "Organisational Leader", "Compliance Expert", "Institutions and Environment"];
const _users = ["AI Subject"];

let visibilityStates = {}; // Object to store circle visibility states

// CIRCLE CLICKER
let uniqueCircleClicks = new Set(); // Create a set to store unique circle IDs for the tracker

// Initial SVG and circle setup
var counter = d3.select("#circle-counter")
  .append("svg")
  .attr("width", 100)
  .attr("height", 100);

var sizeScale = d3.scaleLinear()
  .domain([0, 132]) // Input range
  .range([10, 50]); // Output range, adjust min and max sizes as needed

var colorScale = d3.scaleLinear()
  .domain([0, 20, 40, 65, 85, 110, 132]) // Assuming the same domain as your sizeScale
  .range(["white", "gold", "orange", "tomato", "crimson", "purple", "blue"]); // Color range from white to crimson

var circleCounter = counter.append("circle")
  .attr("cx", 50)   // Center of the SVG element
  .attr("cy", 50)   // Center of the SVG element
  .attr("r", sizeScale(0)) // Start with the minimum size
  .attr("fill", "white")
  .attr("stroke", "black")
  .attr("stroke-width", "1px")

var circleCounterText = counter.append("text")
  .attr("x", 42.5)
  .attr("y", 54)
  .attr("fill", "black")
  .attr("class", "counter-labels")
  .text(0);

// Function to update the circle's size
function resizeCircle(newSize) {
  circleCounter.transition()
    .duration(300) // Duration for resizing
    .attr("r", newSize) // Resizing the circle
    .attr("fill", colorScale(newSize))
    .transition() // Chain another transition for blinking
    .duration(300) // Duration for one blink cycle
    .attr("opacity", 0.2) // Set lower opacity (partially hidden)
    .transition()
    .duration(300) // Duration for one blink cycle
    .attr("opacity", 1) // Set full opacity (fully visible)
    .transition()
    .duration(300) // Duration for one blink cycle
    .attr("opacity", 0.2) // Repeat blinking
    .transition()
    .duration(300) // Duration for one blink cycle
    .attr("opacity", 1); // Return to full opacity
}


function enlargeCounterCircle(circleId) {
  uniqueCircleClicks.add(circleId);
  circleCounterText.text(uniqueCircleClicks.size);

  // Calculate new size using the scale
  let newSize = sizeScale(uniqueCircleClicks.size);
  resizeCircle(newSize);
}

/* Generate impact card components from the data */
const tagDescriptions = {
  "SDG 1": "End poverty in all its forms everywhere",
  "SDG 2": "End hunger, achieve food security and improved nutrition and promote sustainable agriculture",
  "SDG 3": "Ensure healthy lives and promote well-being for all at all ages",
  "SDG 4": "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
  "SDG 5": "Achieve gender equality and empower all women and girls",
  "SDG 6": "Ensure availability and sustainable management of water and sanitation for all",
  "SDG 7": "Ensure access to affordable, reliable, sustainable and modern energy for all",
  "SDG 8": "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all",
  "SDG 9": "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation",
  "SDG 10": "Reduce inequality within and among countries",
  "SDG 11": "Make cities and human settlements inclusive, safe, resilient and sustainable",
  "SDG 12": "Ensure sustainable consumption and production patterns",
  "SDG 13": "Take urgent action to combat climate change and its impacts",
  "SDG 14": "Conserve and sustainably use the oceans, seas and marine resources for sustainable development",
  "SDG 15": "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss",
  "SDG 16": "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels",
  "SDG 17": "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development",
  "HR Article 1": "Right to equality",
  "HR Article 2": "Freedom from discrimination",
  "HR Article 3": "Right to life, liberty, personal security",
  "HR Article 4": "Freedom from slavery",
  "HR Article 5": "Freedom from torture and degrading treatment",
  "HR Article 6": "Right to recognition as a person before the law",
  "HR Article 7": "Right to equality before the law",
  "HR Article 8": "Right to remedy by competent tribunal",
  "HR Article 9": "Freedom from arbitrary arrest and exile",
  "HR Article 10": "Right to fair public hearing",
  "HR Article 11": "Right to be considered innocent until proven guilty",
  "HR Article 12": "Freedom from interference with privacy, family, home and correspondence",
  "HR Article 13": "Right to free movement in and out of the country",
  "HR Article 14": "Right to asylum in other countries from persecution",
  "HR Article 15": "Right to a nationality and the freedom to change it",
  "HR Article 16": "Right to marriage and family",
  "HR Article 17": "Right to own property",
  "HR Article 18": "Freedom of belief and religion",
  "HR Article 19": "Freedom of opinion and information",
  "HR Article 20": "Right of peaceful assembly and association",
  "HR Article 21": "Right to participate in government and in free elections",
  "HR Article 22": "Right to social security",
  "HR Article 23": "Right to desirable work and to join trade unions",
  "HR Article 24": "Right to rest and leisure",
  "HR Article 25": "Right to adequate living standard",
  "HR Article 26": "Right to education",
  "HR Article 27": "Right to participate in the cultural life of community",
  "HR Article 28": "Right to a social order that articulates this document",
  "HR Article 29": "Community duties essential to free and full development",
  "HR Article 30": "Freedom from state or personal interference in the above rights",
  "capability": "Technical capability of AI",
  "human-interaction": "Experience of people interacting with AI",
  "systemic-impact": "Societal and environmental impact of AI",
  "mitigations": "Actions to minimize risks"
};

/* FUNCTION WITHOUT MATCHING THE ID */
/*
function generateMitigationsFromData(data, type, users) {
  let html = "";
  if (data && data.length > 0) {
    // Add header
    html += `<div class="card-item-wrapper">`;
    html += `<div class="risk-icon"></div>`;
    html += `<div class="risk-details"></div>`;
    html += `<div class="risk-stakeholders">`;
    html += `<div class="stakeholders-label-wrapper">`;
    html += `</div>`; // End of stakeholder-labels div
    html += `</div>`;
    html += `</div>`;
    html += `<h4 class="card-subheader">${type}</h4>`;

    users.forEach(user => {
      const userMitigations = data.filter(mitigation => mitigation["AI Stakeholder for whom is the strategy"] === user);

      if (userMitigations.length > 0) {
        html += `<h5>${user}:</h5>`;
        userMitigations.forEach(mitigation => {
          html += `<div class="card-item-wrapper">`;
          html += `<div class="risk-icon"></div>`;
          html += `<div class="risk-details">`;
          //html += `<p>Risk ID: ${mitigation["Risk ID"]}</p>`;
          html += `<p>Risk Description: {${mitigation["Risk description for risk being mitigated"]}</p>`;
          //html += `<p>Mitigation Strategy: ${mitigation["Mitigation Strategy"]}</p>`;
          //html += `<p>Type of Mitigation Strategy: ${mitigation["Type of Mitigation Strategy"]}</p>`;
          //html += `<p>Practical Mitigation Actions: </p>`;
          html += `<ul>`;
          mitigation["Practical mitigation actions"].forEach(action => {
            html += `<li>${action}</li>`;
          });
          html += `</ul>`;
          //html += `<p>New System Description: ${mitigation["New System Description"]}</p>`;
          html += `</div>`;
          html += `</div>`;
        });
      } else {
        html += `<p>No ${type} available for ${user}.</p>`;
      }
    });

  } else {
    html = `<p>No ${type} available.</p>`;
  }

  return html;
};
*/

function generateMitigationsFromData(data, type, users, risksData) {
  let html = "";
  if (data && data.length > 0) {
    html += `<div class="card-item-wrapper">`;
    html += `<div class="risk-icon"></div>`;
    html += `<div class="risk-details"></div>`;
    html += `<div class="risk-stakeholders">`;
    html += `<div class="stakeholders-label-wrapper"></div>`;
    html += `</div>`;
    html += `</div>`;
    html += `<h4 class="card-subheader">${type}</h4>`;

    users.forEach(user => {
      const userMitigations = data.filter(mitigation => mitigation["AI Stakeholder for whom is the strategy"] === user);

      // Set counter
      if (userMitigations.length != 1) {
        d3.select("#counter-mitigations").text(userMitigations.length + " mitigations for you to act upon");
      } else {
        d3.select("#counter-mitigations").text(userMitigations.length + " mitigations for you to act upon");
      }

      // Append mitigations ot the card
      if (userMitigations.length > 0) {
        //html += `<h5>${user}:</h5>`;
        userMitigations.forEach(mitigation => {
          // Find the corresponding risk description in the Risks data
          const riskDescription = findRiskDescription(risksData, mitigation["Risk ID"]);

          html += `<div class="card-item-wrapper">`;
          html += `<div class="risk-icon mitigations"></div>`;
          html += `<div class="risk-details">`;
          html += `<p>${riskDescription}</p>`;
          html += `<ul>`;
          mitigation["Practical mitigation actions"].forEach(action => {
            html += `<li>${action}</li>`;
          });
          html += `</ul>`;
          html += `</div>`;
          html += `</div>`;
        });
      } else {
        //html += `<p>No ${type} available for $user}.</p>`;
        html += `<p>No ${type} found for you.</p>`;
      }
    });
  } else {
    html = `<p>No ${type} available.</p>`;
  }

  return html;
}

function findRiskDescription(risksData, riskId) {
  for (const riskCategory of risksData) {
    for (const key in riskCategory) {
      const risks = riskCategory[key];
      const foundRisk = risks.find(risk => risk["Risk ID"] === riskId);
      if (foundRisk) {
        return foundRisk["Risk Description"];
      }
    }
  }
  return "Risk description not found";
}

function generateRisksAndBenefitsFromData(data, type) {
  const allStakeholders = ["AI User", "AI Subject", "Institutions, General Public and Environment"];

  let html = "";
  let itemCount = 0; // Counter for items

  if (data && data.length > 0) {

    // Labels for Stakeholders
    html += `<div class="card-item-wrapper">`;
    html += `<div class="risk-icon"></div>`;
    html += `<div class="risk-details"></div>`;
    html += `<div class="risk-stakeholders">`;
    html += `<div class="stakeholders-label-wrapper">`;
    allStakeholders.forEach(stakeholder => {
      html += `<div class="stakeholder-label">${stakeholder}</div>`;
    });
    html += `</div>`; // End of stakeholder-labels div
    html += `</div>`;
    html += `</div>`;
    html += `<h4 class="card-subheader">${type}</h4>`;
    // 
    data.forEach(categoryData => {
      for (let category in categoryData) {
        if (categoryData[category].length > 0) {
          itemCount += categoryData[category].length;

          //html += `<h5>${category}:</h5>`;

          categoryData[category].forEach(item => {
            html += `<div class="card-item-wrapper">`;

            // Capability header
            let formattedCategory = category.toLowerCase().replace(/[\s,]+/g, '-');
            html += `<div class="risk-icon ${formattedCategory}"></div>`;

            html += `<div class="risk-details">`;
            html += `<p>${item[type === "risks" ? "Risk Description" : "Benefit Description"]}</p>`;

            // SDGs and Human Rights tags
            let sdgsKey = type === "risks" ? "SDGs affected by risk" : "SDGs supported by benefit";
            if (item[sdgsKey] && item[sdgsKey].length > 0) {
              item[sdgsKey].forEach(sdg => {
                html += `<span class="tag">${sdg}</span>`;
              });
            }

            let humanRightsKey = type === "risks" ? "Human Rights affected by risk" : "Human Rights supported by benefit";
            if (item[humanRightsKey] && item[humanRightsKey].length > 0) {
              item[humanRightsKey].forEach(hr => {
                html += `<span class="tag">${hr}</span>`;
              });
            }
            html += `</div>`; // End of risk-details div

            // Div for Stakeholders
            html += `<div class="risk-stakeholders">`;
            let stakeholdersKey = type === "risks" ? "Stakeholders affected by risk" : "Stakeholders supported by benefit";
            if (item[stakeholdersKey]) {
              allStakeholders.forEach(stakeholder => {
                const isAffectedOrSupported = item[stakeholdersKey].includes(stakeholder);
                html += `<span class="stakeholder" style="background-color: ${isAffectedOrSupported ? 'black' : 'white'};"></span>`;
              });
            }
            html += `</div>`; // End of risk-stakeholders div
            html += `</div>`; // End of card-item-wrapper div
          });
        }
      }
    });

    // Update the text of the corresponding span
    // Check if itemCount is 1; if so, remove the last character from 'type' (1 benefit vs 2 benefits)
    let displayType = itemCount === 1 ? type.slice(0, -1) : type;
    d3.select(`#counter-${type}`).text(itemCount + ' ' + displayType);

  } else {
    html = `<p>No ${type} available.</p>`;
    d3.select(`#counter-${type}`).text(0 + ` ${type}`); // Set count to 0 if no data
  }
  return html;
}

/* DROPDOWN WITH THE LEGEND */
// Function to extract unique values for a given property from the JSON dataset
function getUniqueValuesFromJSON(jsonData, propertyName) {
  const uniqueValues = new Set();
  Object.values(jsonData).forEach(item => {
    const value = item[propertyName];
    if (value) {
      if (typeof value === 'string') {
        value.split(',').forEach(v => {
          uniqueValues.add(v.trim());
        });
      } else {
        uniqueValues.add(value);
      }
    }
  });
  return [...uniqueValues];
}

// Function to assign random colors to each unique value
function assignRandomColorsToValues(jsonData, propertyName) {
  const uniqueValues = getUniqueValuesFromJSON(jsonData, propertyName);
  const colorMap = {};

  uniqueValues.forEach(value => {
    colorMap[value] = getRandomColor();
  });

  return colorMap;
}

// COLOR CIRCLES BASED ON CATEGORIES
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/* SCROLLAMA */
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// Initialize the scrollama
var scroller = scrollama();

var figureHeight = window.innerHeight * 0.85;
var figureMarginTop = (window.innerHeight - figureHeight) / 2;

// Generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  //var figureHeight = window.innerHeight / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

/* SVG */
const svg = d3.select('.viz-container')
  .append('svg')
  .attr('width', "98%")
  .attr('height', figureHeight)
  .attr('class', 'circle-container')
  .style('float', "right")
  .attr("preserveAspectRatio", "xMinYMin");

// Function to add text to an SVG using D3.js
function addText(text, xPos, yPos, fillColor) {
  svg.append("text")
    .attr("x", xPos)
    .attr("y", yPos)
    .attr("fill", fillColor)
    .attr("class", "chart-labels")
    .text(text);
}

function removeText() {
  svg.selectAll(".chart-labels").remove();
}

/* TOOLTIP */
var tooltip = d3.select("main") // Select the body of the website
  .append("div") // Add the container for the tooltip content
  .attr("class", "use-tooltip") // Add class name to the container
  .style("opacity", 0); // Set the initial transparency of tooltip to 0 - invisible

var tooltipImage = tooltip
  .append("div") // Add the container for the tooltip content
  .attr("class", "tooltip-image") // Add class name to the container

var tooltipText = tooltip
  .append("div") // Add the container for the tooltip content
  .attr("class", "tooltip-text") // Add class name to the container

var tooltipLabel = tooltip
  .append("div") // Add the container for the tooltip content
  .attr("class", "tooltip-label") // Add class name to the container

var tooltipLabelSpan = tooltipLabel
  .append("div") // Add the container for the tooltip content
  .attr("class", "tooltip-label-span") // Add class name to the container

var tooltipLabelText = tooltipLabel
  .append("div") // Add the container for the tooltip content
  .attr("class", "tooltip-label-text") // Add class name to the container

function resetTooltip() {
  //tooltip.selectAll("*").remove();
  tooltipText.html("");
  tooltipLabelText.html("");
  tooltipLabelSpan.style("background-color", "white");
  tooltip
    .style('opacity', 0)
    .style("left", "0px") // Horizontal position of the tooltip - horizontal distance from the mouse pointer
    .style("top", "0px");
}

d3.select('body')
  .on('dblclick', closeAnyOpenCard)

/* IMPACT ASSESSMENT CARD */
var card = document.querySelector(".impact-card");

var closeCard = d3.select(".close-card")
  .on('click', closeAnyOpenCard);

var cardContainer = d3.select(".impact-card")
  .append("div")

function toggleCard(element) {
  card.style.display = 'block';
}

function closeAnyOpenCard() {
  var style = window.getComputedStyle(card);
  // Check if the card's display property is 'block'
  if (style.display === 'block') {
    card.style.display = 'none';
  }
}

/* TSNE  */
const maxIter = 500,
  //width = 400,
  width = "100%",
  x = d3.scaleLinear()
    .domain([-200, 200])
    .range([0, width]),
  area = d3.area()
    .x((d, i) => i)
    .y0(width + 90)
    .y1((d, i) => width + 90 - parseInt(3 * d || 0));

/* VIZ */
d3.queue()
  .defer(d3.text, 'tsne.min.js')
  .defer(d3.text, 'worker.js')
  .await(function (err, t, w) {

    let worker = new Worker(window.URL.createObjectURL(new Blob([t + w], {
      type: "text/javascript"
    })));

    d3.json("data-card-compliant-final.json", function (data) {

      // Assuming 'data' is an array of objects and each has a 'domain' property
      /*
      data.forEach(function (item) {
        //console.log(item.DomainGroup, "+", item.Details[0]); // Logs the 'domain' property of each item
        console.log(item.id)
      });
      */

      var filteredData = data.filter(function (d) {
        return d.Reality_Level !== "Unlikely";
      });

      var data = filteredData.map(function (d) {

        var dimArray = [];
        for (var i = 1; i <= 767; i++) {
          dimArray.push(d[i.toString()]);
        }

        return {
          dimensions: dimArray,
          id: d.id,
          details: d.Details,
          domain: d.Details[0],
          group: d.DomainGroup,
          description: d.Description,
          habit: d.DailyHabit,
          risk: d.Classification_Annotators,
          //risk_gpt: d.Classification_GPT,
          realism: d.Reality_Level,
          reasoning: d.ReasoningShort,
          capability: d.Details[1],
          involvingMinor: d.InvolvingMinor,
          entertainmentIndustry: d.EntertainmentIndustry,
          publicSector: d.PublicSector,
          criticalInfrastructureSectors: d.CriticalInfrastructureSectors,
          typeCriticalInfrastructureSector: d.Type_CriticalInfrastructureSector,
          entitySubject: d.Entity_Subject,
          type_EntitySubject: d.Type_Entity_Subject,
          entityUser: d.Entity_User,
          typeEntityUser: d.Type_Entity_User,
          risks: d.Risks,
          benefits: d.Benefits,
          mitigations: d.Mitigated_Risks
        };
      });

      //console.log(data);
      // Initialize counters
// Initialize counters
let sdgCount = 0;
let hrCount = 0;

// Iterate over each data entry
data.forEach(entry => {
    // Iterate over each risk category
    entry.risks.forEach(riskCategory => {
        // Iterate over each risk within the category
        Object.values(riskCategory).forEach(risks => {
            // Iterate over each risk
            risks.forEach(risk => {
                // Check if SDGs are affected by the risk
                if (risk["SDGs affected by risk"]) {
                    // Increment the SDG count
                    sdgCount += risk["SDGs affected by risk"].length;
                }

                // Check if human rights are affected by the risk
                if (risk["Human Rights affected by risk"]) {
                    // Increment the human rights count
                    hrCount += risk["Human Rights affected by risk"].length;
                }
            });
        });
    });
});

// Output the counts
//console.log("Total number of SDGs affected by risks:", sdgCount);
//console.log("Total number of human rights affected by risks:", hrCount);

      var nodes = svg.selectAll("g")
        .data(data);

      var nodeGroup = nodes
        .enter()
        .append("g")

      const circles = nodeGroup.append("circle")
        .attr('class', 'uses')
        //.attr('class', d => (d.risk === "Low Risk" ? ' uses low' : (d.risk === "High Risk" ? ' uses high' : ' uses')))
        .attr('id', d => 'circle' + d.id)
        .attr("r", _regularCircleSize)
        .style('stroke-width', "1px")
        .style("stroke", "white")
        .attr('fill', "silver");


      // Mouseleave event
      circles.on("mouseleave", function () {
        resetTooltip();
        var circle = d3.select(this);
        var circleData = circle.datum(); // Get the data bound to the circle

        circle.transition()
          .duration(500)
          .style('stroke-width', "1px")
          .style("stroke", "white");
      });

      let selectedCircles = svg.selectAll('circle.uses')
        .filter(function (d) {
          return d.risks && d.risks.length > 0; // Check if risks is not empty
        });

      // SET CIRCLE POSITION
      /*
      data.forEach(d => {
        d.x = Math.random() * window.innerWidth;  // Assuming 'width' is the width of your visualization
        d.y = Math.random() * window.innerHeight; // Assuming 'height' is the height of your visualization
      })
      */

      const cost = svg.append('path')
        .attr('fill', '#aaa');

      let pos = data.map(d => [Math.random() - 0.5, Math.random() - 0.5]);
      let costs = [];

      let s = 0, c = 1;

      const forcetsne = d3.forceSimulation(data)
        .alphaDecay(0)
        .alpha(0.3)
        .force('tsne', function (alpha) {
          data.forEach((d, i) => {
            d.x += alpha * (160 * pos[i][0] - d.x); // randomness factor to spread vertically
            d.y += alpha * (160 * pos[i][1] - d.y); // randomness factor to spread horizontally - the smaller the more squizzed
          });
        })
        .force('collide', d3.forceCollide().radius(7)) // push back circles
        //.force("y", d3.forceY(width / 2).strength(2))
        .on('tick', function () {
          circles
            .attr('cx', d => x(d.x * s - d.y * c))
            .attr('cy', d => x(d.x * c + d.y * s))
          // debug: show costs graph
          // cost.attr('d', area(costs));

        })
        .on('end', () => {
          // The simulation for the initial TSNE view has completely stopped here
        });

      worker.onmessage = function (e) {
        if (e.data.pos) {
          // Update the positions in the original data structure
          pos = e.data.pos;
          pos.forEach((p, i) => {
            if (data[i]) {
              data[i].x = p[0];
              data[i].y = p[1];
            }
          });
        }
        if (e.data.iterations) {
          costs[e.data.iterations] = e.data.cost;
        }
        if (e.data.stop) {
          //console.log("stopped with message", e.data);
          forcetsne.alphaDecay(0.02);
          worker.terminate();
        }
      };

      // Prepare the data for the worker
      const workerData = data.map(d => d.dimensions);

      worker.postMessage({
        nIter: maxIter,
        //dim: 2,
        perplexity: 30.0,
        //earlyExaggeration: 4.0,
        // learningRate: 100.0,
        metric: 'manhattan', // or 'euclidean'
        data: workerData
      });

      // Assign random colors to data values
      const dataValues = [
        //{ label: "Affected group", value: "entitySubject" },
        { label: "Affected group type", value: "type_EntitySubject" },
        //{ label: "Supervising group", value: "entityUser" },
        { label: "Supervising group type", value: "typeEntityUser" },
        { label: "Area of use", value: "group" },
        { label: "Impacted infrastructure", value: "typeCriticalInfrastructureSector" }
      ];

      // Iterate over dataValues to assign colors and update colorMaps
      dataValues.forEach(dataValue => {
        const colors = assignRandomColorsToValues(data, dataValue.value);
        colorMaps[dataValue.value] = colors; // Update colorMaps with the new color mappings
      });

      // Extend the properties array with dataValues for the dropdown
      properties.push(...dataValues);
      const container = d3.select('#dropdown-container');

      /* DROPDOWN ELEMENT */
      const select = container.append('select')
        .attr('id', 'value-selector');

      select.append('option')
        .attr('value', "")
        .attr('hidden', "true")
        .attr('selected', "true")
        .attr('disabled', "true")
        .text("Choose a taxonomy")

      // Append options to the select element
      properties.forEach(property => {
        select.append('option')
          .attr('value', property.value)
          .text(property.label);
      });

      // Add event listener to the dropdown 
      select.on('change', function () {

        // Reset visibility state for each category
        Object.keys(visibilityStates).forEach(key => {
          visibilityStates[key] = true;
        });

        // Make all circles and their labels visible
        d3.selectAll("circle.uses").style('visibility', 'visible');
        d3.selectAll("circle.uses")
          .style('opacity', 0.7);
        selectedValue = d3.select(this).property('value');
        updateCircleColors(selectedValue, selectedCircles); // Function to update circle colors
        updateLegend(selectedValue); // Update the legend

      });

      // Update the circles' style
      function showLegend() {
        d3.selectAll(".sidebar")
          .transition() // Optional: add a transition for smooth movement
          .duration(500) // Duration of the transition in milliseconds
          .style('opacity', 1);
      }

      function hideLegend() {
        d3.selectAll(".sidebar")
          .transition() // Optional: add a transition for smooth movement
          .duration(500) // Duration of the transition in milliseconds
          .style('opacity', 0);
      }

      function resetCircles() {
        d3.selectAll('circle.uses')
          .transition()
          .duration(500)
          .attr('r', _regularCircleSize)
          .style('opacity', 0.8);
      };


      // Update the circles' style
      function deactivateDailyUses() {
        circles
          .transition() // Optional: add a transition for smooth movement
          .duration(500) // Duration of the transition in milliseconds
          .attr('r', _regularCircleSize)
          .attr('fill', 'silver');
      }

      // Function to disable mouseover events
      function disableMouseOver() {
        circles.on('mouseover', null);
        circles.on('mouseenter', null);
        //resetTooltip();
      }

      disableMouseOver();

      // Function to enable mouseover events
      function enableMouseOver() {
        circles.on("mouseover", function (d) {
          var imageData = d3.select(this).datum();

          d3.select(this.parentNode) // Select the parent group of the hovered circle
            .raise() // Bring the group to the front
            .style("cursor", "pointer");

          d3.select(this)
            .transition()
            .duration(250)
            .style("stroke", "black")
            .style("stroke-width", "2");

          tooltipImage.style('background-image', 'url(assets/' + imageData.id + '.webp)');
          tooltipImage.style('display', 'block');
          tooltipLabel.style('display', 'flex');

          tooltipText.html(
            "<p>" + d.details[2] + " by " + d.entityUser.toLowerCase() + "</p>"
          );

          let circleColor = d3.select(this).style('fill');
          tooltipLabelSpan.style('background-color', circleColor);
          tooltipLabelText.html(d[selectedValue]);

          // Extract the coordinates and add an offset
          var tooltipLeft // Horizontal position
          var tooltipTop  // Vertical position

          if (imageData.risk == "High Risk") {
            tooltipLeft = d3.event.pageX + 10; // Horizontal position
            tooltipTop = d3.event.pageY + 10; // Vertical position  
          } else {
            tooltipLeft = d3.event.pageX + 10; // Horizontal position
            tooltipTop = d3.event.pageY - 200; // Vertical position  
          }

          // Apply the positioning to the tooltip
          tooltip
            .style("left", tooltipLeft + "px")
            .style("top", tooltipTop + "px");

          // Apply the transition and opacity to the tooltip
          tooltip
            .transition()
            .duration(10)
            .style("opacity", 0.95);


        });
      }

      // Disable showing the card on circle
      function disableClickOnCircles() {
        circles.on('click', null); // Disables click events on the circles
      }

      function enableClickOnCircles() {
        circles.on("click", function (d) {

          var clickedCircle = d3.select(this);
          var circleCircleID = clickedCircle.datum().id;
          enlargeCounterCircle(circleCircleID);

          // Apply transition to the stored reference circle
          clickedCircle
            .transition()
            .duration(500)
            .attr("r", _smallCircleSize)

          // GENERATE CARD
          let risksHtml = generateRisksAndBenefitsFromData(d.risks, "risks");
          let benefitsHtml = generateRisksAndBenefitsFromData(d.benefits, "benefits");
          //let mitigations = generateMitigationsFromData(d.mitigations, 'mitigations', _users);
          let mitigations = generateMitigationsFromData(d.mitigations, 'mitigations', _users, d.risks);

          // Replace placeholder labels with actual data
          risksHtml = risksHtml.replace(/AI User/g, d.entityUser).replace(/AI Subject/g, d.entitySubject);
          benefitsHtml = benefitsHtml.replace(/AI User/g, d.entityUser).replace(/AI Subject/g, d.entitySubject);

          // Concatenate the benefits, risk and mittigations
          let combinedHtml = benefitsHtml + risksHtml + mitigations;

          // Setting the HTML of the card container
          cardContainer.html(combinedHtml);
          d3.select('.impact-card').node().scrollTop = 0;
          d3.select('.card-title').html(d.details[1]);

          var circleRisk = clickedCircle.datum().risk;
          //console.log(circleRisk)

          d3.select('.card-image').style('background-image', 'url(assets/' + circleCircleID + '.webp)');

          d3.select('.card-summary').html("<p>" + d.description + "</p>");

          if (circleRisk == "High Risk") {
            d3.select('.card-justification').html("<p class='high-risk'>" + d.reasoning + "</p>");
          } else {
            d3.select('.card-justification').html("<p class='low-risk'>" + d.reasoning + "</p>");
          }



          toggleCard();

          // Update tags
          let tags = d3.selectAll(".tag")
            .on("mouseover", function (event, d) {

              const key = this.innerHTML.trim();
              const description = tagDescriptions[key];
              tooltipImage.style('display', 'none');
              tooltipLabel.style('display', 'none');
              tooltipText.html("<p>" + description + "</p>" || "<p>Description not found</p>");

              // Tooltip positioning
              tooltip
                .style("left", (d3.event.pageX + 10) + "px") // Horizontal position of the tooltip - horizontal distance from the mouse pointer
                .style("top", (d3.event.pageY + 10) + "px"); // Vertical position of the tooltip - vertical distance from the mouse pointer
              tooltip
                .transition()
                .duration(10) // Set time until tooltip appears on the screen
                .style("opacity", .95); // Set the transparency of the tooltip to 95%
            });

          tags.on("mouseleave", function (d) {
            resetTooltip();
          });

          // Update tags
          let icons = d3.selectAll(".risk-icon")
            .on("mouseover", function (event, d) {
              const classNames = this.className.split(" "); // Split the class attribute by space
              const secondClassName = classNames.length > 1 ? classNames[1] : null; // Get the second class name
              const description = tagDescriptions[secondClassName]; // Use the second class name as the key

              tooltipImage.style('display', 'none');
              tooltipLabel.style('display', 'none');
              tooltipText.html("<p>" + description + "</p>" || "<p>Description not found</p>");
              tooltipLabelSpan.style('background-color', '#eee');
              tooltipLabelText.html("Sociotechnical harm evaluation framework");

              // Tooltip positioning
              tooltip
                .style("left", (d3.event.pageX + 10) + "px") // Horizontal position of the tooltip - horizontal distance from the mouse pointer
                .style("top", (d3.event.pageY + 10) + "px"); // Vertical position of the tooltip - vertical distance from the mouse pointer
              tooltip
                .transition()
                .duration(10) // Set time until tooltip appears on the screen
                .style("opacity", .95); // Set the transparency of the tooltip to 95%
            });

          icons.on("mouseleave", function (d) {
            resetTooltip();
          });
        });

      }

      // Define target Y-coordinates for high-risk and low-risk groups
      const highRiskTargetY = -200; // Adjust as needed
      const lowRiskTargetY = 200;  // Adjust as needed

      // Custom force function
      function forceRiskY(alpha, highRisk, LowRisk) {
        data.forEach(function (d) {
          if (d.risk === 'High Risk') {
            // Move high-risk nodes towards the highRiskTargetY
            d.x += (highRisk - d.x) * alpha;
          } else if (d.risk === 'Low Risk') {
            // Move low-risk nodes towards the lowRiskTargetY
            d.x += (LowRisk - d.x) * alpha;
          }
        });
      }

      /* ANIMATIONS ON SCROLL */
      function splitToRisks() {
        // Update the force simulation with the y-force based on Classification_Annotators
        let split = forcetsne
          .force('riskY', alpha => forceRiskY(alpha, highRiskTargetY, lowRiskTargetY))
          .on('end', () => {
            //console.log("Split ended!")
            // Append a zigzag for each nodeGrou
          });
        d3.selectAll("circle.uses")
          .transition()
          .duration(500)
          .attr('r', _regularCircleSize)

        //forcetsne.force('charge', d3.forceManyBody().strength(1)) // Adjust strength as needed
        // Add labels
        addText("High risk", 80, 200, "black");
        addText("Low risk", 80, 600, "black");

        // Restart the simulation
        forcetsne.alpha(0.09).alphaDecay(0.02).restart();
      };

      function resetTSNE() {
        // Update the force simulation with the y-force based on Classification_Annotators
        forcetsne.force('riskY', alpha => forceRiskY(alpha, -50, 50));
        //forcetsne.force('charge', d3.forceManyBody().strength(100)) // Adjust strength as needed
        removeText(); // Remove labels
        forcetsne.alpha(0.09).alphaDecay(0.02).restart(); // Restart the simulation
      }

      function activateDailyUses() {
        circles
          .transition() // Start the transition
          .duration(500) // Duration of the transition in milliseconds
          .attr('r', function (d) {
            return d.habit === 'Daily life habit' ? _midCircleSize : _regularCircleSize;
          })
          .attr('fill', function (d) {
            return d.habit === 'Daily life habit' ? 'orange' : 'silver';
          });
      }

      function activateRiskyUses() {
        selectedValue = 'risk';
        // Trigger data
        $('#value-selector').val('risk').trigger('change');
        updateCircleColors('risk', selectedCircles);
        updateLegend('risk');

      }

      function activateSelectedCircles(selectedCircles) {
        selectedCircles
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .attr('r', _enlargedCircleSize)
      }

      function deactivateSelectedCircles(selectedCircles) {
        selectedCircles
          .transition()
          .duration(1000)
          .style("opacity", 0.8)
          .attr('r', _regularCircleSize)
      }

      // ONBOARDING TOUR
      const tour = new Shepherd.Tour({
        useModalOverlay: true, // Enable modal overlay
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'tour',
          scrollTo: false
        }
      });

      const cancel = d3.select('.shepherd-cancel-icon');
      cancel.textContent = '✕';

      $(document).on("click", '.shepherd-cancel-icon', function () {
        onTourComplete();
      });

      $(document).on("click", '.howto', function () {
        tour.show(0, true);
      });

      function triggerMouseover(selector, tooltip) {
        const element = document.querySelector(selector);
        if (element) {
          // Get the bounding box of the SVG element
          const bbox = element.getBBox();

          // Get the position of the SVG in the viewport
          const svgPosition = element.ownerSVGElement.getBoundingClientRect();

          // Calculate the position of the tooltip
          // Add window's scroll offset to account for scrolling
          const tooltipLeft = svgPosition.left + window.scrollX + bbox.x + bbox.width / 2;
          const tooltipTop = svgPosition.top + window.scrollY + bbox.y + bbox.height / 2;

          //console.log(`Tooltip position on triggered: ${tooltipLeft}, ${tooltipTop}`);

          tooltip
            .style("left", tooltipLeft + "px")
            .style("top", tooltipTop + "px")
            .transition()
            .duration(10)
            .style("opacity", 0.95);

          // Dispatch a mouseover event
          const event = new MouseEvent('mouseover', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          element.dispatchEvent(event);
        }
      }

      function updateTooltipOnMouseover(selector, tooltip) {
        const element = document.querySelector(selector);
        if (!element) return;

        // Attach a mouseover event listener to the element
        element.addEventListener('mouseover', function (event) {
          // Get the bounding box of the SVG element
          const bbox = element.getBBox();

          // Get the position of the SVG in the viewport
          const svgPosition = element.ownerSVGElement.getBoundingClientRect();

          // Calculate the position of the tooltip
          const tooltipLeft = svgPosition.left + window.scrollX + bbox.x + bbox.width / 2;
          const tooltipTop = svgPosition.top + window.scrollY + bbox.y + bbox.height / 2;

          // Update the tooltip position
          tooltip
            .style("left", tooltipLeft + "px")
            .style("top", tooltipTop + "px")
            .style("opacity", 0.95); // Or any other style updates needed

          //console.log(`Updated tooltip position: ${tooltipLeft}, ${tooltipTop}`);
        });
      }

      function triggerClick(selector) {
        const element = document.querySelector(selector);
        if (element) {
          // Create a click event
          const clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });

          // Dispatch the event
          element.dispatchEvent(clickEvent);
        }
      }



      function onTourComplete() {
        //console.log("Tour completed!");
        enableClickOnCircles();
        enableMouseOver();
        // Additional completion logic can be placed here
      }

      // Add the first step
      tour.addStep({
        title: 'Hint 1 of 5',
        text: '<p>This chart displays hundreds of facial recognition uses <span class="similar-use-1"></span> <br> They are grouped by how risky and similar they are.</p><p>Uses that are close together are more alike <span class="similar-use-1"></span><span class="similar-use-2"></span></p>',
        attachTo: {
          element: null,
          on: 'bottom'
        },

        modalOverlayOpeningPadding: 12,
        modalOverlayOpeningRadius: 12,
        highlightClass: "highlight-guideline",
        buttons: [
          {
            action() {
              return this.next();
            },
            text: '→',
            classes: 'onboarding-button onboarding-next'
          }
        ],
        id: 'step1'
      });

      tour.addStep({
        title: 'Hint 2 of 5',
        text: 'Move your mouse over a use to see what it involves.',
        attachTo: {
          element: '#circle3',
          on: 'left'
        },
        modalOverlayOpeningPadding: 10,
        modalOverlayOpeningRadius: 20,
        highlightClass: "highlight-guideline",
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: 'onboarding-button onboarding-back',
            text: '←'
          },
          {
            action() {
              resetTooltip();
              return this.next();
            },
            text: '→',
            classes: 'onboarding-button onboarding-next'
          }
        ],
        id: 'step2',
        when: {
          show: function () {
            updateTooltipOnMouseover('#circle3', tooltip);
            hoverOverCard();
            closeAnyOpenCard();
          }
        },
      });

      function hoverOverCard() {
        triggerMouseover('#circle3', tooltip)
      };

      // Add the first step
      tour.addStep({
        title: 'Hint 3 of 5',
        text: '<p>Click on a use to view an impact assessment card that explains its benefits, risks, and ways you can act to mitigate those risks.</p>',
        attachTo: {
          element: '#circle63',
          on: 'left'
        },
        modalOverlayOpeningPadding: 1200,
        modalOverlayOpeningRadius: 12,
        highlightClass: "highlight-guideline",
        buttons: [
          {
            action() {
              closeAnyOpenCard();
              resetTooltip();
              return this.back();

            },
            classes: 'onboarding-button onboarding-back',
            text: '←'
          },
          {
            action() {
              closeAnyOpenCard();
              return this.next();

            },
            text: '→',
            classes: 'onboarding-button onboarding-next'
          }
        ],
        id: 'step3',
        when: {
          show: function () {
            resetTooltip();
            triggerClick('#circle63');
          }
        },
      });

      // Add the first step
      tour.addStep({
        title: 'Hint 4 of 5',
        text: 'Use the search bar to find uses that interest you.',
        attachTo: {
          element: '.searchbar',
          on: 'bottom'
        },
        modalOverlayOpeningPadding: 12,
        modalOverlayOpeningRadius: 12,
        highlightClass: "highlight-guideline",
        buttons: [
          {
            action() {
              triggerClick('#searchbar');
              return this.back();
            },
            classes: 'onboarding-button onboarding-back',
            text: '←'
          },
          {
            action() {
              triggerClick('#searchbar');
              return this.next();
            },
            text: '→',
            classes: 'onboarding-button onboarding-next'
          }
        ],
        id: 'step4',
        when: {
          show: function () {
            resetTooltip();
            triggerClick('#searchbar');
          }
        },
      });


      // Add the last step
      tour.addStep({
        title: 'Hint 5 of 5',
        text: 'You can also color and filter the uses based on their properties.',
        attachTo: {
          element: '.dropdown',
          on: 'top'
        },
        modalOverlayOpeningPadding: 12,
        modalOverlayOpeningRadius: 12,
        highlightClass: "highlight-guideline",
        buttons: [
          {
            action() {
              triggerClick('#dropdown');
              return this.back();
            },
            classes: 'onboarding-button onboarding-back',
            text: '←'
          },
          {
            action() {
              triggerClick('#dropdown');
              tour.complete(); // Complete the tour
              onTourComplete(); // Then call your completion logic
              return this.next();
            },
            classes: 'onboarding-button-final',
            text: 'Got it, let&apos;s start',
          }
        ],
        id: 'step5',
        when: {
          show: function () {
            resetTooltip();
            triggerClick('#dropdown');
          }
        },
      });

      function countSDGsAndHumanRightsById(circleId, data) {
        const circleData = data.find(circle => circle.id === circleId);
        if (!circleData) {
            console.error(`Circle with ID ${circleId} not found.`);
            return { SDGs: 0, humanRights: 0 };
        }
    
        let SDGCount = 0;
        let humanRightsCount = 0;
    
        circleData.risks.forEach(riskCategory => {
            riskCategory.forEach(risk => {
                SDGCount += risk.SDGs.length;
                humanRightsCount += risk['Human Rights affected by risk'].length;
            });
        });
    
        return { SDGs: SDGCount, humanRights: humanRightsCount };
    }

    function colorCirclesByImpact(circleId, data) {
      const circle = document.getElementById(circleId);
      if (!circle) {
          console.error(`Circle with ID ${circleId} not found.`);
          return;
      }
  
      const { SDGs, humanRights } = countSDGsAndHumanRightsById(circleId, data);
  
      if (SDGs > humanRights) {
          circle.setAttribute('fill', 'green');
      } else if (humanRights > SDGs) {
          circle.setAttribute('fill', 'blue');
      } else {
          // You can define a default color if the counts are equal
          circle.setAttribute('fill', 'gray');
      }
  }

  colorCirclesByImpact("#circle14", data)
    
    
      /* SCROLLAMA EVEN HANDLERS */
      function handleStepEnter(response) {
        // response = { element, direction, index }
        // console.log(response);
        let currentIndex = response.index;
        let currentDirection = response.direction;

        //console.log(currentIndex);

        // Add color to current step only
        step.classed("is-active", function (d, i) {
          return i === response.index;
        });
        // update graphic based on step
        switch (currentIndex) {
          case 0:
            disableClickOnCircles();
            if (currentDirection == 'up') {
              deactivateDailyUses();
              closeAnyOpenCard();
            }
            break;
          case 1:
            activateDailyUses();
            disableClickOnCircles();
            //enableMouseOver();
            if (currentDirection == 'up') {
              //console.log("going up")
              activateDailyUses();
              resetTSNE();
              closeAnyOpenCard();
            }
            break;
          case 2:
            splitToRisks();
            deactivateDailyUses();
            disableClickOnCircles();
            disableMouseOver();
            if (currentDirection == 'up') {
              hideLegend();
              closeAnyOpenCard();
              deactivateSelectedCircles(selectedCircles);
              resetTooltip();
            }
            break;
          case 3:
            activateRiskyUses();
            //applyGradient(svg, data);

            if (currentDirection == 'up') {
              resetTooltip();
              tour.cancel();
            }
            break;
          case 4:
            enableClickOnCircles();
            enableMouseOver();
            showLegend();
            activateSelectedCircles(selectedCircles);
            if (currentDirection == 'down') {
              //tour.start();
            }
            if (currentDirection == 'up') {
              tour.cancel();
              resetTooltip();
            }
            break;
          default:
            break;
        }
      }

      function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
          .setup({
            step: "#scrolly article .step",
            offset: 0.50,
            debug: false
          })
          .onStepEnter(handleStepEnter);
      }

      // Initiate scrollytelling
      init();

      // Fuse.js options for fuzzy searching
      const fuseOptions = {
        includeScore: true,
        threshold: 0.3, // Adjust this threshold to control the fuzziness
        keys: ["domain", "details", "group"] // Specify the keys in your data to search
      };

      // Initialize fuse with atlas data
      let fuse = new Fuse(data, fuseOptions);

      // Function to animate circles based on search
      function animateCircles(searchResults) {
        svg.selectAll('circle')
          .transition()
          .duration(1000)
          .attr('r', d => {
            const isMatched = searchResults.some(result => result.item.id === d.id);
            return isMatched ? _enlargedCircleSize : _regularCircleSize; // Enlarge if matched, else return to normal size
          })
          .style('opacity', d => {
            const isMatched = searchResults.some(result => result.item.id === d.id);
            return isMatched ? 0.8 : 0.2; // Enlarge if matched, else return to normal size
          });
      }

      /* RESET SEARCH BAR */
      d3.select("#search").on("input", function () {
        const searchQuery = d3.select(this).property("value");
        const results = fuse.search(searchQuery);

        // Animate circles based on the search results
        if (searchQuery.length > 0) {
          animateCircles(results);
        } else {
          resetCircles();
          activateSelectedCircles(selectedCircles);
        }
      });

      /* CLOSE SEARCH */
      d3.select('#clearSearch').on('click', function () {
        d3.select('#search').property('value', '');
        resetCircles();
        activateSelectedCircles(selectedCircles);
      });

    });


    // DROPDOWN
    // List of properties with labels and values for the dropdown
    const properties = [
      { label: "Risk as per EU AI Act", value: "risk" },
      { label: "Deployment chances", value: "realism" },
      { label: "Impact on critical infrastructure", value: "criticalInfrastructureSectors" },
      { label: "Impact on children", value: "involvingMinor" },
      { label: "Impact on entertainment", value: "entertainmentIndustry" },
      { label: "Impact on public sector", value: "entertainmentIndustry" },
    ];
    const colorMaps = {
      "realism": {
        "Already existent": "DarkMagenta",
        "Upcoming": "HotPink"
      },
      "risk": {
        "High Risk": "Crimson",
        "Low Risk": "RoyalBlue",
      },
      "type_EntitySubject": {
        "Group of individuals": "PaleTurquoise",
        "Environment": "Teal"
      },
      "criticalInfrastructureSectors": {
        "Yes": "SteelBlue",
        "No": "Gold",
      },
      "involvingMinor": {
        "Yes": "SteelBlue",
        "Maybe": "rgb(150, 201, 199)",
        "No": "Gold",
      },
      "entertainmentIndustry": {
        "Yes": "SteelBlue",
        "Maybe": "rgb(150, 201, 199)",
        "No": "Gold",
      },
      "entertainmentIndustry": {
        "Yes": "SteelBlue",
        "Maybe": "rgb(150, 201, 199)",
        "No": "Gold",
      }
    };

    function updateCircleColors(selectedValue, selectedCircles) {
      // Select all circles and update their color

      d3.selectAll("circle.uses")
        .transition() // Start the transition
        .duration(500) // Duration of the transition in milliseconds
        //.attr('r', d => d.risks && d.risks.length > 0 ? _enlargedCircleSize : _regularCircleSize)
        //.style('opacity', d => d.risks && d.risks.length > 0 ? 0.8 : 0.2)
        .attr("fill", function (d) {
          // Use the appropriate colorMap based on the selectedValue and the value of the property in the data
          let colorMap = colorMaps[selectedValue];
          let color = colorMap && colorMap[d[selectedValue]] ? colorMap[d[selectedValue]] : "silver"; // Default color if no mapping found
          let correspondingLabel = d3.select(this.nextElementSibling);
          if (colorMap && colorMap[d[selectedValue]]) {
            correspondingLabel.attr('fill', 'white'); // Set label color to white if mapping is found
          } else {
            correspondingLabel.attr('fill', 'black'); // Keep existing color (or set a different default color) if no mapping
          }
          return color;
        })
    }

    function updateLegend(selectedValue) {
      const legendData = colorMaps[selectedValue];
      const legendContainer = d3.select('#legend-container');

      legendContainer.selectAll('div.legend-item').remove();

      const legend = legendContainer.selectAll('div.legend-item')
        .data(Object.entries(legendData), d => d[0])
        .enter()
        .append('div')
        .attr('class', 'legend-item')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin-right', '10px')
        .on('click', function (d) { // Add click event listener
          toggleCircleVisibility(d[0], selectedValue);
          //toggleCircleGroup(d[0], selectedValue);
        })


        .on('mouseover', function (d) { // Add click event listener
          highlightCircles(d[0], selectedValue);
        })
        .on('mouseout', function (d) { // Add click event listener
          let circles = d3.selectAll('circle.uses');
          circles.style('opacity', 0.8); // Reset the opacity of all circles
        })

      legend
        .append('div')
        .attr('class', 'span-wrapper')
        .append('span')
        .attr('class', 'span-legend')
        .style('background-color', d => d[1]);

      legend.append('p')
        .style('margin-left', '8px')
        .text(d => d[0]);

      function toggleCircleGroup(category, selectedValue) {
        //console.log(category, selectedValue);
        toggleStates[category] = !toggleStates[category];
        let circles = d3.selectAll('circle.uses');

        //let texts = d3.selectAll('.circle-label');
        let legendEntry = legendContainer.selectAll('div.legend-item')
          .filter(d => d[0] === category)

        let label = legendEntry.select('span.span-legend');

        // Change circle size based on the toggle state
        if (toggleStates[category]) {

          // Increase the opacity
          circles.filter(d => d[selectedValue] === category)
            .transition()
            .duration(250)
            .style('opacity', 1)
          //.attr('r', d => _enlargedCircleSize); // Increase radius

          // Update the legend toggle indicator
          label
            .html(toggleStates[category] ? '&#9679;' : '') // Toggle text in span
            .transition()
            .duration(250)
            .style("outline", "1.5px solid black")
            .style('opacity', 1)

        } else {
          // Reset the circle radius to its initial value
          circles.filter(d => d[selectedValue] === category)
            .transition()
            .duration(250)
            .style('opacity', 0.7)

          // Update the legend toggle indicator (example: revert color)
          label
            .html('') // Toggle text in span
            .transition()
            .duration(250)
            .style("outline", "0px solid black")
            .style('opacity', 0.7)

        }
      }


      // Initialize visibility states
      Object.keys(legendData).forEach(key => {
        visibilityStates[key] = true; // Initially all categories are visible
      });

      // Define a function to toggle circle visibility
      function toggleCircleVisibility(category, selectedValue) {
        // Toggle the state
        visibilityStates[category] = !visibilityStates[category];
        //console.log(visibilityStates);
        // Define the new visibility
        let newVisibility = visibilityStates[category] ? 'visible' : 'hidden';

        // Select and update circles and texts
        d3.selectAll('circle.uses')
          .filter(d => d[selectedValue] === category)
          .style('visibility', newVisibility);

        d3.selectAll('.circle-label')
          .filter(d => d[selectedValue] === category)
          .style('visibility', newVisibility);

        // Update legend item
        legendContainer.selectAll('div.legend-item')
          .filter(d => d[0] === category)
          .select('span')
          .style('visibility', newVisibility)
        //.style("outline", "10px solid black")
      }


    }

    // HIGHLIGHT CIRCLES ON HOVER
    function highlightCircles(label, selectedValue) {
      let visibleCircles = d3.selectAll('circle.uses').filter(function () {
        // Get the computed style of the current circle
        let style = window.getComputedStyle(this);
        // Check if the visibility property is 'visible'
        return style.visibility === 'visible';
      });

      let visibleLabels = d3.selectAll('.circle-label').filter(function () {
        // Get the computed style of the current circle
        let style = window.getComputedStyle(this);
        // Check if the visibility property is 'visible'
        return style.visibility === 'visible';
      });

      let invisibleCircles = d3.selectAll('circle.uses').filter(function () {
        // Get the computed style of the current circle
        let style = window.getComputedStyle(this);
        // Check if the visibility property is 'visible'
        return style.visibility === 'hidden';
      });

      let invisibleCirclesValue = invisibleCircles.filter(d => d[selectedValue] == label)
      let invNum = invisibleCirclesValue["_groups"][0].length;

      visibleCircles.style('opacity', 0.8); // Reset the opacity of all circles
      visibleLabels.style('opacity', 0.8); // Reset the opacity of all labels

      if (label && invNum == 0) {
        visibleCircles.filter(d => d[selectedValue] !== label)
          .style('opacity', 0.2); // opacity circles that don't match the label
        visibleLabels.filter(d => d[selectedValue] !== label)
          .style('opacity', 0.2); // opacity circles that don't match the label
      }
    }
  });

// Interactions to expand and collapse search box and color box
jQuery('.accordion-cell .accordion-toggle, .accordion-cell h4').click(function () {
  var accordionCell = jQuery(this).closest('.accordion-cell');
  var button = accordionCell.find('.accordion-toggle');

  if (accordionCell.hasClass('collapsed')) {
    accordionCell.removeClass('collapsed').addClass('expanded');
    accordionCell.siblings().removeClass('expanded').addClass('collapsed');

    // Change to '-' for expanded, only if it's not a 'howto' accordion
    if (!accordionCell.hasClass('howto')) {
      button.text('-');
    }

    // Change siblings back to right arrow, excluding 'howto' accordions
    accordionCell.siblings().not('.howto').find('.accordion-toggle').html('&#8594;');
  } else {
    accordionCell.toggleClass('expanded');
    accordionCell.siblings().toggleClass('collapsed');

    // Toggle text to left or right arrow based on state, excluding 'howto' accordions
    if (!accordionCell.hasClass('howto')) {
      button.html(accordionCell.hasClass('expanded') ? '&#8592;' : '&#8594;');
    }
  }
});


function isTablet() {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  return width >= 768 && width <= 1367; // Common tablet screen width range
}

if (isTablet()) {
  console.log("AAA")
  // Disable specific interactions for tablet devices
  d3.selectAll('circle.uses')
    .on('mouseover', null)
    .on('mouseenter', null);
}
