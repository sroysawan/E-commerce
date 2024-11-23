import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Colors,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const pieData = (labelArr, dataArr) => {
  return {
    labels: labelArr,
    datasets: [
      {
        data: dataArr,
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };
};

// ตัวเลือกสำหรับ Pie Chart
export const pieOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 30, // ขนาดของกล่องสีที่แสดงใน legend
        padding: 30, // ระยะห่างระหว่างแต่ละรายการ legend (เพิ่มหรือลดตามความเหมาะสม)
        boxHeight: 20,
        font: {
          size: 16,
        },
        color: "#000",
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          // แสดงเฉพาะ label (ชื่อหมวดหมู่)
          return tooltipItem.label;
          // แสดงชื่อเต็มใน tooltip พร้อมจำนวนที่ขายได้
          // return `${tooltipItem.label}: ${tooltipItem.raw} ชิ้น`;
        },
      },
    },
    datalabels: {
      color: "black",
      formatter: (value, context) => {
        const data = context.dataset.data;
        const total = data.reduce((sum, val) => sum + val, 0);
        const percentage = ((value / total) * 100).toFixed(2) + "%";

        // ตรวจสอบว่าค่าเป็น 0 หรือไม่ ถ้าใช่ให้ return ค่าว่าง
        return value === 0 ? "" : percentage;
      },
      anchor: "center",
      align: "center",
    },
  },
  layout: {
    padding: 10, // ระยะห่างภายในของกราฟ
  },
};
