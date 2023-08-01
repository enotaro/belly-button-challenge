// Store link to provided URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Begin creating both bar and bubble graphs
function drawCharts(id) {

    // Read in the JSON data
    d3.json(url).then(function(data){

        let samples = data.samples.filter(item => item.id == id);
        let chooseSample = samples[0];
        
        // Store values from each sample
        let ids = chooseSample.otu_ids;
        let labels = chooseSample.otu_labels;
        let values = chooseSample.sample_values;
        
        // Find values for bar graph
        let dataBar = {
            x: values.slice(0,10).reverse(),
            y: ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
        };

        // Set up layout for bar graph
        let layoutBar = {
            height: 500,
            width: 500,
            barmode: "group",
        };

        // Create the bar graph with plotly
        Plotly.newPlot("bar", [dataBar], layoutBar);

        // Find values for bubble chart
        let bubbleData = {
            x: ids,
            y: values,
            mode: "markers",
            marker:{
                size: values,
                color: ids
    
            },
            text: labels
        }

        // Set up layout for bubble chart
        let bubbleLayout = {
            width: 1000,
            height: 500,
        };

        // Create the bubble chart with plotly
        Plotly.newPlot("bubble", [bubbleData], bubbleLayout)
    })
}

// Fetch demographic info
function showDemographics(id) {

    // Read in the JSON data
    d3.json(url).then(function(item){

        let metadata = item.metadata;

        selectedID = metadata.filter(item => item.id == id);
        let chooseSample = selectedID[0];

        let panel = d3.select("#sample-metadata");
        panel.html("");

        Object.entries(chooseSample).forEach(([key,value]) =>{
            panel.append('div').text(`${key}: ${value}`);
        })
    })
}

function init() {
    // Read in the JSON data from the specified URL
    d3.json(url)
        .then(function(data) {
            // Get the list of names from the JSON data
            let list = data.names;

            // Select the dropdown element and populate it with options
            let dropdown = d3.select("#selDataset");
            dropdown.selectAll("option").remove(); // Clear previous options (if any)
            for (let i = 0; i < list.length; i++) {
                dropdown
                    .append("option")
                    .text(list[i])
                    .property("value", list[i]);
            }

            // Find the first sample of data and create charts and demo info for it
            let firstSample = list[0];
            drawCharts(firstSample); 
            showDemographics(firstSample); 
        })
    }
    
// Create options for dropdown menu
function choice(id){
    drawCharts(id);
    showDemographics(id);
};

init();