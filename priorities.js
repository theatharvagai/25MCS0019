const { Log } = require('./logging_middleware/logger')



const my_secret_jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnYWkuYXRoYXJ2YXJhamVuZHJhMjAyNUB2aXRzdHVkZW50LmFjLmluIiwiZXhwIjoxNzc4OTMyOTI0LCJpYXQiOjE3Nzg5MzIwMjQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlYThlZWExMS1iOGZkLTRjYjAtYjE5Zi03ODJmMzZiNDk1YmMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhdGhhcnZhIGdhaSIsInN1YiI6IjlmMjEyZmFiLTJhY2YtNDAzZi04ZDRmLTE4OGE5YTBlMWJlNCJ9LCJlbWFpbCI6ImdhaS5hdGhhcnZhcmFqZW5kcmEyMDI1QHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoiYXRoYXJ2YSBnYWkiLCJyb2xsTm8iOiIyNW1jczAwMTkiLCJhY2Nlc3NDb2RlIjoiU2ZGdVdnIiwiY2xpZW50SUQiOiI5ZjIxMmZhYi0yYWNmLTQwM2YtOGQ0Zi0xODhhOWEwZTFiZTQiLCJjbGllbnRTZWNyZXQiOiJGZVVFWWRZZXhLa0t1QWNmIn0.zsWZlnrORc8EF4HNRkanXugVgtYVxyUvwLEGhJj8h6c"



const weightsConfig= { "Placement": 3,   "Result": 2,"Event": 1  }


async function main(){

    await Log( "backend", "info", "service", "fetching notifs")

    let apiResponse =await fetch("http://4.224.186.213/evaluation-service/notifications", {
        headers: 
        { "Authorization" :  `Bearer ${my_secret_jwt}` }
    });
    
    let rawData =await apiResponse.json()

    if(!rawData || !rawData.notifications) {
        console.error("Server Error Response:", rawData);
        await Log("backend", "error", "service", "failed to fetch notifications key");
    }

    let list =rawData.notifications || [];

    await Log("backend" , "info" , "service" , `got ${list.length} notifs`)

    let timeArray =list.map( item =>new Date(item.Timestamp).getTime() )

    let minTime= Math.min( ...timeArray )
    let maxTime= Math.max(...timeArray)

    let calculatedList=  list.map(currentElement => {

        let weightFactor=weightsConfig[currentElement.Type] || 1
        
        let curr_time =new Date(currentElement.Timestamp).getTime()
        let normalizedRecency= (curr_time - minTime)/(maxTime - minTime || 1)
        
        let finalScore= (weightFactor*0.7) +(normalizedRecency* 0.3)
        
        return{ 

            ...currentElement, 
            sc: finalScore 
        }
    })

    calculatedList.sort( ( first, second ) => second.sc - first.sc  )
    
    let finalTopTen = calculatedList.slice(0, 10)

    await Log("backend","info","service", "top 10 computed" )

    console.log("\ntop 10 priority notifications:\n")
    finalTopTen.forEach(( n , index ) => {

        console.log(`${index + 1}. [${n.Type}] ${n.Message} | ${n.Timestamp} | score: ${n.sc.toFixed(2)}`)
    })
}


main()