import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  return (
    <div className="app-container">
      <AppRoutes />
    </div>
  );
}

export default App;
