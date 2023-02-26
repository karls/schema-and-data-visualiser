import ContactPage from "../../pages/contact/ContactPage";
import HomePage from "../../pages/home/HomePage";

export const routes = [
  {
    name: 'Home',
    path: "/",
    element: <HomePage />,
  },
  {
    name: 'Contact',
    path: "/contact",
    element: <ContactPage />,
  },
];
