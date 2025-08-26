import React from "react";
import "./styles.css";
import { Row, Card } from "antd";
import Button from "../Button/Button";

const Cards = ({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance,
}) => {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card">
          <h3>Current Balance</h3>
          <p>${totalBalance}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>
        <Card className="my-card">
          <h3>Total Income</h3>
          <p>${income}</p>

          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className="my-card">
          <h3>Total Expenses</h3>
          <p>${expense}</p>

          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
};

export default Cards;
