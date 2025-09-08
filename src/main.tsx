import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider.tsx'
import { QueryClient } from "@tanstack/react-query";
import './index.css'
import App from './App.tsx' 
import { ClerkProvider } from '@clerk/clerk-react'
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister  } from '@tanstack/query-async-storage-persister'

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const queryClient = new QueryClient();

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

const persister = createAsyncStoragePersister ({
  storage: window.localStorage,
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <App />
        </PersistQueryClientProvider>
      </Provider> 
    </ClerkProvider>
  </StrictMode>,
)
