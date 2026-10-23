import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/layout/AnnouncementBar.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function MainLayout() {
  return <><AnnouncementBar /><Header /><main className="min-h-[60vh]"><Outlet /></main><Footer /></>;
}
