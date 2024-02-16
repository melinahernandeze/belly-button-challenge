 // Function to fetch data from samples.json
 function getPlots(id) {
    //Read samples.json
    d3.json("samples.json").then(sampledata => {
      var samples = sampledata.samples;
      var metadata = sampledata.metadata;

      // Filter sample data by id
      var selectedSample = samples.find(sample => sample.id === id);

    // Bar chart
    var barChart = d3.select("#bar");
    barChart.html(""); // Clear previous chart

    var top10Values = selectedSample.sample_values.slice(0, 10).reverse();
    var top10Labels = selectedSample.otu_ids.slice(0, 10).map(label => `OTU ${label}`).reverse();
    var top10HoverText = selectedSample.otu_labels.slice(0, 10).reverse();

    var trace = {
      x: top10Values,
      y: top10Labels,
      text: top10HoverText,
      type: "bar",
      orientation: "h"
    };

    var data = [trace];

    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
      }
    };

      Plotly.newPlot("bar", data, layout);

      // Bubble chart
      var trace1 = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: 'markers',
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids
        }
      };

      var data1 = [trace1];

      var layout1 = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        xaxis: { title: "OTU ID" },
        height: 600,
        width: 1000
      };

      Plotly.newPlot('bubble', data1, layout1);
    });
  }

  // Function to display demographic information
  function getDemoInfo(id) {
    d3.json("samples.json").then(data => {
      var metadata = data.metadata;
      var result = metadata.find(entry => entry.id.toString() === id);

      var demographicInfo = d3.select("#sample-metadata");
      demographicInfo.html("");

      Object.entries(result).forEach(([key, value]) => {
        demographicInfo.append("p").text(`${key}: ${value}`);
      });
    });
  }

  // Function to update charts and demographic info on dropdown change
  function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
  }

  // Function to initialize page
  function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("samples.json").then(data => {
      data.names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
      });

      var initialSampleId = data.names[0];
      getPlots(initialSampleId);
      getDemoInfo(initialSampleId);
    });
  }

  init();