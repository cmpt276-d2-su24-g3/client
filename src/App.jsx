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
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/Index" element={<Index/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}