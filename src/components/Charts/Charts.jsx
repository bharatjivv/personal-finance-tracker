/* eslint-disable no-unused-vars */
import React from "react";
import "./styles.css";
import { Line, Pie } from "@ant-design/charts";

const Charts = ({ sortedTransactions }) => {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const config = {
    data,
    xField: "date",
    yField: "amount",
    width: 800,
    height: 400,
  };
  

  const spendingData = sortedTransactions.filter((transaction) => {
    if(transaction.type == "expense") {
      return { tag: transaction.tag, amount : transaction.amount}
    }
  });
  
  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if(!acc[key]) {
      acc[key] = {tag : obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});
  
  const spendingconfig = {
    data: Object.values(finalSpendings),
    angleField: "amount",
    colorField: "tag",
    width: 400,
    height: 300,
  };

  let chart;
  let pieChart;
  return (
    <div className="charts-wrapper">
      <div className="chart-box">
        <h2>Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>{" "}
      <div className="chart-box">
        <h2>Your Spendings</h2>
        <Pie {...spendingconfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
      </div>
    </div>
  );
};

export default Charts;
