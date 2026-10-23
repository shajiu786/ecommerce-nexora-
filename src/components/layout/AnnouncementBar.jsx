import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return <div className="bg-brand-900 px-3 py-2 text-center text-[11px] font-medium text-white sm:text-xs"><div className="flex items-center justify-center gap-2"><FontAwesomeIcon icon={faTruckFast} className="text-blue-300" /><span>Good finds, better prices — free shipping on orders over $75</span><button onClick={() => setVisible(false)} aria-label="Dismiss announcement" className="ml-1 rounded p-0.5 text-blue-100 hover:text-white"><FontAwesomeIcon icon={faXmark} /></button></div></div>;
}
