import React from "react";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import ProtectedRoute from "./routes/Protection";

const App = () => {
  return (
    <div className="app">
      <Route exact path="/" component={Home} />
      <ProtectedRoute path="/chats" component={Chat} />
    </div>
  );
};

export default App;
