import React from 'react';
import Header from "./admin/Header/Header";
import "./admin/Header/Header";
import './Home.css';


function Home(props){

    return(
        <div>
            <Header />
            <div className="home-container">
                <h1>Welcome to our Admin Page</h1>
            </div>
        </div>
    )
}
export default Home;