/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Cards from "../components/Cards/Cards";
import AddExpenseModal from "../components/Modals/AddExpenseModal";
import AddIncomeModal from "../components/Modals/AddIncomeModal";
import { addDoc, collection, query, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../components/TransactionsTable/TransactionTable";
import Charts from "../components/Charts/Charts";
import  NoTransaction  from "../components/NoTransaction/NoTransaction";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // To be deleted later
  // console.log("empty ruleset", transactions);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
    // to be deleted later
    // console.log(
    //   "income >>",
    //   income,
    //   "expense",
    //   expense,
    //   "totalBalance",
    //   totalBalance
    // );
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      // console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");

      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        if (!many) toast.error("Couldn't add transaction");
      }
    }
  }
  // console.log(transactions);

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
      // console.log("Transactionsarr array : ", transactionsArray);
    }
    setLoading(false);
  }


  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  })




  return (
    <div>
      <Header />
      {loading ? (
        <>
          <p>Loading... </p>
        </>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            handleExpenseCancel={handleExpenseCancel}
            handleIncomeCancel={handleIncomeCancel}
          />
          {transactions.length != 0 ? <Charts sortedTransactions={sortedTransactions}/> : <NoTransaction />}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable
            transaction={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
