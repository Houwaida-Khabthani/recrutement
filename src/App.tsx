import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppDispatch";
import { fetchUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  // ✅ GLOBAL THEME APPLY
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <AppRoutes />;
}

export default App;