import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
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

export const barData = (labelArr, dataArr) => {
  return {
    labels: labelArr,
    datasets: [
      {
        label: "ยอดขายต่อเดือน (บาท)", // เพิ่มคำอธิบายที่เป็นภาษาไทย
        data: dataArr,
        backgroundColor: "rgba(18, 34, 239, 0.7)", // สีฟ้าอ่อนสำหรับแท่งกราฟ
        borderColor: "rgba(18, 34, 239, 1)", // สีฟ้าเข้มสำหรับขอบแท่ง
        borderWidth: 1,
        hoverBackgroundColor: "rgba(18, 34, 239, 0.9)", // สีเข้มขึ้นเมื่อ hover
        hoverBorderColor: "rgba(18, 34, 239, 1.2)",
      },
    ],
  };
};

export const barOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    datalabels: {
      display: function (context) {
        // แสดง datalabel เฉพาะเมื่อค่าไม่เท่ากับ 0
        return context.dataset.data[context.dataIndex] !== 0;
      },
      color: "#000",
      anchor: "end",
      align: "top",
      formatter: (value) => value.toLocaleString(),
      font: {
        weight: "bold",
        size: 12,
      },
    },
    tooltip: {
      callbacks: {
        title: function (tooltipItems) {
          return tooltipItems[0].label;
        },
        label: function (tooltipItem) {
          return `ยอดขาย: ${tooltipItem.formattedValue} บาท`;
        },
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      titleFont: { size: 16, weight: "bold" },
      bodyFont: { size: 14 },
      cornerRadius: 4,
      padding: 10,
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12,
        },
        color: "#000",
        maxRotation: 0,
        minRotation: 0,
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#000",
        callback: function (value) {
          return value.toLocaleString();
        },
      },
      grid: {
        color: "rgba(200, 200, 200, 0.2)",
      },
    },
  },
};
