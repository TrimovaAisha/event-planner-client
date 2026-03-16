import { useState, useEffect } from "react";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    try {
      const res = await fetch("https://event-planner-qklz.onrender.com", {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Ошибка при получении событий:", err);
    }
  };
  const createEvent = async () => {
    try {
      const res = await fetch("https://event-planner-qklz.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
      const data = await res.json();
      setEvents([...events, data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Ошибка при создании события:", err);
    }
  };
  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`https://event-planner-qklz.onrender.com${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token
        }
      });
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
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
      {Array.isArray(events) && events.length > 0 ? (
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
