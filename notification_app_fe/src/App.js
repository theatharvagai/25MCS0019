import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import AllPage from './pages/AllPage'
import PriorityPage from './pages/PriorityPage'

function App() {
   return(

      <BrowserRouter>

         <div style= {{background:"#333", padding:"10px"}}>

            <Link to="/" style ={{color:"white", marginRight:"15px"}}>All Notifications
            </Link>

            <Link to="/priority" style={{color:"white"}}>Priority
            </Link>

         </div>
         <div style={{padding:"15px"}}>

            <Routes>
               <Route path= "/" element={<AllPage/>}/>

               <Route path= "/priority" element={<PriorityPage/>}/>
            </Routes>

         </div>

      </BrowserRouter>

   )


}

export default App