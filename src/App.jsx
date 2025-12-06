import { BrowserRouter, Routes, Route } from "react-router-dom";
import PopupModal from "./popuprouter.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/media/:mediaId" element={<PopupModal />} />
      </Routes>
    </BrowserRouter>
  );
}
