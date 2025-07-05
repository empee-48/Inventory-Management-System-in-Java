import './App.css'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './components/navigation/AppRouter'
import { GlobalContext } from './components/utilities/GlobalContext.Jsx'

const queryClient=new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext>
        <AppRouter />
      </GlobalContext>
    </QueryClientProvider>
  )
}

export default App
