new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      // labels: ["진행", "완료"],
      datasets: [
        {
          //label: "Population (millions)",
          backgroundColor: ["#1B6DFA", "#2DB9BC"],
          data: [42,8]
        }
      ]
    },
    options: {
      responsive: false,
      tooltips: {// 툴팁삭제
        enabled:false
      },
      animation: {//차트 애니메이션 사용 안 함
        duration: 0
      }
    }
});
// var chart;
// function doughnutChart(data){
//   //도넛 그래프 옵션
//   var doughnutChart = {
//     tooltips: {//툴팁삭제
//         enabled: false
//       },
//       legend: {//범례삭제
//         display: false
//       },
//       plugins: {
//         datalabels: {
//           formatter: (value, ctx) => {
//             let datasets = ctx.chart.data.datasets[0].data;
//             if (value!=0){
//               let sum = 0;
//               dataArr = ctx.chart.data.datasets[0].data;
//               dataArr.map(data => {
//                 sum += parseInt(data);
//               });
//               let percentage = Math.round((value*100 / sum))+"건";
//               return percentage;
//             }else {
//               let percentage = "";
//               return percentage;
//             }
//           },
//           color:'#fff'
//         }
//       }
//   };
//   var data = {
//     type:'doughnut',
//     data: {
//       labels: ['진행', '완료'],
//       datasets: [{
//         data: ['42', '6'],
//         backgroundColor: ['#1B6DFA', '#2DB9BC']
//       }],
//     },
//     options: doughnutOptions
//   };
//   if (chart) {
//     chart.destroy();
//     chart = new chart($('#doughnut-chart'), data);
//   }else {
//     chart = new chart($('#doughnut-chart'), data);
//   }
//   $("#js").html(chart.generateLegend());
// }