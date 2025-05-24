import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    ConnectionMode,
    MarkerType,
    Position,
    Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DialogueEvent } from '../types';
import './NodeDesigner.css';

interface NodeDesignerProps {
    data: DialogueEvent[];
    selectedRows: number[];
    onClose: () => void;
    onUpdateData: (data: DialogueEvent[]) => void;
    onAddRow: (rows: Partial<DialogueEvent>[]) => void;
}

// Custom Node Types - Kept outside as they don't need component state directly,
// but onDelete will be passed down.
const DialogueNode = ({ data, onDelete }: { data: any, onDelete: (nodeId: string) => void }) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Remove "${data.dialogue_text?.slice(0, 50) || 'dialogue'}" from view?`)) {
            onDelete(`dialogue-${data.id}`);
        }
    };

    return (
        <div className="dialogue-node" onContextMenu={handleRightClick}>
            <Handle type="target" position={Position.Left} style={{ background: '#60a5fa', width: '12px', height: '12px', border: '2px solid white' }} />
            <div className="node-header">
                <span className="speaker">🎭 {data.speaker || 'Unknown'}</span>
                <div className="node-controls">
                    <button className="details-btn" onClick={() => setShowDetails(!showDetails)}>📋</button>
                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleRightClick(e); }} title="Remove from view">✕</button>
                </div>
            </div>
            <div className="dialogue-text">{data.dialogue_text || 'No dialogue'}</div>
            <div className="trigger">⚡ {data.trigger || 'No trigger'}</div>
            <Handle type="source" position={Position.Right} style={{ background: '#60a5fa', width: '12px', height: '12px', border: '2px solid white' }} />
            {showDetails && (
                <div className="details-popup">
                    <div className="popup-content">
                        <button className="close-popup" onClick={() => setShowDetails(false)}>✕</button>
                        <h4>Full Details</h4>
                        <div><strong>Event Name:</strong> {data.dialogue_event_name}</div>
                        <div><strong>Mission:</strong> {data.mission}</div>
                        <div><strong>Zone:</strong> {data.zone}</div>
                        <div><strong>Game Status:</strong> {data.game_status}</div>
                        <div><strong>Asset Status:</strong> {data.asset_status}</div>
                        <div><strong>Notes:</strong> {data.notes}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ZoneNode = ({ data }: { data: any }) => (
    <div className="zone-node">
        <div className="zone-header">
            <span className="zone-title">📍 {data.zone}</span>
            <span className="dialogue-count">{data.dialogueCount} lines</span>
        </div>
    </div>
);

const MissionNode = ({ data }: { data: any }) => (
    <div className="mission-node">
        <div className="mission-header">
            <span className="mission-title">🎮 {data.mission}</span>
            <div className="mission-stats">
                <span>{data.zoneCount} zones</span>
                <span>{data.dialogueCount} lines</span>
            </div>
        </div>
    </div>
);

const HelperNode = ({ data, onDelete }: { data: any, onDelete: (nodeId: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(data.text || 'Scene description...');

    const handleSave = () => {
        data.text = text;
        setIsEditing(false);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Remove this note from view?`)) {
            onDelete(data.nodeId); // Use data.nodeId to identify the helper node
        }
    };


    return (
        <div className="helper-node" onContextMenu={handleRightClick}>
            <Handle type="target" position={Position.Left} style={{ background: '#f59e0b', width: '10px', height: '10px', border: '2px solid white' }} />
            <Handle type="source" position={Position.Right} style={{ background: '#f59e0b', width: '10px', height: '10px', border: '2px solid white' }} />
            <div className="helper-header">
                <span className="helper-icon">📝</span>
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleRightClick(e); }} title="Remove from view">✕</button>
                <button className="edit-helper-btn" onClick={() => setIsEditing(!isEditing)}>✏️</button>
            </div>
            {isEditing ? (
                <div className="helper-editor">
                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} autoFocus />
                    <div>
                        <button onClick={handleSave} className="save-btn">Save</button>
                        <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="helper-text" onClick={() => setIsEditing(true)}>{text}</div>
            )}
        </div>
    );
};


type ZoomLevel = 'mission' | 'zone' | 'dialogue';

const NodeDesigner: React.FC<NodeDesignerProps> = ({
                                                       data,
                                                       selectedRows,
                                                       onClose,
                                                       onUpdateData,
                                                       onAddRow
                                                   }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
    const [edgeLabels, setEdgeLabels] = useState<{ [edgeId: string]: string }>({});
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('dialogue');
    const [currentFilter, setCurrentFilter] = useState<{
        type: 'selection' | 'mission' | 'zone';
        value: string;
    }>({ type: 'selection', value: '' });

    const [savedNodeState, setSavedNodeState] = useState<{
        nodes: Node[];
        edges: Edge[];
        edgeLabels: { [key: string]: string };
    } | null>(null);

    const prevZoomLevel = useRef(zoomLevel);

    // *** MOVED INSIDE THE COMPONENT ***
    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes(prev => prev.filter(node => node.id !== nodeId));
        setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        setEdgeLabels(prev => {
            const newLabels = { ...prev };
            // Need a way to access the *current* edges here.
            // Since setEdges is async, we filter based on the *previous* edges,
            // or better, filter edges first and then update labels based on remaining edges.
            const remainingEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
            const remainingEdgeIds = new Set(remainingEdges.map(e => e.id));

            Object.keys(newLabels).forEach(edgeId => {
                if (!remainingEdgeIds.has(edgeId)) {
                    delete newLabels[edgeId];
                }
            });
            return newLabels;
        });
    }, [setNodes, setEdges, setEdgeLabels, edges]); // Added `edges` dependency

    // *** MOVED INSIDE THE COMPONENT ***
    const nodeTypes = useMemo(() => ({ // Renamed to `nodeTypes`
        dialogue: (props: any) => <DialogueNode {...props} onDelete={handleDeleteNode} />,
        zone: ZoneNode,
        mission: MissionNode,
        helper: (props: any) => <HelperNode {...props} onDelete={handleDeleteNode} />,
    }), [handleDeleteNode]); // Depends on `handleDeleteNode` which is now stable


    const filteredData = useMemo(() => {
        if (currentFilter.type === 'selection') {
            return data.filter(row => selectedRows.includes(row.id));
        } else if (currentFilter.type === 'mission') {
            return data.filter(row => row.mission === currentFilter.value);
        } else if (currentFilter.type === 'zone') {
            return data.filter(row => row.zone === currentFilter.value);
        }
        return data;
    }, [data, selectedRows, currentFilter]);

    const missions = useMemo(() => Array.from(new Set(data.map(row => row.mission).filter(Boolean))), [data]);
    const zones = useMemo(() => Array.from(new Set(data.map(row => row.zone).filter(Boolean))), [data]);

    const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }: any) => {
        const [isEditingLabel, setIsEditingLabel] = useState(false);
        const [labelText, setLabelText] = useState(edgeLabels[id] || '');
        const midX = sourceX + (targetX - sourceX) * 0.7;
        const pathData = `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
        const labelX = midX;
        const labelY = (sourceY + targetY) / 2;

        const handleLabelSave = () => {
            setEdgeLabels(prev => ({ ...prev, [id]: labelText }));
            setIsEditingLabel(false);
        };
        const handleDoubleClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsEditingLabel(true); };
        const handleRightClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm(`Delete connection "${edgeLabels[id] || 'Untitled'}"?`)) {
                setEdges(prev => prev.filter(edge => edge.id !== id));
                setEdgeLabels(prev => { const newLabels = { ...prev }; delete newLabels[id]; return newLabels; });
            }
        };
        const hasLabel = edgeLabels[id] && edgeLabels[id].trim().length > 0;

        return (
            <>
                <path d={pathData} style={{ ...style, strokeWidth: 3, cursor: 'pointer' }} fill="none" markerEnd={markerEnd} onDoubleClick={handleDoubleClick} onContextMenu={handleRightClick} />
                <path d={pathData} style={{ stroke: 'transparent', strokeWidth: 10, cursor: 'pointer' }} fill="none" onDoubleClick={handleDoubleClick} onContextMenu={handleRightClick}><title>Double-click to add text, right-click to delete</title></path>
                {(hasLabel || isEditingLabel) && (
                    <foreignObject x={labelX - 60} y={labelY - 12} width={120} height={24} className="edge-label-container" onDoubleClick={handleDoubleClick} onContextMenu={handleRightClick}>
                        {isEditingLabel ? (
                            <div className="edge-label-editor">
                                <input type="text" value={labelText} onChange={(e) => setLabelText(e.target.value)} onBlur={handleLabelSave} onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()} autoFocus placeholder="Choice text..." />
                            </div>
                        ) : (
                            <div className="edge-label edge-label-visible" onClick={() => setIsEditingLabel(true)} title="Click to edit, right-click to delete connection">{edgeLabels[id]}</div>
                        )}
                    </foreignObject>
                )}
            </>
        );
    };

    const generateLayout = useCallback((dialogues: DialogueEvent[], level: ZoomLevel) => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        if (level === 'mission') {
            const missionGroups = dialogues.reduce((acc, dialogue) => {
                const mission = dialogue.mission || 'Unknown';
                if (!acc[mission]) acc[mission] = [];
                acc[mission].push(dialogue);
                return acc;
            }, {} as Record<string, DialogueEvent[]>);
            Object.entries(missionGroups).forEach(([mission, dialogues], index) => {
                const zones = new Set(dialogues.map(d => d.zone).filter(Boolean));
                newNodes.push({ id: `mission-${mission}`, type: 'mission', position: { x: index * 300, y: 100 }, data: { mission, zoneCount: zones.size, dialogueCount: dialogues.length } });
            });
        } else if (level === 'zone') {
            const zoneGroups = dialogues.reduce((acc, dialogue) => {
                const zone = dialogue.zone || 'Unknown';
                if (!acc[zone]) acc[zone] = [];
                acc[zone].push(dialogue);
                return acc;
            }, {} as Record<string, DialogueEvent[]>);
            Object.entries(zoneGroups).forEach(([zone, dialogues], index) => {
                const row = Math.floor(index / 3); const col = index % 3;
                newNodes.push({ id: `zone-${zone}`, type: 'zone', position: { x: col * 250, y: row * 150 }, data: { zone, dialogueCount: dialogues.length } });
            });
        } else {
            dialogues.forEach((dialogue, index) => {
                const row = Math.floor(index / 4); const col = index % 4;
                newNodes.push({ id: `dialogue-${dialogue.id}`, type: 'dialogue', position: { x: col * 300, y: row * 200 }, data: dialogue });
            });
        }
        return { nodes: newNodes, edges: newEdges };
    }, []);

    const saveCurrentState = useCallback(() => setSavedNodeState({ nodes: [...nodes], edges: [...edges], edgeLabels: { ...edgeLabels } }), [nodes, edges, edgeLabels]);
    const restoreState = useCallback(() => {
        if (savedNodeState) {
            setNodes(savedNodeState.nodes);
            setEdges(savedNodeState.edges);
            setEdgeLabels(savedNodeState.edgeLabels);
        }
    }, [savedNodeState, setNodes, setEdges, setEdgeLabels]);

    useEffect(() => {
        if (savedNodeState && nodes.length === 0) restoreState();
        else if (nodes.length === 0 || zoomLevel !== prevZoomLevel.current) {
            const { nodes: newNodes, edges: newEdges } = generateLayout(filteredData, zoomLevel);
            setNodes(newNodes);
            setEdges(newEdges);
            prevZoomLevel.current = zoomLevel;
        }
    }, [filteredData, zoomLevel, generateLayout, savedNodeState, restoreState, nodes.length]);

    useEffect(() => {
        if (zoomLevel === 'dialogue' && nodes.length > 0) {
            const currentIds = new Set(nodes.filter(n => n.type === 'dialogue').map(n => n.id));
            const missingDialogues = filteredData.filter(d => !currentIds.has(`dialogue-${d.id}`));
            if (missingDialogues.length > 0) {
                const newNodesToAdd = missingDialogues.map((dialogue, index) => {
                    const existingCount = nodes.filter(n => n.type === 'dialogue').length;
                    const row = Math.floor((existingCount + index) / 4); const col = (existingCount + index) % 4;
                    return { id: `dialogue-${dialogue.id}`, type: 'dialogue', position: { x: col * 300, y: row * 200 }, data: dialogue };
                });
                setNodes(prev => [...prev, ...newNodesToAdd]);
            }
        }
    }, [filteredData.length, zoomLevel, nodes, setNodes, filteredData]); // Added setNodes and filteredData

    const onConnect = useCallback((params: Connection) => {
        const newEdge = { ...params, id: `edge-${Date.now()}`, type: 'custom', markerEnd: { type: MarkerType.ArrowClosed, color: '#60a5fa' }, style: { stroke: '#60a5fa', strokeWidth: 2 } };
        setEdges((eds) => addEdge(newEdge, eds));
    }, [setEdges]);

    const handleAddNode = useCallback(() => {
        const newDialogue: Partial<DialogueEvent> = { dialogue_text: 'New dialogue...', speaker: 'Speaker', trigger: 'New trigger', mission: filteredData[0]?.mission || 'Unknown', zone: filteredData[0]?.zone || 'Unknown', game_status: 'Not Started', asset_status: 'Not Started', wwise_status: 'Not Implemented', creator: 'User' };
        onAddRow([newDialogue]);
    }, [filteredData, onAddRow]);

    const handleAddHelperNode = useCallback(() => {
        const nodeId = `helper-${Date.now()}`;
        const newHelper = { id: nodeId, type: 'helper', position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 }, data: { text: 'Scene description...', nodeId } };
        setNodes(prev => [...prev, newHelper]);
    }, [setNodes]);

    const handleResetNodeView = useCallback(() => {
        if (confirm('Reset node view? This will clear all connections and helper nodes.')) {
            setSavedNodeState(null);
            setEdgeLabels({});
            const { nodes: newNodes, edges: newEdges } = generateLayout(filteredData, zoomLevel);
            setNodes(newNodes);
            setEdges(newEdges);
        }
    }, [filteredData, zoomLevel, generateLayout, setNodes, setEdges]);

    const handleZoomChange = useCallback((newLevel: ZoomLevel) => setZoomLevel(newLevel), []);
    const handleFilterChange = useCallback((type: 'selection' | 'mission' | 'zone', value: string) => {
        setCurrentFilter({ type, value });
        if (type !== 'selection') setZoomLevel('dialogue');
    }, []);
    const handleClose = useCallback(() => { saveCurrentState(); onClose(); }, [saveCurrentState, onClose]);

    return (
        <div className="node-designer">
            <div className="node-toolbar">
                <div className="toolbar-left">
                    <button onClick={handleClose} className="btn-secondary">← Back to Table</button>
                    <div className="zoom-controls">
                        <span>Zoom:</span>
                        <button className={`zoom-btn ${zoomLevel === 'mission' ? 'active' : ''}`} onClick={() => handleZoomChange('mission')}>🎮 Missions</button>
                        <button className={`zoom-btn ${zoomLevel === 'zone' ? 'active' : ''}`} onClick={() => handleZoomChange('zone')}>📍 Zones</button>
                        <button className={`zoom-btn ${zoomLevel === 'dialogue' ? 'active' : ''}`} onClick={() => handleZoomChange('dialogue')}>💬 Dialogues</button>
                    </div>
                </div>
                <div className="toolbar-center">
                    <select onChange={(e) => {
                        const [type, value] = e.target.value.split(':');
                        handleFilterChange(type as any, value || '');
                    }}>
                        <option value="selection:">Selected Rows ({selectedRows.length})</option>
                        <optgroup label="Missions">
                            {missions.map(m => <option key={m} value={`mission:${m}`}>Mission: {m}</option>)}
                        </optgroup>
                        <optgroup label="Zones">
                            {zones.map(z => <option key={z} value={`zone:${z}`}>Zone: {z}</option>)}
                        </optgroup>
                    </select>
                </div>
                <div className="toolbar-right">
                    <button onClick={handleAddNode} className="btn-primary">💬 Add Dialogue</button>
                    <button onClick={handleAddHelperNode} className="btn-secondary">📝 Add Note</button>
                    <button onClick={handleResetNodeView} className="btn-danger">🔄 Reset View</button>
                </div>
            </div>

            <div className="flow-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes} // *** CORRECTED: Use `nodeTypes` ***
                    edgeTypes={{ custom: CustomEdge }}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                >
                    <Controls />
                    <Background color="#333" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default NodeDesigner;