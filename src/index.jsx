import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
//imports the default export with the name App.
const root = createRoot(document.getElementById("root"));
root.render(<App />);
