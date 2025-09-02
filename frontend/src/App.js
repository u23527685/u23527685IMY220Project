import React from "react";
import{createBrowserRouter,RouterProvider} from "react-router-dom";
import SplashPage from "./pages/SplashPage";

const router=createBrowserRouter([{
    path:"/",
    element:<SplashPage/>
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