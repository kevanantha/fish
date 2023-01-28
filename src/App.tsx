import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.scss'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Price from './pages/Price'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Price />
    </QueryClientProvider>
  )
}

export default App
