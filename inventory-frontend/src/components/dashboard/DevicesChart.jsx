import React, { useRef, useEffect } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        const centerX = ctx.canvas.width / 2
        const centerY = ctx.canvas.height / 2
        const radius = Math.min(centerX, centerY)

        const metallicGradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.3,
            centerX, centerY, radius * 1.0
        );

        metallicGradient.addColorStop(0, '#DDA853');
        metallicGradient.addColorStop(0.4, '#C69A4A');
        metallicGradient.addColorStop(0.6, '#B8863B');
        metallicGradient.addColorStop(1, '#8B6508');

        const cosmicGradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.1,
            centerX, centerY, radius * 1.2
          );
          
        cosmicGradient.addColorStop(0, '#00B4FF');
        cosmicGradient.addColorStop(0.4, '#0B3D91');
        cosmicGradient.addColorStop(0.8, '#0B1D51');
        cosmicGradient.addColorStop(1, '#050A20');

        const chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: data.labels,
            datasets: [{
              data: data.values,
              backgroundColor: [
                metallicGradient, cosmicGradient
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                align: "start",
                labels: {
                    color: "#333",
                    font: {
                        weight: "bold",
                    }
                }
              }
            }
          }
        });
        
        return () => chart.destroy();
      }
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export const DevicesChart = ({devices}) => {

    const deviceList = {
        registered: devices.filter(device => device.isRegistered).length,
        unregistered: devices.filter(device => !device.isRegistered).length
    }
  const chartData = {
    labels: ['Registered Devices', 'Unregistered Devices'],
    values: [3, 5],
    backgroundColors: ['#DDA853', '#0B1D51']
  };

  return <PieChart data={chartData} />;
};