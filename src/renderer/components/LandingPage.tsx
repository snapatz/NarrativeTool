import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
    onGetStarted: () => void;
    onGoToTable: () => void;
    totalDialogues: number;
    totalMissions: number;
    totalSpeakers: number;
}

const LandingPage: React.FC<LandingPageProps> = ({
    onGetStarted,
    onGoToTable,
    totalDialogues,
    totalMissions,
    totalSpeakers
}) => {
    return (
        <div className="landing-page">
            <div className="landing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Narrative Database Tool</h1>
                    <p className="hero-subtitle">
                        Design, visualize, and manage your game's dialogue system with an intuitive node-based editor.
                    </p>
                    
                    <div className="hero-stats">
                        <div className="stat-card">
                            <span className="stat-number">{totalDialogues}</span>
                            <span className="stat-label">Dialogue Events</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{totalMissions}</span>
                            <span className="stat-label">Missions</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{totalSpeakers}</span>
                            <span className="stat-label">Speakers</span>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button className="btn-hero-primary" onClick={onGetStarted}>
                            🎮 Start with Node Designer
                        </button>
                        <button className="btn-hero-secondary" onClick={onGoToTable}>
                            📊 View Data Table
                        </button>
                    </div>
                </div>
            </div>

            <div className="landing-features">
                <div className="features-container">
                    <h2>Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🌐</div>
                            <h3>Node-Based Design</h3>
                            <p>Visualize dialogue flow with intuitive node connections and branching narratives.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✏️</div>
                            <h3>Inline Editing</h3>
                            <p>Edit dialogue text, speakers, and triggers directly within the node interface.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔄</div>
                            <h3>Real-time Updates</h3>
                            <p>Changes sync instantly between the node designer and data table views.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Mission Management</h3>
                            <p>Organize content by missions and zones with smart filtering and grouping.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h3>Scene Notes</h3>
                            <p>Add contextual notes and scene descriptions anywhere in your dialogue flow.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔗</div>
                            <h3>Smart Connections</h3>
                            <p>Create labeled connections between dialogue nodes with custom choice text.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;