import { Experience } from './Experience'

function App() {
  
  const isTesting = new URLSearchParams(window.location.search).has('testing')

  return <Experience testing={isTesting} />
}

export default App