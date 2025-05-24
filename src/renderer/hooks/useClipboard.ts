import { useState, useCallback } from 'react';
import { DialogueEvent } from '../types';

interface ClipboardData {
    type: 'cell' | 'row' | 'rows';
    data: any;
    sourceIds?: number[];
    field?: string;
}

export const useClipboard = () => {
    const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null);

    const copyCell = useCallback((rowId: number, field: string, value: any) => {
        setClipboardData({
            type: 'cell',
            data: value,
            sourceIds: [rowId],
            field
        });
        console.log(`Copied cell: ${field} = "${value}"`);
    }, []);

    const copyRow = useCallback((row: DialogueEvent) => {
        const rowCopy = { ...row };
        delete (rowCopy as any).id; // Remove ID so paste creates new row

        setClipboardData({
            type: 'row',
            data: rowCopy,
            sourceIds: [row.id]
        });
        console.log(`Copied row: ${row.dialogue_event_name}`);
    }, []);

    const copyRows = useCallback((rows: DialogueEvent[]) => {
        const rowsCopy = rows.map(row => {
            const rowCopy = { ...row };
            delete (rowCopy as any).id; // Remove IDs so paste creates new rows
            return rowCopy;
        });

        setClipboardData({
            type: 'rows',
            data: rowsCopy,
            sourceIds: rows.map(r => r.id)
        });
        console.log(`Copied ${rows.length} rows`);
    }, []);

    const clearClipboard = useCallback(() => {
        setClipboardData(null);
        console.log('Clipboard cleared');
    }, []);

    return {
        clipboardData,
        copyCell,
        copyRow,
        copyRows,
        clearClipboard
    };
};