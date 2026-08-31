import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Auth Test</h1>
      <p>{user ? `Logged in as: ${user.username}` : "Not logged in"}</p>
    </div>
  );
}

export default App;
