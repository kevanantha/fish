import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './App.scss'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Price from './pages/Price'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <main className='container'>
        <Price />
      </main>
    </QueryClientProvider>
  )
}

export default App
