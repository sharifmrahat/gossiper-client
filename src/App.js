import { useEffect, useState } from "react";
import Pusher from "pusher-js";

function App() {
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let allMessages = [];

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher("cb93647401348f21dbb4", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      allMessages.push(data);
      setMessages(allMessages);
    });
  }, [allMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message,
      }),
    });
    setMessage("");
  };
  return (
    <div className="App">
      <div className="container">
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
          <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
            <input
              className="fs-5 fw-semibold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="list-group list-group-flush border-bottom scrollarea">
            {messages.length &&
              messages.map((message) => (
                <div className="list-group-item list-group-item-action py-3 lh-sm">
                  <div className="d-flex w-100 align-items-center justify-content-between">
                    <strong className="mb-1">{message?.username}</strong>
                  </div>
                  <div className="col-10 mb-1 small">{message?.message}</div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="text"
              placeholder="Write a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
