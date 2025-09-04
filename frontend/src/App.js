import React from "react";
import{createBrowserRouter,RouterProvider} from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import OtherProfile from "./pages/OtherProfile";
import Projects from "./pages/Projects";
import Project from "./components/Project";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    element: <Layout />,
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
      { path: "/project/:name/:owner", element: <Project /> }
    ]
  }
]);

function App(){
    return(
        <RouterProvider router={router} >
            <main>
                <SplashPage />
            </main>
        </RouterProvider>
    )
}

export default App;