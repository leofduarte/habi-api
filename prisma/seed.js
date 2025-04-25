const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSpecialMissions() {
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
            is_partnership: true,
        }
    ];

    for (const mission of missions) {
        await prisma.special_missions.create({
            data: mission,
        });
    }
    console.log('Special missions seeded successfully.');
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