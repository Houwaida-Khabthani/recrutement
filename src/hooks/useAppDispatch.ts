import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";

// ✅ dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();