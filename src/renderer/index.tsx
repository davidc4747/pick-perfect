import { createRoot } from "react-dom/client";
import App from "./components/app/app";

const elem = document.querySelector("#root");
if (elem) {
    const root = createRoot(elem);
    root.render(<App />);
}
