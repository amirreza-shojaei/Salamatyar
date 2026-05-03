import React  from "react";
import { useNavigate } from "react-router-dom";
import servicesData from "../siteData/homePage/services.json";

function Services (){
const data =servicesData;
const navigate =useNavigate();
    return(
        
        <div className="services-boxes">
            {data.map((data ,index)=>(
                <div className="service-card" onClick={()=>navigate(`${data.navigate}`)} key={index}>
                    <img src={`${data.img}`} alt={`${data.title}`}  className="img-doctor"/>
                    <h3>{`${data.title}`}</h3>
                    <p>{`${data.pragraph}`}</p>
                </div>
            ))}
          </div>
        
    );
}
export default Services;
