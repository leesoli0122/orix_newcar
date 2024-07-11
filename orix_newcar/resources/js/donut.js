new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      //labels: ["Africa", "Asia"],
      datasets: [
        {
          //label: "Population (millions)",
          backgroundColor: ["#1B6DFA", "#2DB9BC"],
          data: [42,8]
        }
      ]
    }
}); 