import React from "react";
import{createBrowserRouter,RouterProvider} from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import OtherProfile from "./pages/OtherProfile";

const otheruser={
    username:"DanGrimm",
    paswword:"DanGrimm44#*",
    email:"DanGrimm@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[{
        name:"Grim town",
        owner:"Dan Grimm"
    }],
    contributed_ptojects:[],
    following:[
        {username:"Ben10"}
    ],
    followers:[
        {username:"Ben10"}
    ]
}

const user={
    username:"Ben10",
    paswword:"benLook11#",
    email:"Ben10@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[],
    contributed_ptojects:[{
        name:"Grim town",
        owner:"Dan Grimm"
    }
    ],
    following:[
        {username:"DanGrimm"}
    ],
    followers:[
        {username:"DanGrimm"}
    ]
}

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
    element:<MyProfile user={user} />
},
{
    paths:"/:username",
    element:<OtherProfile user={otheruser} />
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