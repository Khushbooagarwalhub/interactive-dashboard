function buildMetadata(sample) {

 // @TODO: Complete the following function that builds the metadata panel
//Use `d3.json` to fetch the metadata for a sample
  var url_meta = `/metadata/${sample}`;

//Use d3 to select the panel with id of `#sample-metadata`
  var meta_sample = d3.select("#sample-metadata");

//Use `.html("") to clear any existing metadata
  meta_sample.html("");

// Use `Object.entries` to add each key and value pair to the panel
  
  d3.json(url_meta).then(function(sample) {
    console.log(sample);
    Object.entries(sample).forEach(([key,value]) => {
    meta_sample.append('h6').text(`${key}, ${value}`);
  })

 });

}


    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


 
function buildCharts(sample) {

//@TODO: Use `d3.json` to fetch the sample data for the plots
  var url_data = `/samples/${sample}`;
    d3.json(url_data).then(function(sampleData) {
//   @TODO: Build a Bubble Chart using the sample data
    console.log(sampleData);
    var otu_ids = sampleData.otu_ids;
    var sample_values = sampleData.sample_values;
    var otu_labels =sampleData.otu_labels;
    var colors = sampleData.otu_ids;
    console.log(otu_ids);
    var bubble_chart = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: colors,
        size: sample_values,
        //opacity: 0.8
      } 
  //,
  //  type: 'scatter'
    }];
    console.log(bubble_chart);
   

//var bubble_data = bubble_chart;
var layout = {
  xaxis: { title: "OTU ID"},
  yaxis: {title: "sample values"},
};

Plotly.newPlot('bubble',bubble_chart ,layout);

});

//     @TODO: Build a Pie Chart
//     HINT: You will need to use slice() to grab the top 10 sample_values,
//     otu_ids, and labels (10 each).
d3.json(url_data).then(function(sampleData) {
var values = sampleData.sample_values.slice(0,10);
var labels = sampleData.otu_ids.slice(0,10);
var hover =  sampleData.otu_labels.slice(0,10);
var pie_data = [{
  values:values,
  labels:labels,
  type: "pie"

}];

var layout = {
  height: 800,
  width: 600
};
console.log(pie_data);
Plotly.newPlot("pie", pie_data,layout);

});
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

// Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
    
  });
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
  buildMetadata(newSample);   
  buildCharts(newSample);
}
// Initialize the dashboard
init();
