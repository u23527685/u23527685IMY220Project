import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import App from "./components/App";
// Get the root DOM element
const container = document.getElementById("root");

// Create a root for React 18 concurrent rendering
const root = createRoot(container);
root.render(<App/>);