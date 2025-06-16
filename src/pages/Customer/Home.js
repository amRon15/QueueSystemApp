import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Home.css";

export default function Home() {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [myTicket, setMyTicket] = useState(null);

  const fetchCurrentTicket = async () => {
    try {
      const res = await api.get("customer/checkTicket");
      setCurrentTicket(res.data.ticketNumber);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentTicket();
    // const fetchCurrent = async () => {
    //   try {
    //     const res = await api.get("/customer/checkTicket");
    //     setCurrentTicket(res.data.ticketNumber);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };
    // fetchCurrent();
    // const timer = setInterval(fetchCurrent, 5000);
    // return () => clearInterval(timer);
  }, []);

  const handleGetTicket = async () => {
    try {
      const res = await api.post("customer/getTicket");
      setMyTicket(res.data.ticketNumber);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelTicket = async () => {
    try {
      const res = await api.put(`customer/cancelTicket/${myTicket}`);

      if (res.status === 200) {
        setMyTicket(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="ticket-container">
        <p>
          現在號碼: <strong>{currentTicket ?? "尚未有號碼"}</strong>
        </p>
        <p>
          你的號碼: <strong>{myTicket ?? "尚未領取號碼"}</strong>
        </p>
      </div>
      <button onClick={handleGetTicket}>領取號碼</button>
      <button onClick={handleCancelTicket}>取消我的號碼</button>
    </div>
  );
}
