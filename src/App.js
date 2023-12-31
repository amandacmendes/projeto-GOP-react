import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainPage } from './pages/Index/Mainpage';
import { Dashboard } from './pages/Dashboard';
import { Operacoes } from './pages/Operation/Operacoes';
import AuthService from './services/AuthService';
import { Cadastro } from './pages/Cadastro';
import { Login } from './pages/Login/Login';
import { OperacoesView } from './pages/Operation/OperacoesView';
import { ErrorPage } from './pages/ErrorPage';
import { Teams } from './pages/Teams/Teams';
import { TeamsView } from './pages/Teams/TeamsView';
import { OperacoesNew } from './pages/Operation/OperacoesNew';
import { Resources } from './pages/Resources/Resources';
import { ResourcesNew } from './pages/Resources/ResourcesNew';
import { TeamsNew } from './pages/Teams/TeamsNew';
import { Officers } from './pages/Officer/Officers';
import { Profile } from './pages/Profile/Profile';


function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <>

      <Router>
        <Routes>

          <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Login />} />
          <Route path='/signup' element={<Cadastro />} />

          <Route path='/*' element={<ErrorPage />} />

          <Route path='/mainpage' element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />} />
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />


          <Route path='/operation' element={isAuthenticated ? <Operacoes /> : <Navigate to="/login" />}></Route>
          <Route path='/operation/new' element={isAuthenticated ? <OperacoesNew pagetitle="Nova Operação" /> : <Navigate to="/login" />}></Route>
          <Route path='/operation/:id/:action' useParams={['id', 'action']} element={isAuthenticated ? (<OperacoesView />) : <Navigate to="/login" />}></Route>


          <Route path='/team' element={isAuthenticated ? <Teams /> : <Navigate to="/login" />}></Route>
          <Route path='/team/new' element={isAuthenticated ? <TeamsNew pagetitle="Nova Equipe" /> : <Navigate to="/login" />}></Route>
          <Route path='/team/:id/:action' useParams={['id', 'action']} element={isAuthenticated ? <TeamsView /> : <Navigate to="/login" />}></Route>

          <Route path='/resources' element={isAuthenticated ? <Resources /> : <Navigate to="/login" />}></Route>
          <Route path='/resources/new' element={isAuthenticated ? <ResourcesNew pagetitle="Novo Recurso" /> : <Navigate to="/login" />}></Route>
          <Route path='/resources/:id/:action' useParams={['id', 'action']} element={isAuthenticated ? <ResourcesNew /> : <Navigate to="/login" />}></Route>

          <Route path='/officer' element={isAuthenticated ? <Officers /> : <Navigate to="/login" />}></Route>

          <Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}></Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
