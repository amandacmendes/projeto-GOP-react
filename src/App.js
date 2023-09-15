import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainPage } from './pages/Index/Mainpage';
import { Dashboard } from './pages/Dashboard';
import { Operacoes } from './pages/CRUDOperacoes/Operacoes';
import AuthService from './services/AuthService';
import { Cadastro } from './pages/Cadastro';
import { Login } from './pages/Login/Login';
import { OperacoesView } from './pages/CRUDOperacoes/OperacoesView';

function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <>

      <Router>
        <Routes>
          <Route path='/' Component={Login}></Route>
          <Route path='/login' Component={Login}></Route>
          <Route path='/logout' Component={Login}></Route>
          <Route path='/signup' element={<Cadastro />}></Route>

          <Route path='/mainpage' element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}></Route>
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}></Route>
          <Route path='/operation' element={isAuthenticated ? <Operacoes /> : <Navigate to="/login" />}></Route>
          <Route path='/operation/new' element={isAuthenticated ? <OperacoesView pagetitle="Nova Operação" /> : <Navigate to="/login" />}></Route>

          {
            // /team /resources /profile
          }
        </Routes>
      </Router>
    </>
  );
}

export default App;
