import TOKEN from './token'

async function Log(stack, level,pkg,msg) {

   try {

      await fetch("http://4.224.186.213/evaluation-service/logs", {

         method:  "POST",
         headers: 
         {
            "Content-Type":"application/json",
            "Authorization": "Bearer " +TOKEN
         },
         body: JSON.stringify({ stack:stack,level:level,  package:pkg, message:msg }
 
         )
      })
   } catch(e)   {

   }
}
  

export default Log