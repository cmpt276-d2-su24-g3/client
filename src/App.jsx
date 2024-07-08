import { useState } from "react";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Index } from "./pages/Index";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/index" element={<Index/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
