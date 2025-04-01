let lastModified = Date.now();

export const missions = () => {
    lastModified = Date.now();
    return [
    {
        id: 1,
        title: 'Tarefa 1',
        description: 'Descrição da tarefa 1',
        completedDates: ['01-10-2025', '01-12-2025'],
        goal_id: 1,
        dayOfWeek: ['MON', 'WED', 'FRI', 'SUN'],
        emoji: "🔥",
        streaks: 0
    },
    {
        id: 2,
        title: 'Tarefa 2',
        description: 'Descrição da tarefa 2',
        completedDates: ['01-10-2025', '01-12-2025'],
        goal_id: 1,
        dayOfWeek: ['MON', 'WED', 'FRI', 'SUN'],
        emoji: "✅",
        streaks: 0
    },
    {
        id: 3,
        title: 'Tarefa 3',
        description: 'Descrição da tarefa 3',
        completedDates: [],
        goal_id: 1,
        dayOfWeek: ['MON', 'THU', 'FRI'],
        emoji: "🚀",
        streaks: 0
    },
    {
        id: 4,
        title: 'Tarefa 4',
        description: 'Descrição da tarefa 4',
        completedDates: ['01-11-2025'],
        goal_id: 1,
        dayOfWeek: ['MON', 'THU', 'SAT'],
        emoji: "🎯",
        streaks: 0
    },
    {
        id: 5,
        title: 'Tarefa 5',
        description: 'Descrição da tarefa 5',
        completedDates: [],
        goal_id: 2,
        dayOfWeek: ['TUE', 'WED', 'FRI', 'SAT'],
        emoji: "💪",
        streaks: 0
    },
    {
        id: 6,
        title: 'Tarefa 6',
        description: 'Descrição da tarefa 6',
        completedDates: [],
        goal_id: 2,
        dayOfWeek: ['MON', 'THU', 'FRI', 'SAT'],
        emoji: "✨",
        streaks: 0
    },
    {
        id: 7,
        title: 'Tarefa 7',
        description: 'Descrição da tarefa 7',
        completedDates: [],
        goal_id: 2,
        dayOfWeek: ['MON', 'WED', 'FRI'],
        emoji: "🌟",
        streaks: 0
    },
    {
        id: 8,
        title: 'Tarefa 8',
        description: 'Descrição da tarefa 8',
        completedDates: [],
        goal_id: 3,
        dayOfWeek: ['MON', 'THU'],
        emoji: "🧘‍♀️",
        streaks: 0
    },
    {
        id: 9,
        title: 'Tarefa 9',
        description: 'Descrição da tarefa 9',
        completedDates: [],
        goal_id: 3,
        dayOfWeek: ['MON', 'TUE', 'FRI', 'SAT'],    
        emoji: "🍎",
        streaks: 0
    },
    {
        id: 10,
        title: 'Tarefa 10',
        description: 'Descrição da tarefa 10',
        completedDates: [],
        goal_id: 4,
        dayOfWeek: ['TUE', 'WED', 'THU', 'SAT'],
        emoji: "🖋",
        streaks: 0
    }
]
};

export const getLastModified = () => lastModified;

export const suggestedMissions = [
    { text: "Read 10 pages of a book" },
    { text: "Exercise for 30 minutes" },
    { text: "Meditate for 10 minutes" },
    { text: "Sleep 8 hours" },
    { text: "Drink water every day" }
];

export const emojisMissions = [
    "🔥",
    "✅",
    "🚀",
    "🎯",
    "💪",
    "✨",
    "🌟",
    "🧘‍♀️",
    "🍎",
    "🖋",
    "🎨",
    "🥦",
    "🏃‍♂️",
    "🌙",
    "🌿",
    "📚",
    "💡",
    "💧",
];