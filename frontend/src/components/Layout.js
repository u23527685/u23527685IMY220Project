import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import React from 'react';


function Layout({ user }) {
  return (
    <>
      <Navbar username={user?.username} />
      <Outlet />
    </>
  );
}
export default Layout;