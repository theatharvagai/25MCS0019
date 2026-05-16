import TOKEN from './token'
import Log from './logger'



export async function getNotifs(limit, page, type) {

   await Log("frontend","info", "api","fetching notifs from server")

   let url= "http://4.224.186.213/evaluation-service/notifications?limit="+limit+"&page="+page

   if(type && type != "All") url = url+ "&notification_type="+type
   let res= await fetch(url,  { headers:  {"Authorization":  "Bearer "+TOKEN} } )
   let d= await res.json()

   return  d.notifications || []
}