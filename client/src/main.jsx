import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
axios.defaults.baseURL = "https://writesync-vxcq.onrender.com"||"http://localhost:5000";

createRoot(document.getElementById("root")).render(<App />);
