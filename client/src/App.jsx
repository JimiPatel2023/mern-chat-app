import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { ChatContextProvider } from "./context/chatContext";
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <ChatContextProvider user={user}>
        <Navbar />
        <Container className="">
          <Routes>
            <Route
              path="/"
              element={user ? <Chat /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to={"/Chat"} />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to={"/Chat"} />}
            />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </Container>
      </ChatContextProvider>
    </>
  );
}

export default App;
