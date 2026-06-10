import React from "react";
import { NavLink } from "react-router";

const NavBar = ({ col = false }) => {
  const links = [
    {
      id: 1,
      name: "المحاضرين",
      url: "/teachers",
    },
    {
      id: 2,
      name: "الكورسات",
      url: "/courses",
    },
  ];

  return (
    <nav className={`flex items-center gap-4 ${col ? "flex-col" : ""}`}>
      {links.map((link) => (
        <NavLink key={link.id} to={link.url} className="nav_link">
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;
