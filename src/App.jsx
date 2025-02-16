import './App.css'
import { ThemeProvider } from 'next-themes'
import LineViz from './components/LineViz'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LineViz />
    </ThemeProvider>
  )
}

export default App