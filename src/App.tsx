import { Navigate, } from "react-router-dom"
import Scheduler from "./components/Calender"
import { useAuth } from "./context/authContext"

function App() {

  const { userLoggedIn } = useAuth()
  return (
    <>
      {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
      <Scheduler />
    </>
  )
}

export default App
