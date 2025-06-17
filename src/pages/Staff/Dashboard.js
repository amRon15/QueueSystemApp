import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Dashboard.css";
import Logout from "../../Components/Logout";
import { socket } from '../../services/socket'

export default function Dashboard() {
  const [currentTicket, setCurrentTicket] = useState({});
  const [waitingTicket, setWaitingTicket] = useState([]);
  const [skippedTicket, setSkippedTicket] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCurrentTicket = async () => {
    try {
      const res = await api.get("customer/checkTicket");
      setCurrentTicket(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWaitingTicket = async () => {
    try {
      const res = await api.get("staff/getAllWaitingTicket");
      const tickets = res.data.waitingTickets;
      setWaitingTicket(tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSkippedTicket = async () => {
    try {
      const res = await api.get("staff/getAllSkippedTicket");
      const tickets = res.data.skippedTickets;
      setSkippedTicket(tickets);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentTicket();
    fetchWaitingTicket();
    fetchSkippedTicket();

    socket.on('newGetTicket', ticket => {
      setWaitingTicket(prev => [...prev, ticket])
    })

    return () => {
      socket.off('newGetTicket')
    }
  }, []);

  //onclick ticket to called
  const handleTicketCalled = async () => {
    try {
      const res = await api.put(`staff/ticketCalled/${currentTicket.ticketNumber}`);
      if (res.status === 200) {
        const newWaitingTickets = waitingTicket.filter(e => e.ticketNumber !== currentTicket.ticketNumber)
        setWaitingTicket(newWaitingTickets)
        setCurrentTicket(res.data)
        setMessage(`${currentTicket.ticketNumber}號客人已入座`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //onclick ticket from skipped to called
  const handleSkippedTicketCalled = async (ticket) =>{
    try{
      const res = await api.put(`staff/ticketCalled/${ticket.ticketNumber}`)
      if(res.status === 200){
        const newSkippedTickets = skippedTicket.filter(e => e.ticketNumber !== ticket.ticketNumber)
        setSkippedTicket(newSkippedTickets)
        setMessage(`跳過的${ticket.ticketNumber}號客人已入座`)
      }
    } catch(err){
      console.error(err)
    }
  }

  const handleNextTicket = async () => {
    try {
      if (currentTicket.status === "called" || !Object.keys(currentTicket).length) {
        nextTicket();
      } else {
        skipTicket();        
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function nextTicket() {
    try {
      const res = await api.put("staff/next");

      if (res.status === 200) {
        setCurrentTicket(res.data);
        const newWaitingTickets = waitingTicket.filter(e => e.ticketNumber !== currentTicket.ticketNumber)
        setWaitingTicket(newWaitingTickets)
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function skipTicket() {
    try {
      const res = await api.put(`staff/ticketSkipped/${currentTicket.ticketNumber}`);

      if (res.status === 200) {
        nextTicket();
        setMessage(`${currentTicket.ticketNumber}號已跳過`)
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <div className="top-bar">
        <h2>隊列控制面板</h2>
        <Logout />
      </div>
      <p className="ticket-container-title">正在等候的號碼: </p>
      <div className="waiting-ticket-container">
        {waitingTicket.length > 0 ? (
          waitingTicket.map((ticket) => <p key={ticket._id}>{ticket.ticketNumber}</p>)
        ) : (
          <p className="null-ticket">尚未有等待的號碼</p>
        )}
      </div>
      <p className="ticket-container-title">暫時跳過的號碼:</p>
      <div className="skipped-ticket-container">
        {skippedTicket.length > 0 ? (
          skippedTicket.map((ticket) => <button key={ticket._id} onClick={() => handleSkippedTicketCalled(ticket)}>{ticket.ticketNumber}</button>)
        ) : (
          <p className="null-ticket">尚未有跳過的號碼</p>
        )}
      </div>
      <div className="current-ticket-container">
        <p>
          現在號碼: <strong>{currentTicket.ticketNumber ?? "尚未有號碼"}</strong>
        </p>
        <button className="ticket-confirm" onClick={handleTicketCalled}>
          確認入座
        </button>
      </div>
      <button className="next-ticket-btn" onClick={handleNextTicket}>呼叫下一個號碼</button>
      <p className="message">{message}</p>
    </div>
  );
}
