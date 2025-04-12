import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header/Header";
import Airdrop from "./pages/Airdrop";
import SlashList from "./pages/SlashList";
import Create from "./pages/Create";

function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Airdrop />} />
          <Route path="/create" element={<Create />} />
          <Route path="/list" element={<SlashList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
