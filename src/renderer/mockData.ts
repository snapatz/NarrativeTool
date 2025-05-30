﻿import { DialogueEvent, DropdownOptions } from './types';

export const mockDialogueEvents: DialogueEvent[] = [
    // MISSION 3 - ZONE 0 - UNDERGROUND CONTROL ROOM
    // Pre-infiltration setup
    {
        id: 1,
        dialogue_text: "Alright team, elevator's moving. Harper, you got eyes on the control room layout?",
        dialogue_event_name: "dx_m03_z00_harper_elevator_briefing",
        wwise_event_name: "Play_dx_m03_z00_harper_elevator_briefing",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Elevator descent begins",
        integration_notes: "Plays when elevator starts moving down\nShould feel urgent but controlled\nBackground elevator mechanical sounds",
        related_game_asset: "BP_ElevatorSequence",
        game_status: "In Progress",
        asset_status: "Recorded",
        wwise_status: "Implemented",
        dev_revision_note: "Audio mix good, maybe reduce reverb slightly",
        notes: "Professional military tone\nHarper is the team leader\nNeed subtle tension in delivery",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T10:00:00Z",
        updated_at: "2025-05-24T14:30:00Z"
    },
    {
        id: 2,
        dialogue_text: "Roger that. Thermal shows three guards on patrol, two at the main console. David's team should kill the power in... ninety seconds.",
        dialogue_event_name: "dx_m03_z00_lance_sitrep_thermal",
        wwise_event_name: "Play_dx_m03_z00_lance_sitrep_thermal",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Player checks thermal scanner",
        integration_notes: "Triggered by player interaction with scanner device\nShow thermal overlay on screen during line\nStaticky radio effect",
        related_game_asset: "BP_ThermalScanner",
        game_status: "Complete",
        asset_status: "Final",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "Lance is the tech specialist\nCool, analytical delivery\nSlight radio distortion",
        creator: "SoundDesigner",
        created_at: "2025-05-20T14:30:00Z",
        updated_at: "2025-05-24T09:15:00Z"
    },
    {
        id: 3,
        dialogue_text: "Copy. Remember, we've got exactly two minutes once those lights go dark. Move fast, move quiet.",
        dialogue_event_name: "dx_m03_z00_harper_final_reminder",
        wwise_event_name: "Play_dx_m03_z00_harper_final_reminder",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Elevator reaches target floor",
        integration_notes: "Plays as elevator stops\nElevator mechanical sounds should fade\nTension building moment",
        related_game_asset: "BP_ElevatorSequence",
        game_status: "Complete",
        asset_status: "Recorded",
        wwise_status: "Implemented",
        dev_revision_note: "Perfect timing with elevator stop",
        notes: "Command authority\nBuilding tension for infiltration\nEmphasize 'two minutes'",
        creator: "NarrativeDesigner",
        created_at: "2025-05-22T11:00:00Z",
        updated_at: "2025-05-24T10:45:00Z"
    },
    // Power cut sequence
    {
        id: 4,
        dialogue_text: "David here. Power grid accessed. Cutting main lines in 3... 2... 1... Dark.",
        dialogue_event_name: "dx_m03_z00_david_power_countdown",
        wwise_event_name: "Play_dx_m03_z00_david_power_countdown",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "David",
        trigger: "Timer reaches 00:00",
        integration_notes: "Radio transmission from David's team\nHeavy radio static\nTimed with lights going out\nElectrical shutdown sounds",
        related_game_asset: "BP_PowerGrid_Controller",
        game_status: "In Progress",
        asset_status: "Recorded",
        wwise_status: "Needs Revision",
        dev_revision_note: "Need better sync with light shutdown sequence",
        notes: "David is demolitions expert\nGritty, confident voice\nCountdown should match visual timer",
        creator: "SoundDesigner",
        created_at: "2025-05-23T16:20:00Z",
        updated_at: "2025-05-24T12:00:00Z"
    },
    {
        id: 5,
        dialogue_text: "Lights out! Go, go, go! Two minutes on the clock!",
        dialogue_event_name: "dx_m03_z00_harper_infiltration_start",
        wwise_event_name: "Play_dx_m03_z00_harper_infiltration_start",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Lights go out",
        integration_notes: "Immediate response to power cut\nStart stealth gameplay timer\nSwitch to night vision audio filter",
        related_game_asset: "BP_StealthGameplay_Manager",
        game_status: "Complete",
        asset_status: "Final",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "High energy command\nUrgent but not panicked\nTriggers mission timer UI",
        creator: "NarrativeDesigner",
        created_at: "2025-05-21T09:30:00Z",
        updated_at: "2025-05-23T15:45:00Z"
    },
    // Stealth infiltration
    {
        id: 6,
        dialogue_text: "Guard patrol passing your position. Hold.",
        dialogue_event_name: "dx_m03_z00_lance_guard_warning",
        wwise_event_name: "Play_dx_m03_z00_lance_guard_warning",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Guard enters detection radius",
        integration_notes: "Whispered radio transmission\nTrigger player crouch/hide prompt\nGuard footstep audio should be prominent",
        related_game_asset: "BP_GuardPatrol_AIController",
        game_status: "In Progress",
        asset_status: "Recording",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Whispered delivery\nTense, urgent warning\nNeed very quiet audio levels",
        creator: "SoundDesigner",
        created_at: "2025-05-24T08:00:00Z",
        updated_at: "2025-05-24T08:00:00Z"
    },
    {
        id: 7,
        dialogue_text: "Clear. Moving to console. One minute thirty remaining.",
        dialogue_event_name: "dx_m03_z00_harper_progress_update",
        wwise_event_name: "Play_dx_m03_z00_harper_progress_update",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Player reaches main console",
        integration_notes: "Plays when player interacts with main terminal\nUpdate mission timer display\nComputer interface sounds",
        related_game_asset: "BP_MainConsole_Interactive",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Controlled tension\nTime pressure building\nProfessional military report",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T14:00:00Z",
        updated_at: "2025-05-24T14:00:00Z"
    },
    // Tension escalation
    {
        id: 8,
        dialogue_text: "Shit! Emergency power kicking in! We've got partial lighting coming back online!",
        dialogue_event_name: "dx_m03_z00_david_emergency_power_alert",
        wwise_event_name: "Play_dx_m03_z00_david_emergency_power_alert",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "David",
        trigger: "Timer reaches 01:00 remaining",
        integration_notes: "Radio transmission with interference\nEmergency lighting activates\nElectrical humming sounds\nTension spike moment",
        related_game_asset: "BP_EmergencyPower_System",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Stressed, urgent delivery\nDavid is usually calm - this shows pressure\nSwearing appropriate for M-rated game",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T14:15:00Z",
        updated_at: "2025-05-24T14:15:00Z"
    },
    {
        id: 9,
        dialogue_text: "Forty seconds! Harper, whatever you're doing, do it faster!",
        dialogue_event_name: "dx_m03_z00_lance_time_pressure",
        wwise_event_name: "Play_dx_m03_z00_lance_time_pressure",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Timer reaches 00:40",
        integration_notes: "High tension radio call\nGuard alertness increases\nFaster heartbeat audio cue",
        related_game_asset: "BP_MissionTimer_Controller",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Lance losing his usual cool\nDesperation creeping in\nShould feel like everything's going wrong",
        creator: "SoundDesigner",
        created_at: "2025-05-24T14:20:00Z",
        updated_at: "2025-05-24T14:20:00Z"
    },
    // Mission completion variants
    {
        id: 10,
        dialogue_text: "Got it! Data downloaded! Let's get the hell out of here!",
        dialogue_event_name: "dx_m03_z00_harper_mission_success",
        wwise_event_name: "Play_dx_m03_z00_harper_mission_success",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Data download completes",
        integration_notes: "Success state dialogue\nTriumphant but still urgent\nDownload complete sound effect\nStart extraction music",
        related_game_asset: "BP_DataDownload_Success",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Relief and excitement\nMission accomplished tone\nStill need to escape - not over yet",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T14:25:00Z",
        updated_at: "2025-05-24T14:25:00Z"
    },
    {
        id: 11,
        dialogue_text: "Fifteen seconds! Harper, we need to move NOW!",
        dialogue_event_name: "dx_m03_z00_lance_final_countdown",
        wwise_event_name: "Play_dx_m03_z00_lance_final_countdown",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Timer reaches 00:15",
        integration_notes: "Panic dialogue for slow players\nAlarm sounds intensify\nHeartbeat audio at maximum\nRed screen flash effects",
        related_game_asset: "BP_MissionTimer_Critical",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Pure panic\nLance completely losing it\nPlayer pressure at maximum\nShould make player feel urgency",
        creator: "SoundDesigner",
        created_at: "2025-05-24T14:30:00Z",
        updated_at: "2025-05-24T14:30:00Z"
    },
    // BRANCHING PATH 1: Player spots guard early - STEALTH SUCCESS
    {
        id: 12,
        dialogue_text: "Good eyes. Guard didn't see you. Continue to the console.",
        dialogue_event_name: "dx_m03_z00_lance_stealth_success_A",
        wwise_event_name: "Play_dx_m03_z00_lance_stealth_success_A",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Player successfully hides from Guard_01",
        integration_notes: "Positive feedback for good stealth\nQuiet, approving tone\nBranches from guard_warning (id:6)",
        related_game_asset: "BP_StealthSuccess_Trigger",
        game_status: "Complete",
        asset_status: "Recorded",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "Rewarding player skill\nLance showing approval\nKeeps tension but acknowledges success",
        creator: "SoundDesigner",
        created_at: "2025-05-24T10:30:00Z",
        updated_at: "2025-05-24T13:00:00Z"
    },
    // BRANCHING PATH 1B: Player gets spotted - STEALTH FAILED
    {
        id: 13,
        dialogue_text: "Contact! You've been made! Take him down, quietly!",
        dialogue_event_name: "dx_m03_z00_harper_stealth_blown_A",
        wwise_event_name: "Play_dx_m03_z00_harper_stealth_blown_A",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Guard_01 spots player",
        integration_notes: "Alternative branch from guard_warning (id:6)\nUrgent whisper-shout\nTriggers combat QTE sequence",
        related_game_asset: "BP_StealthFailed_Combat",
        game_status: "In Progress",
        asset_status: "Recorded",
        wwise_status: "Needs Revision",
        dev_revision_note: "Need better blend with combat music stinger",
        notes: "Controlled panic\nStill trying to maintain stealth\nPlayer skill check moment",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T11:15:00Z",
        updated_at: "2025-05-24T14:45:00Z"
    },
    // COMBAT QTE SUCCESS PATH
    {
        id: 14,
        dialogue_text: "Clean takedown. Drag the body into the shadows, quick.",
        dialogue_event_name: "dx_m03_z00_harper_combat_success_A",
        wwise_event_name: "Play_dx_m03_z00_harper_combat_success_A",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Player completes takedown QTE successfully",
        integration_notes: "Follows stealth_blown_A (id:13)\nRelief in voice\nContinues stealth mission\nBody dragging animation",
        related_game_asset: "BP_TakedownSuccess_Animation",
        game_status: "Complete",
        asset_status: "Final",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "Professional approval\nCrisis handled well\nMission continues on stealth path",
        creator: "SoundDesigner",
        created_at: "2025-05-23T15:20:00Z",
        updated_at: "2025-05-24T09:30:00Z"
    },
    // COMBAT QTE FAILURE PATH
    {
        id: 15,
        dialogue_text: "Gunshot! The whole floor heard that! All units, we're going loud!",
        dialogue_event_name: "dx_m03_z00_harper_combat_failure_A",
        wwise_event_name: "Play_dx_m03_z00_harper_combat_failure_A",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Player fails takedown QTE - guard shoots",
        integration_notes: "Follows stealth_blown_A (id:13)\nMission switches to combat mode\nAlarm systems activate\nAction music starts",
        related_game_asset: "BP_CombatMode_Transition",
        game_status: "In Progress",
        asset_status: "Recorded",
        wwise_status: "Implemented",
        dev_revision_note: "Perfect sync with alarm sound effect",
        notes: "Everything's gone wrong\nEmergency command decision\nMission completely changes",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T12:45:00Z",
        updated_at: "2025-05-24T15:00:00Z"
    },
    // COMBAT MODE CONTINUATION
    {
        id: 16,
        dialogue_text: "Lance, how many hostiles on this floor? We're fighting our way to that console!",
        dialogue_event_name: "dx_m03_z00_harper_combat_sitrep",
        wwise_event_name: "Play_dx_m03_z00_harper_combat_sitrep",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "5 seconds after combat_failure_A (id:15)",
        integration_notes: "Combat mode dialogue\nGunfire and alarms in background\nTactical assessment under fire",
        related_game_asset: "BP_CombatDialogue_Manager",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "War-time leadership\nAdapting to crisis\nPlayer still needs to reach objective",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T15:15:00Z",
        updated_at: "2025-05-24T15:15:00Z"
    },
    // BRANCHING PATH 2: Console interaction - QUICK SUCCESS
    {
        id: 17,
        dialogue_text: "Nice work! Data's flowing clean. Thirty seconds and we're golden.",
        dialogue_event_name: "dx_m03_z00_lance_download_fast",
        wwise_event_name: "Play_dx_m03_z00_lance_download_fast",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Player completes console hack in under 20 seconds",
        integration_notes: "Skill-based branch from progress_update (id:7)\nFast download progress bar\nReward for player skill",
        related_game_asset: "BP_FastDownload_Success",
        game_status: "Complete",
        asset_status: "Recorded",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "Lance impressed by player skill\nPositive reinforcement\nCreates easier endgame",
        creator: "SoundDesigner",
        created_at: "2025-05-22T16:30:00Z",
        updated_at: "2025-05-24T11:45:00Z"
    },
    // BRANCHING PATH 2B: Console interaction - SLOW/STRUGGLING
    {
        id: 18,
        dialogue_text: "Come on, this encryption is tougher than expected. I need more time!",
        dialogue_event_name: "dx_m03_z00_lance_download_slow",
        wwise_event_name: "Play_dx_m03_z00_lance_download_slow",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "Player takes longer than 30 seconds on console hack",
        integration_notes: "Alternative branch from progress_update (id:7)\nSlow progress bar\nBuilds more tension for time limit",
        related_game_asset: "BP_SlowDownload_Struggle",
        game_status: "In Progress",
        asset_status: "Recording",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Lance under pressure\nPlayer feeling time pressure\nMakes emergency power more threatening",
        creator: "SoundDesigner",
        created_at: "2025-05-24T13:30:00Z",
        updated_at: "2025-05-24T13:30:00Z"
    },
    // PLAYER CHOICE: Save teammate vs Continue mission
    {
        id: 19,
        dialogue_text: "Harper! Lance is pinned down by security! Do we help him or continue the download?",
        dialogue_event_name: "dx_m03_z00_david_moral_choice",
        wwise_event_name: "Play_dx_m03_z00_david_moral_choice",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "David",
        trigger: "If combat mode active AND download at 50%",
        integration_notes: "Player choice moment\nUI presents two options\nMoral decision under pressure\nTimed choice (10 seconds)",
        related_game_asset: "BP_MoralChoice_UI",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "David torn between mission and team\nPlayer agency moment\nReal consequences for choice",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T15:30:00Z",
        updated_at: "2025-05-24T15:30:00Z"
    },
    // CHOICE A: Save Lance
    {
        id: 20,
        dialogue_text: "We don't leave people behind! David, covering fire! I'm getting Lance!",
        dialogue_event_name: "dx_m03_z00_harper_save_lance",
        wwise_event_name: "Play_dx_m03_z00_harper_save_lance",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Player chooses 'Save Lance' option",
        integration_notes: "Heroic choice response\nIntense gunfire sequence\nDownload pauses/slows\nTeam loyalty path",
        related_game_asset: "BP_RescueSequence_Lance",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Harper's moral code\nTeam before mission\nRisks mission failure but saves relationship",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T15:35:00Z",
        updated_at: "2025-05-24T15:35:00Z"
    },
    // CHOICE B: Continue mission
    {
        id: 21,
        dialogue_text: "Lance knew the risks! The mission comes first! Keep that download running!",
        dialogue_event_name: "dx_m03_z00_harper_mission_priority",
        wwise_event_name: "Play_dx_m03_z00_harper_mission_priority",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Player chooses 'Continue Mission' option",
        integration_notes: "Cold tactical choice\nDownload continues at full speed\nLance's struggle audio continues\nRuthless efficiency path",
        related_game_asset: "BP_ColdChoice_Consequences",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Harper's military training overrides emotion\nEfficient but costs team morale\nEasier mission completion",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T15:40:00Z",
        updated_at: "2025-05-24T15:40:00Z"
    },
    // CONSEQUENCE: Lance saved - team bonding
    {
        id: 22,
        dialogue_text: "Thanks for coming back for me, Harper. I won't forget this.",
        dialogue_event_name: "dx_m03_z00_lance_gratitude",
        wwise_event_name: "Play_dx_m03_z00_lance_gratitude",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "After successful Lance rescue",
        integration_notes: "Emotional payoff for heroic choice\nTeam relationship improved\nFollows save_lance (id:20)",
        related_game_asset: "BP_TeamBonding_Positive",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Genuine gratitude\nBuilds team loyalty for future missions\nEmotional reward for player choice",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T15:45:00Z",
        updated_at: "2025-05-24T15:45:00Z"
    },
    // CONSEQUENCE: Lance abandoned - team tension
    {
        id: 23,
        dialogue_text: "Roger that, command. Lance here... barely. Good to know where I stand.",
        dialogue_event_name: "dx_m03_z00_lance_bitter",
        wwise_event_name: "Play_dx_m03_z00_lance_bitter",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Lance",
        trigger: "After player chose mission over rescue",
        integration_notes: "Bitter consequence dialogue\nTeam relationship damaged\nFollows mission_priority (id:21)\nSurvived but resentful",
        related_game_asset: "BP_TeamBonding_Negative",
        game_status: "Not Started",
        asset_status: "Not Started",
        wwise_status: "Not Implemented",
        dev_revision_note: "",
        notes: "Hurt and resentful\nDamages team dynamics for future\nConsequence for cold choice",
        creator: "SoundDesigner",
        created_at: "2025-05-24T15:50:00Z",
        updated_at: "2025-05-24T15:50:00Z"
    },
    // FINAL SUCCESS - Multiple variants based on previous choices
    {
        id: 24,
        dialogue_text: "Got it! Data downloaded! Let's get the hell out of here!",
        dialogue_event_name: "dx_m03_z00_harper_mission_success",
        wwise_event_name: "Play_dx_m03_z00_harper_mission_success",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Data download completes - standard path",
        integration_notes: "Standard success dialogue\nTriumphant but still urgent\nDownload complete sound effect\nStart extraction music",
        related_game_asset: "BP_DataDownload_Success",
        game_status: "Complete",
        asset_status: "Final",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "Relief and excitement\nMission accomplished tone\nStill need to escape",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T14:25:00Z",
        updated_at: "2025-05-24T14:25:00Z"
    },
    // TOTAL MISSION FAILURE
    {
        id: 25,
        dialogue_text: "Lights are back! We're blown! All units, abort mission! Repeat, abort mission!",
        dialogue_event_name: "dx_m03_z00_harper_mission_failure",
        wwise_event_name: "Play_dx_m03_z00_harper_mission_failure",
        mission: "Mission 3",
        zone: "Underground Control Room",
        speaker: "Harper",
        trigger: "Timer reaches 00:00 without completion",
        integration_notes: "Mission failure dialogue\nAlarms blaring\nGuard shouts and gunfire\nFade to mission failed screen",
        related_game_asset: "BP_MissionFailed_Controller",
        game_status: "Complete",
        asset_status: "Final",
        wwise_status: "Implemented",
        dev_revision_note: "",
        notes: "Defeat and anger\nCommanding retreat\nMotivates player retry\nChaos background",
        creator: "NarrativeDesigner",
        created_at: "2025-05-24T14:35:00Z",
        updated_at: "2025-05-24T14:35:00Z"
    }
];

export const dropdownOptions: DropdownOptions = {
    missions: ["Mission 1", "Mission 2", "Mission 3", "Mission 4", "Mission 5"],
    zones: [
        "Underground Control Room",
        "Main Lobby",
        "Security Office",
        "Server Room",
        "Rooftop",
        "Parking Garage",
        "Elevator Shaft",
        "Ventilation System"
    ],
    speakers: [
        "Harper",
        "Lance",
        "David",
        "Guard_01",
        "Guard_02",
        "Operator",
        "Command",
        "Security_Chief"
    ],
    gameStatuses: ["Not Started", "In Progress", "Complete", "Blocked", "Needs Review"],
    assetStatuses: ["Not Started", "Recording", "Recorded", "Final", "Needs Revision", "Approved"],
    wwiseStatuses: ["Not Implemented", "Implemented", "Needs Revision", "Final", "Testing"]
};