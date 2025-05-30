﻿import React, { useState } from 'react';
import DataTable from './components/DataTable';
import NodeDesigner from './components/NodeDesigner';
import LandingPage from './components/LandingPage';
import { DialogueEvent } from './types';
import { mockDialogueEvents, dropdownOptions } from './mockData';
import './App.css';

const App: React.FC = () => {
    const [dialogueEvents, setDialogueEvents] = useState<DialogueEvent[]>(mockDialogueEvents);
    const [nextId, setNextId] = useState(() => {
        const maxId = Math.max(...mockDialogueEvents.map(event => event.id));
        return maxId + 1;
    });
    const [currentView, setCurrentView] = useState<'landing' | 'table' | 'nodes'>('landing');
    const [selectedRowsForNodes, setSelectedRowsForNodes] = useState<number[]>([]);
    const [hasActiveNodeSession, setHasActiveNodeSession] = useState(false);
    const [isBlankSlateMode, setIsBlankSlateMode] = useState(false);

    const handleUpdateRow = (id: number, field: string, value: string) => {
        setDialogueEvents(prev =>
            prev.map(event =>
                event.id === id
                    ? {
                        ...event,
                        [field]: value,
                        updated_at: new Date().toISOString()
                    }
                    : event
            )
        );
    };

    const handleAddRow = () => {
        const newEvent: DialogueEvent = {
            id: nextId,
            dialogue_text: "",
            dialogue_event_name: `dx_new_event_${nextId}`,
            wwise_event_name: `Play_dx_new_event_${nextId}`,
            mission: '',
            zone: '',
            speaker: '',
            trigger: '',
            integration_notes: '',
            related_game_asset: '',
            game_status: 'Not Started',
            asset_status: 'Not Started',
            wwise_status: 'Not Implemented',
            dev_revision_note: '',
            notes: '',
            creator: 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        setDialogueEvents(prev => [...prev, newEvent]);
        setNextId(prev => prev + 1);
    };

    const handleAddRows = (rows: Partial<DialogueEvent>[]) => {
        const newEvents = rows.map((rowData, index) => ({
            id: nextId + index,
            dialogue_text: rowData.dialogue_text || "",
            dialogue_event_name: rowData.dialogue_event_name || `dx_new_event_${nextId + index}`,
            wwise_event_name: rowData.wwise_event_name || `Play_dx_new_event_${nextId + index}`,
            mission: rowData.mission || '',
            zone: rowData.zone || '',
            speaker: rowData.speaker || '',
            trigger: rowData.trigger || '',
            integration_notes: rowData.integration_notes || '',
            related_game_asset: rowData.related_game_asset || '',
            game_status: rowData.game_status || 'Not Started',
            asset_status: rowData.asset_status || 'Not Started',
            wwise_status: rowData.wwise_status || 'Not Implemented',
            dev_revision_note: rowData.dev_revision_note || '',
            notes: rowData.notes || '',
            creator: rowData.creator || 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        setDialogueEvents(prev => [...prev, ...newEvents]);

        // If NodeDesigner is open, handle new node addition
        if (currentView === 'nodes') {
            const newIds = newEvents.map(e => e.id);
            if (isBlankSlateMode || selectedRowsForNodes.length > 0) {
                setSelectedRowsForNodes(prev => [...prev, ...newIds]);
                console.log("Added new IDs to selection:", newIds);
            }
        }

        setNextId(prev => prev + rows.length);
    };

    const handleUpdateRows = (updates: { id: number; updates: Partial<DialogueEvent> }[]) => {
        setDialogueEvents(prev =>
            prev.map(event => {
                const update = updates.find(u => u.id === event.id);
                if (update) {
                    return {
                        ...event,
                        ...update.updates,
                        updated_at: new Date().toISOString()
                    };
                }
                return event;
            })
        );
    };

    const handleDeleteRow = (id: number) => {
        setDialogueEvents(prev => prev.filter(event => event.id !== id));
    };

    const handleSetData = (newData: DialogueEvent[]) => {
        setDialogueEvents(newData);
    };

    const handleOpenNodeDesigner = (selectedRows: number[]) => {
        setSelectedRowsForNodes(selectedRows);
        setCurrentView('nodes');
        setHasActiveNodeSession(true);
        setIsBlankSlateMode(false);
    };

    const handleCloseNodeDesigner = () => {
        setCurrentView('table');
        // Keep selectedRowsForNodes and hasActiveNodeSession to preserve state
    };

    const handleGetStarted = () => {
        // Start with true blank slate - no existing nodes shown
        setSelectedRowsForNodes([]);
        setCurrentView('nodes');
        setHasActiveNodeSession(true);
        setIsBlankSlateMode(true);
    };

    const handleGoToTable = () => {
        setCurrentView('table');
    };

    const handleBackToLanding = () => {
        setCurrentView('landing');
        setSelectedRowsForNodes([]);
        setHasActiveNodeSession(false);
        setIsBlankSlateMode(false);
    };

    const handleGoToNodes = () => {
        setCurrentView('nodes');
    };

    const totalMissions = new Set(dialogueEvents.map(e => e.mission)).size;
    const totalSpeakers = new Set(dialogueEvents.map(e => e.speaker)).size;

    return (
        <div className="App">
            {currentView === 'landing' && (
                <LandingPage
                    onGetStarted={handleGetStarted}
                    onGoToTable={handleGoToTable}
                    totalDialogues={dialogueEvents.length}
                    totalMissions={totalMissions}
                    totalSpeakers={totalSpeakers}
                />
            )}

            {currentView === 'nodes' && (
                <NodeDesigner
                    data={dialogueEvents}
                    selectedRows={selectedRowsForNodes}
                    onClose={handleCloseNodeDesigner}
                    onUpdateData={handleSetData}
                    onAddRow={handleAddRows}
                    onUpdateRow={handleUpdateRow}
                    dropdownOptions={dropdownOptions}
                    isBlankSlateMode={isBlankSlateMode}
                />
            )}

            {currentView === 'table' && (
                <>
                    <header className="app-header">
                        <div className="header-content">
                            <h1>Narrative Database Tool</h1>
                            <div className="header-actions">
                                {hasActiveNodeSession && (
                                    <button className="btn-node-return" onClick={handleGoToNodes}>
                                        🌐 Return to Node Designer
                                    </button>
                                )}
                                <div className="header-stats">
                                    <span className="stat">
                                        <strong>{dialogueEvents.length}</strong> Events
                                    </span>
                                    <span className="stat">
                                        <strong>{totalMissions}</strong> Missions
                                    </span>
                                    <span className="stat">
                                        <strong>{totalSpeakers}</strong> Speakers
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="app-main">
                        <DataTable
                            data={dialogueEvents}
                            dropdownOptions={dropdownOptions}
                            onUpdateRow={handleUpdateRow}
                            onAddRow={handleAddRow}
                            onAddRows={handleAddRows}
                            onUpdateRows={handleUpdateRows}
                            onDeleteRow={handleDeleteRow}
                            onSetData={handleSetData}
                            onOpenNodeDesigner={handleOpenNodeDesigner}
                        />
                    </main>
                </>
            )}
        </div>
    );
};

export default App;