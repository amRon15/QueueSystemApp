import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Home.css";
import { socket } from '../../services/socket'

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
    const myTicket = localStorage.getItem('myTicket')
    if (myTicket){
      setMyTicket(myTicket)
    }    

    socket.on('ticketCalling', ticket => {
      setCurrentTicket(ticket.ticketNumber)
    })

    return () => {
      socket.off('ticketCalling')
    }

  }, []);

  const handleGetTicket = async () => {
    if( myTicket ){ return }
    try {
      const res = await api.post("customer/getTicket");
      setMyTicket(res.data.ticketNumber);
      localStorage.setItem('myTicket', JSON.stringify(res.data.ticketNumber))
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelTicket = async () => {
    if ( !myTicket ){ return }
    try {
      const res = await api.put(`customer/cancelTicket/${myTicket}`);

      if (res.status === 200) {
        setMyTicket(null);
        localStorage.removeItem('myTicket')
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>排隊請領取號碼</h2>
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
