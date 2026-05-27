import React from "react";
import "../App.css";
import img from "../assets/images/img.png";


const About = () => {
    return (
        <div className="about-page">
            <h1>Our Mission</h1> 

            {/* Header */}
            <h2></h2>
            <section className="about-section">
            <p>AccuLaunch is dedicated to empower mission control teams with accurate, actionable launch readiness data. By integrating advanced weatehr intelligence with predictive analytics, we aim to minimize delays, enhance safety, and optimize decision-making for aerospace launches. Our platform translates complext meteorological data into clear insights, enabling rapid and informed GO/NO-GO assessments.</p>
            </section>

            {/* Overview */}
            <h2>Project Overview</h2>
            <section className="about-section">
                
                <p>AccuLaunch is a comprehensive weather and launch monitoring dashboard designed for aerospace operations. 
                    The platform enables users to monitor real-time weather conidtions affecting launch readiness, define custom threshold 
                    parameters for mission-critical metrics, track the status of multiple launches simultaneously, and receive visual alerts 
                    and predictive insights to support Go/NO-GO decisions.
                By combining intuitive visualizations with predictive analytics, AccuLaunch streamlines operational workflows, 
                reduces human error, and ensures timely, data-driven decision-making for every launch.
                </p>
            </section>

            {/* Team */}
            <h2>Our Team</h2>
            <section className="about-section"> 

                <div className="team-grid">
                    <div className="team-member">
                        <img src={img} alt="Reagan Boswell" />
                        <h3>Reagan Boswell</h3>
                        <p>Scrum Master</p>
                    </div>

                    <div className="team-member">
                        <img src={img} alt="Teammate Name" />
                        <h3>Jacob Graham</h3>
                        <p>Data Analyst</p>
                    </div>

                    <div className="team-member">
                        <img src={img} alt="Teammate Name" />
                        <h3>Haven Hobbs</h3>
                        <p>Frontend Developer</p>
                    </div>

                    <div className="team-member">
                        <img src={img} alt="Teammate Name" />
                        <h3>Sakshi Shah</h3>
                        <p>Backend Developer</p>
                    </div>

                    <div className="team-member">
                        <img src={img} alt="Teammate Name" />
                        <h3>Krish Vyas</h3>
                        <p>Data Engineer</p>
                    </div>
                </div>
            </section>

            {/* Tech + Languages */}
            <h2>Technology</h2>
            <section className="about-section">

                <p>Our platform is built on a robust Flask backend paired with a React frontend to deliver a seamless and responsive user experience. The backend handles data ingestion, processing, and predictive modeling, while the frontend provides dynamic, real-time visualizations. This technology stack ensures reliability, scalability, and rapid responsiveness for mission-critical operations.
                </p>

            </section>

            <h2>Languages Used</h2>
            <section className="about-section">

                <ul>
                    <li><strong>Python</strong> | Backend development, data processing, and predictive analytics.</li>
                    <li><strong>JavaScript</strong> | Dynamic frontend components and real-time dashboard functionality.</li>
                    <li><strong>HTML/CSS</strong> | Structuring and styling a responsive, user-friendly interface.</li>
                </ul>

            </section>
            <h2>Future Work</h2>
            <section className="about-section">
                
                <p>Looking ahead, we plan to enhance AccuLaunch with advanced machine learning models for more accurate weather predictions, integrate multi-source telemetry data for broader monitoring capabilities, and expand the dashboard with customizable alerting features to further improve mission control efficiency.
                </p>
            </section>
            
        </div>
    );
};

export default About;