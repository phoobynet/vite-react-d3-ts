import DragAndDrop from '@/pages/DragAndDrop'
import HomePage from '@/pages/HomePage'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route
        index
        element={<HomePage />}
      />
      <Route
        path="/drag-and-drop"
        element={<DragAndDrop />}
      />
    </Routes>
  )
}
