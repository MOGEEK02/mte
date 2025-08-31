import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";



const api: React.FC = () => {
const[catFact, setCatFact]=useState("");
 const fetchapi =() => {
   axios.get("https://catfact.ninja/fact").then((res)=>{
setCatFact(res.data.fact);

});

 };

useEffect(()=>{

    axios.get("https://catfact.ninja/fact").then((res)=>{
setCatFact(res.data.fact);

});

} ,[]);



    
  return (
 

   <div>

<button
    type="button"
    class="btn btn-primary"
    onClick={fetchapi}
>
    Buttond
</button>


<p>
{catFact}


</p>




</div>
  );
};

export default api;
