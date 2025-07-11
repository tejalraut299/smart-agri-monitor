
const data = {
  time: [],
  temperature: [],
  soilMoisture: [],
  humidity: [],
  light: []
};
const MAX_POINTS = 10;
function createChart(ctx, label, color) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color + '33',
        fill: true
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: false } } }
  });
}
const tempChart = createChart(document.getElementById('tempChart').getContext('2d'), 'Temperature (°C)', 'rgba(255,99,132,1)');
const moistureChart = createChart(document.getElementById('moistureChart').getContext('2d'), 'Soil Moisture (%)', 'rgba(54,162,235,1)');
const humidityChart = createChart(document.getElementById('humidityChart').getContext('2d'), 'Humidity (%)', 'rgba(255,206,86,1)');
const lightChart = createChart(document.getElementById('lightChart').getContext('2d'), 'Light Intensity (lux)', 'rgba(75,192,192,1)');
function generateSensorData() {
  return {
    temperature: +(24 + Math.random() * 4).toFixed(1),
    soilMoisture: +(40 + Math.random() * 10).toFixed(1),
    humidity: +(60 + Math.random() * 5).toFixed(1),
    light: +(300 + Math.random() * 50).toFixed(1),
    time: new Date().toLocaleTimeString()
  };
}
function updateDashboard() {
  const newData = generateSensorData();
  ['temperature', 'soilMoisture', 'humidity', 'light', 'time'].forEach(key => {
    data[key].push(newData[key]);
    if (data[key].length > MAX_POINTS) data[key].shift();
  });
  tempChart.data.labels = data.time;
  tempChart.data.datasets[0].data = data.temperature;
  tempChart.update();
  moistureChart.data.labels = data.time;
  moistureChart.data.datasets[0].data = data.soilMoisture;
  moistureChart.update();
  humidityChart.data.labels = data.time;
  humidityChart.data.datasets[0].data = data.humidity;
  humidityChart.update();
  lightChart.data.labels = data.time;
  lightChart.data.datasets[0].data = data.light;
  lightChart.update();
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = `
    <tr><td>Temperature</td><td>${newData.temperature} °C</td><td>${newData.temperature > 27 ? '⚠ High' : '✅ OK'}</td></tr>
    <tr><td>Soil Moisture</td><td>${newData.soilMoisture} %</td><td>${newData.soilMoisture < 42 ? '⚠ Low' : '✅ OK'}</td></tr>
    <tr><td>Humidity</td><td>${newData.humidity} %</td><td>✅ OK</td></tr>
    <tr><td>Light</td><td>${newData.light} lux</td><td>✅ OK</td></tr>
  `;
}
document.getElementById('downloadCsv').addEventListener('click', () => {
  let csv = 'Time,Temperature,Soil Moisture,Humidity,Light\n';
  for (let i = 0; i < data.time.length; i++) {
    csv += `${data.time[i]},${data.temperature[i]},${data.soilMoisture[i]},${data.humidity[i]},${data.light[i]}\n`;
  }
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'sensor_data.csv';
  link.click();
});
document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
});
setInterval(updateDashboard, 2000);
updateDashboard();
