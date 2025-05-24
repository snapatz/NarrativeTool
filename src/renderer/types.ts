export interface DialogueEvent {
    id: number;
    dialogue_text: string; // Add this line
    dialogue_event_name: string;
    wwise_event_name: string;
    mission: string;
    zone: string;
    speaker: string;
    trigger: string;
    integration_notes: string;
    related_game_asset: string;
    game_status: string;
    asset_status: string;
    wwise_status: string;
    dev_revision_note: string;
    notes: string;
    creator: string;
    created_at: string;
    updated_at: string;
}

export interface DropdownOptions {
    missions: string[];
    zones: string[];
    speakers: string[];
    gameStatuses: string[];
    assetStatuses: string[];
    wwiseStatuses: string[];
}