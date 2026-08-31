import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element= <LoginPage/> />
        <Route path="/register" element={<h1>Register Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
