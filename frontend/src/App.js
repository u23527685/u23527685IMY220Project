import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import OtherProfile from "./pages/OtherProfile";
import Projects from "./pages/Projects";
import Project from "./components/Project";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";

// Load user from localStorage (similar to Home.js logic)
function loadUserFromStorage() {
    try {
        const storedUser  = localStorage.getItem('user');
        return storedUser  ? JSON.parse(storedUser ) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

const user = loadUserFromStorage();  // Load once for the app

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    element: <Layout user={user} />,  // Pass user to Layout
    children: [
      { path: "home", element: <Home /> },
      { path: "profile", element: <MyProfile /> },
      { path: "profile/:username", element: <OtherProfile /> },
      {
        path: "/projects/:username",
        element: <Projects />,
        children: [
          { path: ":name/:owner", element: <Project /> }
        ]
      },
      { path: "/project/:name/:owner/:id", element: <Project /> }
    ]
  }
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
