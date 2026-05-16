import { useState } from 'react'
import { getNotifs } from '../api'
import Log from '../logger'

const configWeights = { "Placement": 3, "Result": 2, "Event": 1 }

function PriorityPage() {

   const [limitCount, setLimitCount] = useState(10)
   const [list, setList] = useState([])

   async function calcTop() {

      await Log("frontend" , "info" , "page" , "computing priority notifs")
      
      let totalData = await getNotifs(100 , 1 , null)
      
      let timesArray = totalData.map(val => new Date(val.Timestamp).getTime())
      let min_timestamp = Math.min(...timesArray)

      let maxTime = Math.max( ...timesArray )
      
      let mappedElements = totalData.map( singleItem => {

         let typeWeight = configWeights[singleItem.Type] || 1
         
         let currentMs = new Date(singleItem.Timestamp).getTime()

         let recencyIndex =(currentMs - min_timestamp) / ( maxTime - min_timestamp || 1 )
         
         let calculatedRank= (typeWeight * 0.7) + ( recencyIndex * 0.3 )
         
         return {

            ...singleItem, 
            score : calculatedRank
         }
      })
      
      mappedElements.sort(( leftHand , rightHand ) => rightHand.score - leftHand.score)
      
      // parse limit count state string manually to avoid slice errors
      let finalSliceAmount = parseInt(limitCount) || 10
      setList(mappedElements.slice( 0 , finalSliceAmount ))
   }

   return (

      <div style = {{ padding: "12px" }}>
         <h2>Priority Inbox</h2>
         
         <input 
            type="number" 
            value={limitCount} 
            onChange= { e => setLimitCount(e.target.value) } 
            style={{ width : "65px" }}
         />
         
         <button onClick= { calcTop } style={{ marginLeft : "12px" }}>
            Show
         </button>

         <div style={{ marginTop: "16px" }}>
            {list.map(( item , idx ) => (
               <div key={item.ID} style={{
                  border: "1px solid #ccc", 
                  padding: "10px",
                  marginBottom: "8px", 
                  borderRadius: "5px"
               }}>
                  <span>#{idx + 1} </span>
                  <span style={{ fontWeight : "bold" }}>{item.Type}</span>
                  
                  <p style={{ margin: "4px 0" }}>{item.Message}</p>
                  
                  <small>
                     {item.Timestamp} | score: {item.score.toFixed(2)}

                  </small>

               </div>

            ))}

         </div>

      </div>

   )
}


export default PriorityPage