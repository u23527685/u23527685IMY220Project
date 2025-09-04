import React from "react";
import{createBrowserRouter,RouterProvider} from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import OtherProfile from "./pages/OtherProfile";
import Followers from "./components/Followers";
import Following from "./components/Following";



const router=createBrowserRouter([{
    path:"/",
    element:<SplashPage/>
},
{
    path:"/home",
    element:<Home/>
},
{
    path:"/profile",
    element:<MyProfile />,
},
{
    paths:"/:username",
    element:<OtherProfile/>
}
])

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