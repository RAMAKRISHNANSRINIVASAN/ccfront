import { useContext } from "react"
import { Mycontext } from "./Mycontext"
 
export const Show=()=>
{
 
    let data=useContext(Mycontext)
    console.log(data)
    return(<>
   
         <h1> {data.name}</h1>
   
    </>)
 
 
}