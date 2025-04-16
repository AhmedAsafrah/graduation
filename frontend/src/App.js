import "./App.css";
import { Routes, Route } from "react-router";
import SignUpPage from "./components/SignUpPage.jsx";
import LoginPage from "./components/LoginPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
