import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [waitingTicket, setWaitingTicket] = useState({});
  const [skippedTicket, setSkippedTicket] = useState({});

  const fetchCurrentTicket = async () => {
    try {
      const res = await api.get("customer/checkTicket");
      setCurrentTicket(res.data.ticketNumber);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWaitingTicket = async () => {
    try {
      const res = await api.get("staff/getAllWaitingTicket");
      const tickets = res.data.waitingTickets;
      const dict = tickets.reduce((acc, ticket) => {
        acc[ticket._id] = ticket;
        return acc;
      }, {});
      setWaitingTicket(dict);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSkippedTicket = async () => {
    try {
      const res = await api.get("staff/getAllSkippedTicket");
      const tickets = res.data.skippedTickets;
      const dict = tickets.reduce((acc, ticket) => {
        acc[ticket._id] = ticket;
        return acc;
      }, {});
      setSkippedTicket(dict);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentTicket();
    fetchWaitingTicket();
    fetchSkippedTicket();
  }, []);

  //onclick skipped to called
  const handleSkippedTicket = (ticket) => {
    try {
      // const res = await api.put(`staff/`)
    } catch (err) {
      console.error(err);
    }
  };

  //func for onclick to skip ticket

  const nextTicket = async () => {
    try {
      const res = await api.put("staff/next");

      if (res.status === 200) {
        setCurrentTicket(res.data.ticketNumber);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <p className="ticket-container-title">正在等候的號碼: </p>
      <div className="waiting-ticket-container">
        {Object.values(waitingTicket).map((ticket) => (
          <p>{ticket.ticketNumber}</p>
        ))}
      </div>
      <p className="ticket-container-title">暫時跳過的號碼:</p>
      <div className="skipped-ticket-container">
        {Object.values(skippedTicket).map((ticket) => (
          <button key={ticket._id} onClick={() => handleSkippedTicket(ticket)}>
            {ticket.ticketNumber}
          </button>
        ))}
      </div>
      <p>
        現在號碼: <strong>{currentTicket ?? "尚未有號碼"}</strong>
      </p>
      <button onClick={nextTicket}>呼叫下一個號碼</button>
    </div>
  );
}
