// var chart = new SmoothieChart({interpolation:'bezier', labels: {disabled:false}}),
//   canvas = document.getElementById('smoothie-chart'),
//   audioChart = new TimeSeries(),
//   videoChart = new TimeSeries();
//
// setInterval(function() {
//   //console.log('statistiche: ' +_statistics.audio+' '+_statistics.video );
//   audioChart.append(new Date().getTime(), _statistics.instant_audio);
//   videoChart.append(new Date().getTime(), _statistics.instant_video);
// }, 1000);
//
// chart.addTimeSeries(audioChart, {lineWidth:2, strokeStyle:'#98BD29', fillStyle: 'rgba(152,189,41,0.30)'});
// chart.addTimeSeries(videoChart, {lineWidth:2, strokeStyle:'#37ABDA', fillStyle: 'rgba(55,171,218,0.30)'});
// chart.streamTo(canvas, 500);
