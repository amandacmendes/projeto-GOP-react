import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainPage } from './pages/Index/Mainpage';
import { Dashboard } from './pages/Dashboard';
import { Operacoes } from './pages/CRUDOperacoes/Operacoes';
import AuthService from './services/AuthService';
import { Cadastro } from './pages/Cadastro';
import { Login } from './pages/Login/Login';
import { OperacoesView } from './pages/CRUDOperacoes/OperacoesView';
import { ErrorPage } from './pages/ErrorPage';
import { Teams } from './pages/Teams copy/Teams';
import { TeamsView } from './pages/Teams copy/TeamsView';

//import { Teams } from './pages/Teams/Teams';
//import { TeamsView } from './pages/Teams/TeamsView';

function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <>

      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/login"/>}></Route>
          <Route path='/login' Component={Login}></Route>
          <Route path='/logout' Component={Login}></Route>
          <Route path='/signup' element={<Cadastro />}></Route>

          <Route path='/*' Component={ErrorPage}></Route>

          <Route path='/mainpage' element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}></Route>
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}></Route>
          <Route path='/operation' element={isAuthenticated ? <Operacoes /> : <Navigate to="/login" />}></Route>
          <Route path='/operation/new' element={isAuthenticated ? <OperacoesView pagetitle="Nova Operação" /> : <Navigate to="/login" />}></Route>
          <Route path='/operation/:id/:action' useParams={['id']} element={isAuthenticated ? <OperacoesView /> : <Navigate to="/login" />}></Route>


          <Route path='/team' element={isAuthenticated ? <Teams /> : <Navigate to="/login" />}></Route>
          <Route path='/team/new' element={isAuthenticated ? <TeamsView pagetitle="Nova Equipe" /> : <Navigate to="/login" />}></Route>
          <Route path='/team/:id/:action' useParams={['id']} element={isAuthenticated ? <TeamsView /> : <Navigate to="/login" />}></Route>

          {/* escrever paths pra => /team /resources /profile */}

        </Routes>
      </Router>
    </>
  );
}

export default App;
