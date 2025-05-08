import React from 'react';
import LoginPage from './components/loginpage';
import { ColorModeContext,useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  const [theme, colorMode] = useMode();
 return(<ColorModeContext.Provider value={colorMode}>
  <ThemeProvider theme={theme}>
    <CssBaseline /> 
    <div className='app'></div>
    <main className='content'>
      <LoginPage />
    </main>
    </ThemeProvider>
 
 </ColorModeContext.Provider>
  )
}

export default App;
