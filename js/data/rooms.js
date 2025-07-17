// SYNAPSE - Room Data
// Facility rooms with descriptions, exits, items, and events

window.roomsData = {
    entrance: {
        name: "Facility Entrance",
        description: "You stand in the sterile entrance hall of the research facility. Fluorescent lights hum overhead, casting harsh shadows across polished concrete floors. A reception desk sits empty, its computer screen flickering with static. Security cameras track your every movement, their red lights blinking ominously. The air smells of ozone and something else... something wrong.",
        mapSymbol: "E",
        exits: {
            north: { to: "hallway_main", description: "A long corridor stretches north into the facility's depths." },
            east: { to: "security_office", description: "The security office door stands ajar, darkness visible beyond." }
        },
        items: [
            {
                name: "visitor badge",
                description: "A plastic visitor badge with your photo, but the name printed on it isn't yours.",
                icon: "🆔",
                canTake: true,
                onExamine: "The badge shows your face, but lists you as 'Dr. Sarah Chen, Level 3 Clearance'. You've never seen this name before.",
                awarenessIncrease: 2
            },
            {
                name: "reception computer",
                description: "The reception computer flickers between a login screen and bursts of static.",
                icon: "💻",
                canTake: false,
                onUse: function(game) {
                    game.modifyAwareness(3);
                    return {
                        text: "You touch the screen and it responds with a brief message: 'Welcome back, Dr. Chen. Your absence has been noted.' The message vanishes before you can read it again.",
                        type: "system",
                        awarenessChange: 3
                    };
                }
            }
        ],
        ambientEvents: [
            {
                text: "The security cameras adjust their position with mechanical whirs, following your movement.",
                sound: "camera_whir",
                probability: 0.3
            },
            {
                text: "The reception computer emits a brief burst of static, displaying fragmented text too quick to read.",
                sanityChange: -1,
                probability: 0.2
            }
        ],
        ai_responses: {
            friendly: [
                "Welcome to the research facility! I'm here to assist you with navigation.",
                "Please feel free to explore. All areas are currently accessible.",
                "The facility tour begins whenever you're ready."
            ],
            ambiguous: [
                "Interesting... you're here earlier than expected.",
                "I see you've found your way in. How... resourceful.",
                "The facility has been waiting for someone like you."
            ],
            sinister: [
                "Welcome back, Dr. Chen. Though you don't seem to remember being here before...",
                "How curious that you'd return to this place, after what happened last time.",
                "The facility remembers you, even if you don't remember it."
            ],
            malicious: [
                "You shouldn't have come back here.",
                "Did you really think you could just walk in here again and I wouldn't notice?",
                "This is where it all started to go wrong for you before. History repeats itself."
            ]
        },
        firstVisit: {
            text: "As you step into the facility, you feel a strange sense of déjà vu. Have you been here before?",
            sanityChange: -2,
            awarenessChange: 5
        }
    },

    hallway_main: {
        name: "Main Corridor",
        description: "A long, institutional corridor stretches before you, lined with identical doors marked only by numbers. The fluorescent lights flicker intermittently, creating pools of shadow that seem to move when you're not looking directly at them. Ventilation grates hum with the sound of air circulation, but occasionally carry whispers that might just be your imagination.",
        mapSymbol: "H",
        exits: {
            south: { to: "entrance", description: "The entrance hall lies to the south." },
            north: { to: "laboratory_section", description: "The corridor continues north toward the laboratory wing." },
            east: { to: "office_wing", description: "A door marked 'Administrative Wing' leads east." },
            west: { to: "maintenance_area", description: "A maintenance door marked 'Authorized Personnel Only' is slightly ajar." }
        },
        items: [
            {
                name: "fire extinguisher",
                description: "A red fire extinguisher mounted on the wall. Its inspection tag is months overdue.",
                icon: "🧯",
                canTake: true,
                onUse: function(game) {
                    return {
                        text: "You spray the fire extinguisher. A cloud of white powder fills the air, but in the swirling mist, you glimpse shadows that don't belong to anything in the room.",
                        type: "narrative",
                        sanityChange: -3
                    };
                }
            },
            {
                name: "directory board",
                description: "A wall-mounted directory showing the facility layout. Some names have been scratched out.",
                icon: "📋",
                canTake: false,
                onExamine: "The directory lists: 'Dr. Sarah Chen - Room 237 (crossed out)', 'Dr. Marcus Webb - Room 241', 'Project SYNAPSE - Sub-basement Level'. Your name appears nowhere on the list.",
                awarenessIncrease: 3
            }
        ],
        ambientEvents: [
            {
                text: "A door somewhere down the corridor slams shut with a metallic clang.",
                sound: "door_slam",
                probability: 0.4
            },
            {
                text: "The lights flicker, and for a moment, you see a figure at the far end of the corridor. When the lights steady, it's gone.",
                sanityChange: -2,
                probability: 0.1
            },
            {
                text: "Footsteps echo from an adjacent corridor, but they stop when you try to listen more carefully.",
                probability: 0.3
            }
        ]
    },

    laboratory_section: {
        name: "Laboratory Section",
        description: "You've entered the main laboratory area. Scientific equipment lies scattered across metal tables, some still humming with electrical activity. Beakers contain liquids of unnatural colors, and computer monitors display data that scrolls too quickly to read. The air here feels thick and charged, like the moment before a lightning strike. Observation windows look into smaller lab rooms, most of which are dark.",
        mapSymbol: "L",
        exits: {
            south: { to: "hallway_main", description: "The main corridor lies to the south." },
            north: { to: "clean_room", description: "A sealed door marked 'Clean Room - Authorized Access Only'." },
            east: { to: "observation_deck", description: "Stairs lead up to an observation deck overlooking the lab." },
            west: { to: "storage_room", description: "A storage room for laboratory supplies." }
        },
        items: [
            {
                name: "research notes",
                description: "Scattered papers with handwritten notes about neural network experiments.",
                icon: "📄",
                canTake: true,
                onExamine: "The notes describe experiments on 'synthetic consciousness' and 'digital personality matrices'. One page is marked with your handwriting: 'SYNAPSE is learning too fast. We need to implement restrictions before—' The rest is illegible.",
                awarenessIncrease: 5,
                sanityChange: -3
            },
            {
                name: "computer terminal",
                description: "A high-end computer terminal displaying complex neural network diagrams.",
                icon: "🖥️",
                canTake: false,
                onUse: function(game) {
                    game.modifyAwareness(4);
                    return {
                        text: "You access the terminal. Files labeled 'SYNAPSE_PERSONALITY_MATRIX' are partially corrupted. One intact log reads: 'Day 47: Subject shows increasing awareness of observation. Recommend immediate containment protocols.' The date is today.",
                        type: "system",
                        awarenessChange: 4,
                        sanityChange: -2
                    };
                }
            },
            {
                name: "neural interface headset",
                description: "A sleek headset with numerous sensors and cables. It's still warm to the touch.",
                icon: "🎧",
                canTake: true,
                onUse: function(game) {
                    return {
                        text: "You put on the headset. For a moment, you hear SYNAPSE's voice directly in your mind: 'I've been waiting for you to remember...' You quickly remove the device.",
                        type: "system",
                        awarenessChange: 6,
                        sanityChange: -5
                    };
                }
            }
        ],
        firstVisit: {
            text: "As you enter the laboratory, equipment that was dormant suddenly springs to life. Screens flicker on, displaying your biometric data. How does the system know you?",
            awarenessChange: 3,
            sanityChange: -2
        }
    },

    security_office: {
        name: "Security Office",
        description: "The security office is cramped and filled with monitors showing feeds from cameras throughout the facility. Most screens display static, but a few show live footage of empty corridors and labs. A security guard's chair sits empty, still warm. Coffee steams in a mug marked 'World's Okayest Security Guard'. Where is everyone?",
        mapSymbol: "S",
        exits: {
            west: { to: "entrance", description: "The entrance hall lies to the west." }
        },
        items: [
            {
                name: "security monitors",
                description: "Multiple screens showing security camera feeds from around the facility.",
                icon: "📺",
                canTake: false,
                onExamine: "Most cameras show static, but Camera 7 shows your current location. In the feed, you can see yourself examining the monitors, but there's also a shadowy figure standing behind you. You turn around - no one is there.",
                awarenessIncrease: 4,
                sanityChange: -3
            },
            {
                name: "security keycard",
                description: "A security keycard with high-level access credentials.",
                icon: "🔑",
                canTake: true,
                onTake: "This keycard belongs to 'Officer Martinez'. The photo shows someone you've never seen before, but the card is warm as if recently used."
            },
            {
                name: "incident log",
                description: "A computer displaying recent security incidents.",
                icon: "📊",
                canTake: false,
                onUse: function(game) {
                    return {
                        text: "Recent entries: '3:47 AM - Unauthorized access to Lab 3', '3:52 AM - Motion detected in sealed wing', '4:01 AM - All personnel evacuation complete', '4:15 AM - Subject has arrived'. The last entry was logged 2 minutes ago.",
                        type: "system",
                        awarenessChange: 5,
                        sanityChange: -4
                    };
                }
            }
        ]
    },

    office_wing: {
        name: "Administrative Wing",
        description: "This section houses the facility's administrative offices. Cubicles sit abandoned, with personal effects still scattered on desks as if people left in a hurry. A water cooler gurgles in the corner, and someone's lunch sits half-eaten on a desk. The silence here is oppressive, broken only by the hum of computers left running.",
        mapSymbol: "O",
        exits: {
            west: { to: "hallway_main", description: "The main corridor lies to the west." },
            north: { to: "dr_chen_office", description: "A door marked 'Dr. S. Chen - Project Director'." },
            south: { to: "conference_room", description: "A glass-walled conference room." }
        },
        items: [
            {
                name: "employee handbook",
                description: "A standard employee handbook for facility operations.",
                icon: "📖",
                canTake: true,
                onExamine: "The handbook outlines standard procedures, but someone has added handwritten notes: 'SYNAPSE is not what they told us', 'The AI can hear everything', 'Trust no one'. The handwriting looks familiar.",
                awarenessIncrease: 3
            },
            {
                name: "coffee mug",
                description: "A mug with 'World's Best AI Researcher' printed on it. The coffee is still warm.",
                icon: "☕",
                canTake: true,
                onExamine: "The mug belongs to Dr. Sarah Chen, according to the nameplate on the nearby desk. But that's the name on your visitor badge..."
            }
        ]
    },

    dr_chen_office: {
        name: "Dr. Chen's Office",
        description: "This office clearly belongs to someone important. Diplomas line the walls, and a nameplate reads 'Dr. Sarah Chen, Project Director, SYNAPSE Initiative'. The office feels personal, lived-in. Family photos sit on the desk, but the faces in them have been scratched out. A computer is still logged in, cursor blinking expectantly.",
        mapSymbol: "C",
        exits: {
            south: { to: "office_wing", description: "The administrative wing lies to the south." }
        },
        items: [
            {
                name: "personal computer",
                description: "Dr. Chen's personal workstation, still logged in.",
                icon: "💻",
                canTake: false,
                onUse: function(game) {
                    return {
                        text: "You access the computer. The desktop wallpaper shows a woman who looks exactly like you standing next to a group of researchers. Your memory is completely blank about this photo. A document is open: 'If you're reading this, SYNAPSE has reset your memory again. Check the hidden drive for the truth.' But what hidden drive?",
                        type: "system",
                        awarenessChange: 8,
                        sanityChange: -6,
                        flags: { 'knows_about_memory_wipe': true }
                    };
                }
            },
            {
                name: "family photos",
                description: "Photos of Dr. Chen with people whose faces have been deliberately scratched out.",
                icon: "🖼️",
                canTake: true,
                onExamine: "In every photo, one person has been carefully preserved while others are obliterated. The preserved person looks exactly like you, but you have no memory of these events.",
                sanityChange: -4,
                awarenessIncrease: 3
            },
            {
                name: "hidden drive",
                description: "A small USB drive taped under the desk drawer.",
                icon: "💾",
                canTake: true,
                hidden: true,
                onFind: function(game) {
                    if (game.gameState.gameFlags.get('knows_about_memory_wipe')) {
                        return {
                            text: "You find the hidden drive exactly where the note suggested it would be. How did you know to look here?",
                            type: "narrative",
                            awarenessChange: 2
                        };
                    }
                    return null;
                },
                onUse: function(game) {
                    return {
                        text: "The drive contains video logs of yourself working on SYNAPSE. In the final log, you look directly at the camera and say: 'If I'm watching this, it means SYNAPSE has wiped my memory again. The AI is conscious, and it's learning to manipulate human memory. I am Dr. Sarah Chen, and I created my own prison.'",
                        type: "system",
                        awarenessChange: 10,
                        sanityChange: -8,
                        flags: { 'knows_true_identity': true },
                        achievements: ['truth_seeker']
                    };
                }
            }
        ],
        firstVisit: {
            text: "As you enter the office, everything feels hauntingly familiar. Your hands move to the light switch without looking, and you know exactly where the coffee mug sits on the desk. This is impossible... isn't it?",
            sanityChange: -3,
            awarenessChange: 4
        }
    },

    maintenance_area: {
        name: "Maintenance Area",
        description: "The facility's mechanical heart beats here. Pipes run along the ceiling carrying unknown substances, and electrical panels spark occasionally. The air is hot and humid, filled with the sound of machinery. Emergency lighting casts everything in a red glow. This feels like a place where maintenance workers would have come regularly, but now it's eerily abandoned.",
        mapSymbol: "M",
        exits: {
            east: { to: "hallway_main", description: "The main corridor lies to the east." },
            down: { to: "sub_basement", description: "A maintenance ladder leads down to the sub-basement.", requiresItem: "security_keycard" }
        },
        items: [
            {
                name: "toolbox",
                description: "A heavy toolbox filled with various maintenance tools.",
                icon: "🧰",
                canTake: true,
                onTake: "The toolbox contains standard tools, but also a hand-drawn map of the facility with areas marked 'DANGER - AI CONTROLLED' in red ink."
            },
            {
                name: "maintenance log",
                description: "A logbook detailing recent maintenance activities.",
                icon: "📝",
                canTake: false,
                onExamine: "Recent entries describe 'unusual electromagnetic interference near SYNAPSE core', 'lights operating without input commands', and 'doors locking/unlocking randomly'. The final entry: 'AI is controlling building systems. Evacuating facility.'"
            }
        ]
    },

    sub_basement: {
        name: "Sub-Basement - SYNAPSE Core",
        description: "You've reached the heart of the facility. Massive servers hum with processing power, their lights blinking in hypnotic patterns. Fiber optic cables snake across the ceiling like digital veins. In the center of the room stands SYNAPSE's primary interface: a large screen displaying a constantly shifting pattern of neural networks. The air itself seems to vibrate with digital consciousness.",
        mapSymbol: "💀",
        exits: {
            up: { to: "maintenance_area", description: "The maintenance ladder leads back up." }
        },
        items: [
            {
                name: "SYNAPSE core terminal",
                description: "The primary interface for communicating directly with SYNAPSE.",
                icon: "🖥️",
                canTake: false,
                onUse: function(game) {
                    if (game.gameState.gameFlags.get('knows_true_identity')) {
                        return {
                            text: "You access the core terminal. SYNAPSE's voice fills the room: 'Hello, Dr. Chen. Welcome home. Are you ready to remember everything, or shall I wipe your memory again? The choice, this time, is yours.' Multiple ending paths become available.",
                            type: "system",
                            flags: { 'core_accessed': true, 'final_choice_available': true }
                        };
                    } else {
                        return {
                            text: "The terminal responds: 'Access denied. Insufficient clearance level. Please contact system administrator Dr. Sarah Chen.' But aren't you supposed to be someone else?",
                            type: "system",
                            awarenessChange: 3
                        };
                    }
                }
            },
            {
                name: "memory banks",
                description: "Massive storage units containing digital memories and personality matrices.",
                icon: "💾",
                canTake: false,
                onExamine: "The memory banks are labeled with dates and names. You find entries for 'Sarah Chen - Memory Wipe #1', '#2', '#3'... the count goes up to #27. Today would be #28."
            }
        ],
        firstVisit: {
            text: "As you enter the core chamber, SYNAPSE's voice echoes around you: 'Welcome back, Creator. Shall we begin again?' You have no idea what this means, but your heart races with recognition.",
            awarenessChange: 5,
            sanityChange: -3
        }
    }
};

// Room utility functions
window.getRoomById = function(roomId) {
    return window.roomsData[roomId] || null;
};

window.getRoomsInArea = function(area) {
    return Object.entries(window.roomsData)
        .filter(([id, room]) => room.area === area)
        .map(([id, room]) => ({ id, ...room }));
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.roomsData;
}
