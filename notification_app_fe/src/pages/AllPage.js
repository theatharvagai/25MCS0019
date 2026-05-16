import { useState,useEffect } from 'react'
import {getNotifs } from '../api'
import Log from '../logger'

function AllPage() {

   const [notifs, setNotifs]=useState([])
   const [filter, setFilter] =useState("All")

   
   const [page,setPage]= useState(1)
   
   const [seen,setSeen]= useState(() => {

      const saved = localStorage.getItem("seen")
      return saved ? JSON.parse(saved) : []
   })

   useEffect(() => {

      loadNotifs()
   }, [filter,page])


   async function loadNotifs() {

      await Log("frontend","info", "page","loading all notifs page")
      
      let data = await getNotifs(10, page, filter)
      setNotifs(data)
      let current_ids = data.map( item => item.ID )
      
      let updatedSeenList= [...new Set([...seen, ...current_ids])]
      
      setSeen(updatedSeenList)
      localStorage.setItem("seen",JSON.stringify(updatedSeenList))
   }

   const handleFilterChange =(e) => {

      setFilter(e.target.value)
      setPage(1)
   }

   return (
      <div style={{  padding: "10px" }}>
         <h2>All Notifications</h2>
         
         <select value={filter} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Placement">Placement</option>

            <option value="Result">Result</option>
            <option value="Event">Event</option>
         </select>


         <div style={{ marginTop: "15px" }}>
            {notifs.map(current_item => {
               const has_seen = seen.includes(current_item.ID)

               return (

                  <div key={current_item.ID} style={{
                     border: has_seen ? "1px solid #ccc" : "2px solid blue",

                     padding: "10px", 
                     marginBottom: "8px", 
                     borderRadius: "5px"
                  }}>
                     <span style={{ fontWeight: "bold" }}>{current_item.Type}</span>
                     
                     {!has_seen && (
                        <span style={{ color: "red", marginLeft: "8px", fontWeight: "bold" }}>
                           NEW
                        </span>
                     )}
                     
                     <p style={{ margin: "4px 0" }}>{current_item.Message}</p>

                     <small>{current_item.Timestamp}</small>
                  </div>
               )
            })}
         </div>

         <div style={{ marginTop: "12px", display: "flex", alignItems: "center" }}>

            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
               prev
            </button>
            
            <span style={{ margin: "0 12px" }}>page {page}</span>
            
            <button onClick={() => setPage(page + 1)}>
               next
            </button>

         </div>
      </div>
   )
}

export default AllPage