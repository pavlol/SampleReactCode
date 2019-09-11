import React, {Component} from 'react';
import '../style/css/FrontPage.css';
import marketImg from '../img/peter-wendt-123928.jpg';
import gaugeImg from '../img/gauge-type1-70-500px.png';
import signupBack from '../img/brooke-lark-230140.jpg';

class Landing extends Component {
  render(){
    return (
      <div>
        <section className="section1" style={{backgroundImage: "url(" + marketImg + ")"}}>
          <div>
            <p>We are building worlds first calories groceries shop</p>
            <p>Getting energy consumtion under control</p>
            <div className="slogan">
              <p>Measure what matters</p>
            </div>
          </div>
        </section>
        <section className="section2" style={{backgroundImage: "url(" + gaugeImg + ")"}}>
          <div className="s2-text1">
            <h2>Our Mission is to help you keep track on how much calories is consumed</h2>
          </div>
          <div className="s2-text2">
            <h3>This tool allows you to measure the calories you have bought. Generate energy efficient shopping list. Set goals and track progress.</h3>
          </div>
        </section>
        <section className="section3">
          <div>
            <h1>How it works</h1>
            <ul>
              <li>Create a weekly shopping list</li>
              <li>Get itemized summary of calories per packaged item</li>
              <li>Set your goals - know exactly how much energy you need</li>
              <li>Substruct the energy you will loose in gym. Connect to your fitness app</li>
              <li>Create a perfect calories-balanced shopping list</li>
            </ul>
          </div>
        </section>
        <section className="section4" style={{backgroundImage: `url(${signupBack})`}}>
          <div>
            <h2>Sign in as guest</h2>
          </div>
        </section>
        <section className="section5">
          <div>
            <h3>Features Roadmap</h3>
            <ul>
              <li>Set consumption goals</li>
              <li>Add products from Tesco</li>
              <li>Create weekly shopping list</li>
              <li>Build calories reports</li>
              <li>Mobile app with saved shoppig list</li>
              <li>Order home delivery from selected store</li>
              <li>Get deliveries using Deliveroo</li>
              <li>Group shopping list by family member</li>
            </ul>
          </div>
        </section>
        <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
      </div>
    )
  }
}

export default Landing;
