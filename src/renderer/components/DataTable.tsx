import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DialogueEvent, DropdownOptions } from '../types';
import { useClipboard } from '../hooks/useClipboard';
import { useUndoRedo } from '../hooks/useUndoRedo';
import './DataTable.css';

interface DataTableProps {
    data: DialogueEvent[];
    dropdownOptions: DropdownOptions;
    onUpdateRow: (id: number, field: string, value: string) => void;
    onAddRow: () => void;
    onDeleteRow: (id: number) => void;
    onAddRows: (rows: Partial<DialogueEvent>[]) => void;
    onUpdateRows: (updates: { id: number; updates: Partial<DialogueEvent> }[]) => void;
    onSetData: (data: DialogueEvent[]) => void;
    onOpenNodeDesigner: (selectedRows: number[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({
                                                 data,
                                                 dropdownOptions,
                                                 onUpdateRow,
                                                 onAddRow,
                                                 onDeleteRow,
                                                 onAddRows,
                                                 onUpdateRows,
                                                 onSetData,
                                                 onOpenNodeDesigner
                                             }) => {
    const [editingCell, setEditingCell] = useState<{row: number, field: string} | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [lastSelectedRow, setLastSelectedRow] = useState<number | null>(null);
    const [focusedCell, setFocusedCell] = useState<{row: number, field: string} | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set([
        'wwise_event_name',
        'game_status',
        'dialogue_event_name',
        'asset_status',
        'creator'
    ]));
    const [tooltip, setTooltip] = useState<{visible: boolean, text: string, x: number, y: number}>({
        visible: false, text: '', x: 0, y: 0
    });
    const tableRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        clipboardData,
        copyCell,
        copyRow,
        copyRows,
        clearClipboard
    } = useClipboard();

    const {
        pushState,
        undo,
        redo,
        canUndo,
        canRedo,
        getCurrentAction,
        getNextAction
    } = useUndoRedo(data);

    // Column definitions - UPDATED order and required status
    const columnDefinitions = [
        { key: 'dialogue_text', label: '💬 Dialogue Text', required: true },
        { key: 'mission', label: '🎮 Mission', required: false, dropdown: true },
        { key: 'zone', label: '📍 Zone', required: false, dropdown: true },
        { key: 'speaker', label: '🎭 Speaker', required: false, dropdown: true },
        { key: 'trigger', label: '⚡ Trigger', required: false },
        { key: 'wwise_event_name', label: '🎵 Wwise Event', required: false },
        { key: 'game_status', label: '📊 Game Status', required: false, dropdown: true },
        { key: 'dialogue_event_name', label: '🎯 Event Name', required: false }, // Moved after game status
        { key: 'asset_status', label: '🎙️ Asset Status', required: false, dropdown: true },
        { key: 'wwise_status', label: '🔊 Wwise Status', required: false, dropdown: true },
        { key: 'notes', label: '📝 Notes', required: false },
        { key: 'creator', label: '👤 Creator', required: false },
        { key: 'updated_at', label: '📅 Updated', required: false }
    ];

    const multiLineFields = ['dialogue_text', 'notes'];
    const dropdownFields = {
        mission: dropdownOptions.missions,
        zone: dropdownOptions.zones,
        speaker: dropdownOptions.speakers,
        game_status: dropdownOptions.gameStatuses,
        asset_status: dropdownOptions.assetStatuses,
        wwise_status: dropdownOptions.wwiseStatuses
    };

    // Utility functions
    const isValidDropdownValue = useCallback((field: string, value: string) => {
        const options = dropdownFields[field as keyof typeof dropdownFields];
        return !options || !value || options.includes(value);
    }, [dropdownFields]);

    const checkTextOverflow = useCallback((element: HTMLElement) => {
        return element.scrollWidth > element.clientWidth;
    }, []);

    const handleMouseEnter = useCallback((e: React.MouseEvent, text: string) => {
        const target = e.currentTarget as HTMLElement;

        // Only show tooltip if text is actually truncated
        if (checkTextOverflow(target) && text.trim()) {
            const rect = target.getBoundingClientRect();
            setTooltip({
                visible: true,
                text: text,
                x: e.clientX + 10,
                y: e.clientY - 10
            });
        }
    }, [checkTextOverflow]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (tooltip.visible) {
            setTooltip(prev => ({
                ...prev,
                x: e.clientX + 10,
                y: e.clientY - 10
            }));
        }
    }, [tooltip.visible]);

    const handleMouseLeave = useCallback(() => {
        setTooltip({ visible: false, text: '', x: 0, y: 0 });
    }, []);

    // Track data changes for undo/redo
    useEffect(() => {
        if (data.length > 0) {
            const timeoutId = setTimeout(() => {
                pushState(data, 'data change');
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [data, pushState]);

    // Click outside to deselect - including empty table areas
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setSelectedRows(new Set());
                setFocusedCell(null);
                setEditingCell(null);
            }
        };

        const handleTableClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                tableRef.current?.contains(target) &&
                !target.closest('tr') &&
                !target.closest('th') &&
                !target.closest('input') &&
                !target.closest('select') &&
                !target.closest('textarea')
            ) {
                setSelectedRows(new Set());
                setFocusedCell(null);
                setEditingCell(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('click', handleTableClick);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('click', handleTableClick);
        };
    }, []);

    // Keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'c':
                        e.preventDefault();
                        handleCopy();
                        break;
                    case 'v':
                        e.preventDefault();
                        handlePaste();
                        break;
                    case 'a':
                        e.preventDefault();
                        if (e.shiftKey) {
                            handleSelectAll();
                        } else {
                            handleSelectFocusedRow();
                        }
                        break;
                    case 'z':
                        e.preventDefault();
                        handleUndo();
                        break;
                    case 'y':
                        e.preventDefault();
                        handleRedo();
                        break;
                }
            }

            if (e.key === 'Delete' && selectedRows.size > 0) {
                e.preventDefault();
                handleDelete();
            }

            if (e.key === 'Escape') {
                setEditingCell(null);
                setSelectedRows(new Set());
                setFocusedCell(null);
                clearClipboard();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedRows, clipboardData, focusedCell, data]);

    // Event handlers
    const handleColumnToggle = useCallback((columnKey: string) => {
        const newHidden = new Set(hiddenColumns);
        if (newHidden.has(columnKey)) {
            newHidden.delete(columnKey);
        } else {
            newHidden.add(columnKey);
        }
        setHiddenColumns(newHidden);
    }, [hiddenColumns]);

    const handleTableWrapperClick = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target === e.currentTarget ||
            target.tagName === 'TABLE' ||
            target.tagName === 'TBODY' ||
            (target.tagName === 'TD' && target.classList.contains('empty-cell'))
        ) {
            setSelectedRows(new Set());
            setFocusedCell(null);
            setEditingCell(null);
        }
    }, []);

    const handleUndo = useCallback(() => {
        const previousData = undo();
        if (previousData) {
            onSetData(previousData);
        }
    }, [undo, onSetData]);

    const handleRedo = useCallback(() => {
        const nextData = redo();
        if (nextData) {
            onSetData(nextData);
        }
    }, [redo, onSetData]);

    const handleDelete = useCallback(() => {
        selectedRows.forEach(id => onDeleteRow(id));
        setSelectedRows(new Set());
    }, [selectedRows, onDeleteRow]);

    const handleSelectFocusedRow = useCallback(() => {
        if (focusedCell) {
            setSelectedRows(new Set([focusedCell.row]));
            setLastSelectedRow(focusedCell.row);
        }
    }, [focusedCell]);

    const handleSelectAll = useCallback(() => {
        setSelectedRows(new Set(data.map(row => row.id)));
    }, [data]);

    const handleCopy = useCallback(() => {
        if (selectedRows.size === 0 && !focusedCell) return;

        if (focusedCell && selectedRows.size === 0) {
            const row = data.find(r => r.id === focusedCell.row);
            if (row) {
                const value = row[focusedCell.field as keyof DialogueEvent];
                copyCell(focusedCell.row, focusedCell.field, value);
            }
        } else if (selectedRows.size === 1) {
            const rowId = Array.from(selectedRows)[0];
            const row = data.find(r => r.id === rowId);
            if (row) copyRow(row);
        } else if (selectedRows.size > 1) {
            const rows = data.filter(r => selectedRows.has(r.id));
            copyRows(rows);
        }
    }, [selectedRows, focusedCell, data, copyCell, copyRow, copyRows]);

    const handlePaste = useCallback(() => {
        if (!clipboardData) return;

        if (clipboardData.type === 'cell') {
            if (focusedCell) {
                onUpdateRow(focusedCell.row, focusedCell.field, clipboardData.data);
            } else if (selectedRows.size === 0) {
                const newRowData: Partial<DialogueEvent> = {};
                if (clipboardData.field) {
                    (newRowData as any)[clipboardData.field] = clipboardData.data;
                }
                onAddRows([newRowData]);
            }
        } else if (clipboardData.type === 'row') {
            if (selectedRows.size === 1) {
                const targetId = Array.from(selectedRows)[0];
                const updates = Object.entries(clipboardData.data).map(([field, value]) => ({
                    id: targetId,
                    field,
                    value: value as string
                }));

                updates.forEach(({ id, field, value }) => {
                    onUpdateRow(id, field, value);
                });
            } else {
                onAddRows([clipboardData.data]);
            }
        } else if (clipboardData.type === 'rows') {
            if (selectedRows.size === clipboardData.data.length) {
                const targetIds = Array.from(selectedRows).sort();
                const updates = targetIds.map((id, index) => ({
                    id,
                    updates: clipboardData.data[index]
                }));
                onUpdateRows(updates);
            } else {
                onAddRows(clipboardData.data);
            }
        }
    }, [clipboardData, focusedCell, selectedRows, onUpdateRow, onAddRows, onUpdateRows]);

    const handleCellClick = useCallback((rowId: number, field: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFocusedCell({ row: rowId, field });

        if (e.detail === 2) {
            setEditingCell({ row: rowId, field });
        }
    }, []);

    const handleCellBlur = useCallback(() => {
        setEditingCell(null);
    }, []);

    const handleCellChange = useCallback((rowId: number, field: string, value: string) => {
        onUpdateRow(rowId, field, value);
    }, [onUpdateRow]);

    const handleRowSelect = useCallback((rowId: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.ctrlKey || e.metaKey) {
            const newSelected = new Set(selectedRows);
            if (newSelected.has(rowId)) {
                newSelected.delete(rowId);
            } else {
                newSelected.add(rowId);
            }
            setSelectedRows(newSelected);
            setLastSelectedRow(rowId);
        } else if (e.shiftKey && lastSelectedRow !== null) {
            const startIndex = data.findIndex(r => r.id === lastSelectedRow);
            const endIndex = data.findIndex(r => r.id === rowId);
            const start = Math.min(startIndex, endIndex);
            const end = Math.max(startIndex, endIndex);

            const rangeIds = data.slice(start, end + 1).map(r => r.id);
            setSelectedRows(new Set([...selectedRows, ...rangeIds]));
        } else {
            setSelectedRows(new Set([rowId]));
            setLastSelectedRow(rowId);
        }
    }, [selectedRows, lastSelectedRow, data]);

    const handleCheckboxChange = useCallback((rowId: number, isSelected: boolean) => {
        const newSelected = new Set(selectedRows);
        if (isSelected) {
            newSelected.add(rowId);
        } else {
            newSelected.delete(rowId);
        }
        setSelectedRows(newSelected);
    }, [selectedRows]);

    const handleSelectAllCheckbox = useCallback((isSelected: boolean) => {
        if (isSelected) {
            setSelectedRows(new Set(data.map(row => row.id)));
        } else {
            setSelectedRows(new Set());
        }
    }, [data]);

    const getStatusBadgeClass = useCallback((field: string, value: string) => {
        const normalizedValue = value.toLowerCase().replace(/\s+/g, '-');

        const statusMap: { [key: string]: string } = {
            'complete': 'status-complete',
            'in-progress': 'status-in-progress',
            'not-started': 'status-not-started',
            'blocked': 'status-blocked',
            'final': 'status-final',
            'recorded': 'status-recorded',
            'implemented': 'status-implemented',
            'needs-revision': 'status-in-progress',
            'not-implemented': 'status-not-started',
            'recording': 'status-in-progress',
            'placeholding': 'status-not-started'
        };

        return statusMap[normalizedValue] || 'status-badge';
    }, []);

    const renderStatusBadge = useCallback((field: string, value: string) => {
        const statusFields = ['game_status', 'asset_status', 'wwise_status'];

        if (statusFields.includes(field) && value) {
            return (
                <span className={`status-badge ${getStatusBadgeClass(field, value)}`}>
          {value}
        </span>
            );
        }

        return value || '';
    }, [getStatusBadgeClass]);

    const renderCell = useCallback((row: DialogueEvent, field: keyof DialogueEvent) => {
        const isEditing = editingCell?.row === row.id && editingCell?.field === field;
        const isFocused = focusedCell?.row === row.id && focusedCell?.field === field;
        const value = row[field]?.toString() || '';

        const isDropdownField = field in dropdownFields;
        const isValidValue = isValidDropdownValue(field, value);

        if (isEditing) {
            if (dropdownFields[field as keyof typeof dropdownFields]) {
                return (
                    <select
                        value={value}
                        onChange={(e) => handleCellChange(row.id, field, e.target.value)}
                        onBlur={handleCellBlur}
                        autoFocus
                        className="cell-editor"
                    >
                        <option value="">Select...</option>
                        {dropdownFields[field as keyof typeof dropdownFields]?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            } else if (multiLineFields.includes(field)) {
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleCellChange(row.id, field, e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleCellBlur();
                            }
                        }}
                        autoFocus
                        className="cell-editor multiline"
                        rows={Math.max(2, value.split('\n').length)}
                    />
                );
            } else {
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleCellChange(row.id, field, e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCellBlur();
                            }
                        }}
                        autoFocus
                        className="cell-editor"
                    />
                );
            }
        }

        const statusFields = ['game_status', 'asset_status', 'wwise_status'];
        if (statusFields.includes(field)) {
            return (
                <div
                    className={`cell-content ${isFocused ? 'focused' : ''} ${!isValidValue ? 'invalid-dropdown' : ''}`}
                    onClick={(e) => handleCellClick(row.id, field, e)}
                    onMouseEnter={(e) => handleMouseEnter(e, value)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {renderStatusBadge(field, value)}
                </div>
            );
        }

        if (multiLineFields.includes(field)) {
            const displayValue = value || '';
            return (
                <div
                    className={`multiline-display ${isFocused ? 'focused' : ''}`}
                    onClick={(e) => handleCellClick(row.id, field, e)}
                    onMouseEnter={(e) => handleMouseEnter(e, displayValue)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {displayValue}
                </div>
            );
        }

        return (
            <div
                className={`cell-content ${isFocused ? 'focused' : ''} ${isDropdownField && !isValidValue ? 'invalid-dropdown' : ''}`}
                onClick={(e) => handleCellClick(row.id, field, e)}
                onMouseEnter={(e) => handleMouseEnter(e, value)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {value}
            </div>
        );
    }, [editingCell, focusedCell, dropdownFields, isValidDropdownValue, multiLineFields, handleCellClick, handleCellChange, handleCellBlur, renderStatusBadge, handleMouseEnter, handleMouseMove, handleMouseLeave]);

    const allSelected = data.length > 0 && selectedRows.size === data.length;
    const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

    return (
        <div className="data-table-container" ref={containerRef}>
            <div className="table-toolbar">
                <button onClick={onAddRow} className="btn-primary">
                    ✨ Add New Event
                </button>
                <button
                    onClick={handleDelete}
                    disabled={selectedRows.size === 0}
                    className="btn-danger"
                >
                    🗑️ Delete Selected ({selectedRows.size})
                </button>

                <button
                    onClick={() => onOpenNodeDesigner(Array.from(selectedRows))}
                    disabled={selectedRows.size === 0}
                    className="btn-node-designer"
                >
                    🔗 Open Node Designer ({selectedRows.size})
                </button>

                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="btn-secondary"
                    title={`Undo ${getCurrentAction()}`}
                >
                    ↶ Undo
                </button>

                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="btn-secondary"
                    title={`Redo ${getNextAction()}`}
                >
                    ↷ Redo
                </button>

                {clipboardData && (
                    <div className="clipboard-indicator">
                        📋 {clipboardData.type === 'cell' ? 'Cell' :
                        clipboardData.type === 'row' ? 'Row' :
                            `${clipboardData.data.length} Rows`} copied
                    </div>
                )}

                <div className="toolbar-spacer" />
                <div className="keyboard-hints">
                    <span>Ctrl+C Copy • Ctrl+V Paste • Ctrl+A Select Row • Ctrl+Shift+A Select All • Ctrl+Z Undo • Del Delete</span>
                </div>
                <span className="row-count">
          📊 Total: {data.length} events
        </span>
            </div>

            <div className="table-wrapper" ref={tableRef} onClick={handleTableWrapperClick}>
                {/* Column visibility controls */}
                <div className="column-controls">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
            Show Columns:
          </span>
                    {columnDefinitions.map(col => (
                        <label key={col.key} className={`column-toggle ${col.required ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                checked={!hiddenColumns.has(col.key)}
                                onChange={() => !col.required && handleColumnToggle(col.key)}
                                disabled={col.required}
                            />
                            {col.label}
                        </label>
                    ))}
                </div>

                <table className="data-table">
                    <thead>
                    <tr>
                        <th className="select-column">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                ref={input => {
                                    if (input) input.indeterminate = someSelected;
                                }}
                                onChange={(e) => handleSelectAllCheckbox(e.target.checked)}
                            />
                        </th>
                        {columnDefinitions.map(col => (
                            <th
                                key={col.key}
                                className={`${hiddenColumns.has(col.key) ? 'column-hidden' : ''} ${col.dropdown ? 'dropdown-header' : ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className={`
                  ${selectedRows.has(row.id) ? 'selected' : ''} 
                  ${clipboardData?.sourceIds?.includes(row.id) ? 'copied-source' : ''}
                `}
                            onClick={(e) => handleRowSelect(row.id, e)}
                        >
                            <td className="select-column">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.has(row.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(row.id, e.target.checked);
                                    }}
                                />
                            </td>
                            {columnDefinitions.map(col => {
                                const isDropdown = col.dropdown;
                                const cellClass = col.key === 'dialogue_text' ? 'dialogue-text-cell' :
                                    col.key === 'notes' ? 'notes-cell' : '';

                                return (
                                    <td
                                        key={col.key}
                                        className={`
                        ${hiddenColumns.has(col.key) ? 'column-hidden' : ''} 
                        ${cellClass}
                        ${isDropdown ? 'dropdown-cell' : ''}
                        ${col.key === 'updated_at' ? 'date-cell' : ''}
                      `}
                                    >
                                        {col.key === 'updated_at'
                                            ? new Date(row.updated_at).toLocaleDateString()
                                            : renderCell(row, col.key as keyof DialogueEvent)
                                        }
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Overflow tooltip at mouse position */}
            {tooltip.visible && (
                <div
                    className="overflow-tooltip visible"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
};

export default DataTable;