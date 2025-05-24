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
    NodeTypes,
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

// Custom Node Types
const DialogueNode = ({ data }: { data: any }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="dialogue-node">
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: '#60a5fa',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white'
                }}
            />

            <div className="node-header">
                <span className="speaker">🎭 {data.speaker || 'Unknown'}</span>
                <button
                    className="details-btn"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    📋
                </button>
            </div>
            <div className="dialogue-text">
                {data.dialogue_text || 'No dialogue'}
            </div>
            <div className="trigger">
                ⚡ {data.trigger || 'No trigger'}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: '#60a5fa',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white'
                }}
            />

            {showDetails && (
                <div className="details-popup">
                    <div className="popup-content">
                        <button
                            className="close-popup"
                            onClick={() => setShowDetails(false)}
                        >
                            ✕
                        </button>
                        <h4>Full Details</h4>
                        <div className="detail-row">
                            <strong>Event Name:</strong> {data.dialogue_event_name}
                        </div>
                        <div className="detail-row">
                            <strong>Mission:</strong> {data.mission}
                        </div>
                        <div className="detail-row">
                            <strong>Zone:</strong> {data.zone}
                        </div>
                        <div className="detail-row">
                            <strong>Game Status:</strong> {data.game_status}
                        </div>
                        <div className="detail-row">
                            <strong>Asset Status:</strong> {data.asset_status}
                        </div>
                        <div className="detail-row">
                            <strong>Notes:</strong> {data.notes}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ZoneNode = ({ data }: { data: any }) => {
    return (
        <div className="zone-node">
            <div className="zone-header">
                <span className="zone-title">📍 {data.zone}</span>
                <span className="dialogue-count">{data.dialogueCount} lines</span>
            </div>
        </div>
    );
};

const MissionNode = ({ data }: { data: any }) => {
    return (
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
};

const HelperNode = ({ data }: { data: any }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(data.text || 'Scene description...');

    const handleSave = () => {
        data.text = text;
        setIsEditing(false);
    };

    return (
        <div className="helper-node">
            <div className="helper-header">
                <span className="helper-icon">📝</span>
                <button
                    className="edit-helper-btn"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    ✏️
                </button>
            </div>
            {isEditing ? (
                <div className="helper-editor">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add scene description, notes, or context..."
                        rows={3}
                        autoFocus
                    />
                    <div className="helper-buttons">
                        <button onClick={handleSave} className="save-btn">Save</button>
                        <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="helper-text" onClick={() => setIsEditing(true)}>
                    {text}
                </div>
            )}
        </div>
    );
};

const nodeTypes: NodeTypes = {
    dialogue: DialogueNode,
    zone: ZoneNode,
    mission: MissionNode,
    helper: HelperNode,
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

    // Persistent state
    const [savedNodeState, setSavedNodeState] = useState<{
        nodes: Node[];
        edges: Edge[];
        edgeLabels: { [key: string]: string };
    } | null>(null);

    const prevZoomLevel = useRef(zoomLevel);

    // Filter data based on current mode
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

    // Get unique missions and zones for filtering
    const missions = useMemo(() =>
            Array.from(new Set(data.map(row => row.mission).filter(Boolean))),
        [data]
    );

    const zones = useMemo(() =>
            Array.from(new Set(data.map(row => row.zone).filter(Boolean))),
        [data]
    );

    // Custom Edge with labels
    const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }: any) => {
        const [isEditingLabel, setIsEditingLabel] = useState(false);
        const [labelText, setLabelText] = useState(edgeLabels[id] || '');

        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;

        const handleLabelSave = () => {
            setEdgeLabels(prev => ({ ...prev, [id]: labelText }));
            setIsEditingLabel(false);
        };

        return (
            <>
                <path
                    d={`M ${sourceX} ${sourceY} Q ${midX} ${midY - 50} ${targetX} ${targetY}`}
                    style={style}
                    fill="none"
                    markerEnd={markerEnd}
                />
                <foreignObject
                    x={midX - 50}
                    y={midY - 10}
                    width={100}
                    height={20}
                    className="edge-label-container"
                >
                    {isEditingLabel ? (
                        <div className="edge-label-editor">
                            <input
                                type="text"
                                value={labelText}
                                onChange={(e) => setLabelText(e.target.value)}
                                onBlur={handleLabelSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()}
                                autoFocus
                                placeholder="Choice text..."
                            />
                        </div>
                    ) : (
                        <div
                            className="edge-label"
                            onClick={() => setIsEditingLabel(true)}
                        >
                            {edgeLabels[id] || '+'}
                        </div>
                    )}
                </foreignObject>
            </>
        );
    };

    // Auto-layout algorithm
    const generateLayout = useCallback((dialogues: DialogueEvent[], level: ZoomLevel) => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        if (level === 'mission') {
            const missionGroups = dialogues.reduce((acc, dialogue) => {
                const mission = dialogue.mission || 'Unknown';
                if (!acc[mission]) {
                    acc[mission] = [];
                }
                acc[mission].push(dialogue);
                return acc;
            }, {} as Record<string, DialogueEvent[]>);

            Object.entries(missionGroups).forEach(([mission, dialogues], index) => {
                const zones = new Set(dialogues.map(d => d.zone).filter(Boolean));

                newNodes.push({
                    id: `mission-${mission}`,
                    type: 'mission',
                    position: { x: index * 300, y: 100 },
                    data: {
                        mission,
                        zoneCount: zones.size,
                        dialogueCount: dialogues.length
                    }
                });
            });

        } else if (level === 'zone') {
            const zoneGroups = dialogues.reduce((acc, dialogue) => {
                const zone = dialogue.zone || 'Unknown';
                if (!acc[zone]) {
                    acc[zone] = [];
                }
                acc[zone].push(dialogue);
                return acc;
            }, {} as Record<string, DialogueEvent[]>);

            Object.entries(zoneGroups).forEach(([zone, dialogues], index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;

                newNodes.push({
                    id: `zone-${zone}`,
                    type: 'zone',
                    position: { x: col * 250, y: row * 150 },
                    data: {
                        zone,
                        dialogueCount: dialogues.length
                    }
                });
            });

        } else {
            dialogues.forEach((dialogue, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;

                newNodes.push({
                    id: `dialogue-${dialogue.id}`,
                    type: 'dialogue',
                    position: { x: col * 300, y: row * 200 },
                    data: dialogue,
                });
            });
        }

        return { nodes: newNodes, edges: newEdges };
    }, []);

    // Save current state
    const saveCurrentState = useCallback(() => {
        setSavedNodeState({
            nodes: [...nodes],
            edges: [...edges],
            edgeLabels: { ...edgeLabels }
        });
        console.log("Saved node state");
    }, [nodes, edges, edgeLabels]);

    // Restore state
    const restoreState = useCallback(() => {
        if (savedNodeState) {
            setNodes(savedNodeState.nodes);
            setEdges(savedNodeState.edges);
            setEdgeLabels(savedNodeState.edgeLabels);
            console.log("Restored node state");
        }
    }, [savedNodeState, setNodes, setEdges]);

    // Initial layout generation and zoom changes
    useEffect(() => {
        if (savedNodeState && nodes.length === 0) {
            restoreState();
        } else if (nodes.length === 0 || zoomLevel !== prevZoomLevel.current) {
            console.log("Generating layout:", { zoomLevel, filteredDataLength: filteredData.length });
            const { nodes: newNodes, edges: newEdges } = generateLayout(filteredData, zoomLevel);
            setNodes(newNodes);
            setEdges(newEdges);
            prevZoomLevel.current = zoomLevel;
        }
    }, [filteredData, zoomLevel, generateLayout, savedNodeState, restoreState, nodes.length]);

    // Handle new data additions (dialogue level only)
    useEffect(() => {
        if (zoomLevel === 'dialogue' && nodes.length > 0) {
            const currentIds = new Set(nodes.filter(n => n.type === 'dialogue').map(n => n.id));
            const missingDialogues = filteredData.filter(d => !currentIds.has(`dialogue-${d.id}`));

            if (missingDialogues.length > 0) {
                console.log("Adding missing nodes:", missingDialogues.length);
                const newNodes = missingDialogues.map((dialogue, index) => {
                    const existingCount = nodes.filter(n => n.type === 'dialogue').length;
                    const row = Math.floor((existingCount + index) / 4);
                    const col = (existingCount + index) % 4;

                    return {
                        id: `dialogue-${dialogue.id}`,
                        type: 'dialogue',
                        position: { x: col * 300, y: row * 200 },
                        data: dialogue,
                    };
                });

                setNodes(prev => [...prev, ...newNodes]);
            }
        }
    }, [filteredData.length, zoomLevel, nodes]);

    // Connection handling
    const onConnect = useCallback(
        (params: Connection) => {
            const newEdge = {
                ...params,
                id: `edge-${Date.now()}`,
                type: 'custom',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#60a5fa',
                },
                style: {
                    stroke: '#60a5fa',
                    strokeWidth: 2,
                },
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );

    // Edge deletion (removed for now - interferes with choice text editing)
    // const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    //     event.stopPropagation();
    //     if (confirm(`Delete connection "${edgeLabels[edge.id] || 'Untitled'}"?`)) {
    //         setEdges(prev => prev.filter(e => e.id !== edge.id));
    //         setEdgeLabels(prev => {
    //             const newLabels = { ...prev };
    //             delete newLabels[edge.id];
    //             return newLabels;
    //         });
    //     }
    // }, [edgeLabels, setEdges]);

    // Node handlers
    const handleAddNode = useCallback(() => {
        const newDialogue: Partial<DialogueEvent> = {
            dialogue_text: 'New dialogue...',
            speaker: 'Speaker',
            trigger: 'New trigger',
            mission: filteredData[0]?.mission || 'Unknown',
            zone: filteredData[0]?.zone || 'Unknown',
            game_status: 'Not Started',
            asset_status: 'Not Started',
            wwise_status: 'Not Implemented',
            creator: 'User',
        };

        onAddRow([newDialogue]);
    }, [filteredData, onAddRow]);

    const handleAddHelperNode = useCallback(() => {
        const newHelper = {
            id: `helper-${Date.now()}`,
            type: 'helper',
            position: {
                x: Math.random() * 300 + 100,
                y: Math.random() * 200 + 100
            },
            data: { text: 'Scene description...' },
        };

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

    const handleZoomChange = useCallback((newLevel: ZoomLevel) => {
        setZoomLevel(newLevel);
    }, []);

    const handleFilterChange = useCallback((type: 'selection' | 'mission' | 'zone', value: string) => {
        setCurrentFilter({ type, value });
        if (type !== 'selection') {
            setZoomLevel('dialogue');
        }
    }, []);

    const handleClose = useCallback(() => {
        saveCurrentState();
        onClose();
    }, [saveCurrentState, onClose]);

    return (
        <div className="node-designer">
            <div className="node-toolbar">
                <div className="toolbar-left">
                    <button onClick={handleClose} className="btn-secondary">
                        ← Back to Table
                    </button>

                    <div className="zoom-controls">
                        <span>Zoom Level:</span>
                        <button
                            className={`zoom-btn ${zoomLevel === 'mission' ? 'active' : ''}`}
                            onClick={() => handleZoomChange('mission')}
                        >
                            🎮 Missions
                        </button>
                        <button
                            className={`zoom-btn ${zoomLevel === 'zone' ? 'active' : ''}`}
                            onClick={() => handleZoomChange('zone')}
                        >
                            📍 Zones
                        </button>
                        <button
                            className={`zoom-btn ${zoomLevel === 'dialogue' ? 'active' : ''}`}
                            onClick={() => handleZoomChange('dialogue')}
                        >
                            💬 Dialogues
                        </button>
                    </div>
                </div>

                <div className="toolbar-center">
                    <div className="filter-controls">
                        <select
                            value={currentFilter.type === 'selection' ? 'selection' : currentFilter.value}
                            onChange={(e) => {
                                if (e.target.value === 'selection') {
                                    handleFilterChange('selection', '');
                                } else if (missions.includes(e.target.value)) {
                                    handleFilterChange('mission', e.target.value);
                                } else if (zones.includes(e.target.value)) {
                                    handleFilterChange('zone', e.target.value);
                                }
                            }}
                        >
                            <option value="selection">Selected Rows ({selectedRows.length})</option>
                            <optgroup label="Missions">
                                {missions.map(mission => (
                                    <option key={mission} value={mission}>Mission: {mission}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Zones">
                                {zones.map(zone => (
                                    <option key={zone} value={zone}>Zone: {zone}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div className="toolbar-right">
                    <button onClick={handleAddNode} className="btn-primary">
                        💬 Add Dialogue
                    </button>
                    <button onClick={handleAddHelperNode} className="btn-secondary">
                        📝 Add Note
                    </button>
                    <button onClick={handleResetNodeView} className="btn-danger">
                        🔄 Reset View
                    </button>
                    <span className="node-count">{filteredData.length} items</span>
                </div>
            </div>

            <div className="flow-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    // onEdgeClick={onEdgeClick} // Removed - interferes with choice text editing
                    nodeTypes={nodeTypes}
                    edgeTypes={{ custom: CustomEdge }}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    fitViewOptions={{
                        padding: 0.2,
                    }}
                >
                    <Controls />
                    <Background color="#333" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default NodeDesigner;