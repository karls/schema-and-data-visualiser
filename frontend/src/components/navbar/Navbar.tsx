import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

export const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["2"]}
      items={routes.map(({ name, path }) => {
        return {
          key: name,
          label: <Link to={path}>{name}</Link>,
        };
      })}
    />
  );
};

export default Navbar;
