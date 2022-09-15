import DragAndDropPage from '@/pages/DragAndDropPage'
import HomePage from '@/pages/HomePage'
import TransitionsPage from '@/pages/TransitionsPage'
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
        element={<DragAndDropPage />}
      />
      <Route
        path="/transitions"
        element={<TransitionsPage />}
      />
    </Routes>
  )
}
