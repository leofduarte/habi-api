const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSpecialMissions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const missions = [
        {
            name: 'Special Mission Alpha',
            steps: JSON.stringify(['Step 1: Do this', 'Step 2: Do that']),
            link: 'https://example.com/alpha',
            is_partnership: false,
        },
        {
            name: 'Special Mission Beta',
            steps: JSON.stringify(['Step 1: Prepare', 'Step 2: Execute']),
            link: 'https://example.com/beta',
            is_partnership: false,
        },
        {
            name: 'Sponsored Mission 1',
            steps: JSON.stringify(['Step 1: Sponsored', 'Step 2: Enjoy']),
            link: 'https://sponsor.com/1',
            is_partnership: true,
        },
        {
            name: 'Sponsored Mission 2',
            steps: JSON.stringify(['Step 1: Sponsored', 'Step 2: Win']),
            link: 'https://sponsor.com/2',
            is_partnership: true,
        },
        {
            name: 'Sponsored Mission 3',
            steps: JSON.stringify(['Step 1: Sponsored', 'Step 2: Prize']),
            link: 'https://sponsor.com/3',
            is_partnership: true,
        },
        {
            name: 'Special Mission Gamma',
            steps: JSON.stringify(['Step 1: Try', 'Step 2: Succeed']),
            link: 'https://example.com/gamma',
            is_partnership: false,
        },
        {
            name: 'Special Mission Delta',
            steps: JSON.stringify(['Step 1: Start', 'Step 2: Finish']),
            link: 'https://example.com/delta',
            is_partnership: false,
        },
        {
            name: 'Special Mission Epsilon',
            steps: JSON.stringify(['Step 1: Think', 'Step 2: Act']),
            link: 'https://example.com/epsilon',
            is_partnership: false,
        },
        {
            name: 'Special Mission Zeta',
            steps: JSON.stringify(['Step 1: Plan', 'Step 2: Execute']),
            link: 'https://example.com/zeta',
            is_partnership: false,
        },
        {
            name: 'Special Mission Eta',
            steps: JSON.stringify(['Step 1: Learn', 'Step 2: Grow']),
            link: 'https://example.com/eta',
            is_partnership: false,
        },
    ];

    // Create missions and store their IDs
    const createdMissions = [];
    for (const mission of missions) {
        const created = await prisma.special_missions.create({
            data: mission,
        });
        createdMissions.push(created);
    }

    // Schedule 3 sponsored missions for specific dates
    const sponsoredSchedules = [
        { missionIdx: 2, date: today }, // Sponsored Mission 1 for today
        { missionIdx: 3, date: tomorrow }, // Sponsored Mission 2 for tomorrow
        { missionIdx: 4, date: dayAfterTomorrow }, // Sponsored Mission 3 for day after tomorrow
    ];
    for (const { missionIdx, date } of sponsoredSchedules) {
        await prisma.sponsor_special_mission_schedules.create({
            data: {
                fk_id_special_mission: createdMissions[missionIdx].id,
                scheduled_date: date,
            },
        });
    }

    console.log('Special missions and schedules seeded successfully.');
}

async function main() {
    await seedSpecialMissions();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error seeding special missions:', e);
        await prisma.$disconnect();
        process.exit(1);
    });