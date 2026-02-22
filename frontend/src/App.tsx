import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className='min-h-screen flex flex-col bg-slate-50 text-slate-900'>
      <main className='flex-1'>
        <Routes>
          <Route path="*" element={<p className="p-6 text-sm text-slate-500">Not found</p>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
