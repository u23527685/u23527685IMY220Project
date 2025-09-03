import React from "react";
import{createBrowserRouter,RouterProvider} from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import Home from "./pages/Home";

const router=createBrowserRouter([{
    path:"/",
    element:<SplashPage/>
},
{
    path:"/home",
    element:<Home/>
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