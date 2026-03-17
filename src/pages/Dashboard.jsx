import { useState, useEffect } from "react";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");

  const BASE_URL = "https://event-planner-backend-eavd.onrender.com/api/events";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const res = await fetch(BASE_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Ошибка при получении событий:", err);
    }
  };

  const createEvent = async () => {
    if (!token) return alert("Сначала войдите в аккаунт");
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      setEvents([...events, data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Ошибка при создании события:", err);
    }
  };

  const deleteEvent = async (id) => {
    if (!token) return alert("Сначала войдите в аккаунт");
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error("Ошибка при удалении события:", err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Мои мероприятия</h2>
      <div className="form">
        <input
          placeholder="Мероприятие"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Описание мероприятия"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createEvent}>Добавить мероприятие</button>
      </div>

      {events.length > 0 ? (
        <div className="events">
          {events.map((event) => (
            <div className="event-card" key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <button onClick={() => deleteEvent(event._id)}>Удалить</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No events yet</p>
      )}
    </div>
  );
}

export default Dashboard;