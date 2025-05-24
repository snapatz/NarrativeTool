import { useState, useCallback, useRef } from 'react';
import { DialogueEvent } from '../types';

interface HistoryState {
    data: DialogueEvent[];
    timestamp: number;
    action: string;
}

export const useUndoRedo = (initialData: DialogueEvent[]) => {
    const [history, setHistory] = useState<HistoryState[]>([
        { data: [...initialData], timestamp: Date.now(), action: 'initial' }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const lastPushTime = useRef(0);

    const pushState = useCallback((data: DialogueEvent[], action: string) => {
        const now = Date.now();
        // Debounce rapid changes (within 500ms)
        if (now - lastPushTime.current < 500) {
            return;
        }
        lastPushTime.current = now;

        setHistory(prev => {
            // Remove any future states if we're not at the end
            const newHistory = prev.slice(0, currentIndex + 1);
            // Add new state
            const newState = { data: [...data], timestamp: now, action };
            const updatedHistory = [...newHistory, newState];

            // Limit history size to prevent memory issues
            const maxHistorySize = 50;
            const finalHistory = updatedHistory.length > maxHistorySize
                ? updatedHistory.slice(-maxHistorySize)
                : updatedHistory;

            return finalHistory;
        });

        setCurrentIndex(prev => {
            const newIndex = prev + 1;
            return Math.min(newIndex, 49); // Cap at max history size - 1
        });
    }, [currentIndex]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            return history[newIndex]?.data || null;
        }
        return null;
    }, [currentIndex, history]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            return history[newIndex]?.data || null;
        }
        return null;
    }, [currentIndex, history]);

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    const getCurrentAction = useCallback(() => {
        const current = history[currentIndex];
        return current?.action || '';
    }, [currentIndex, history]);

    const getNextAction = useCallback(() => {
        const next = history[currentIndex + 1];
        return next?.action || '';
    }, [currentIndex, history]);

    return {
        pushState,
        undo,
        redo,
        canUndo,
        canRedo,
        getCurrentAction,
        getNextAction
    };
};