const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.daily_quotes.deleteMany({});
  
  const quotes = [
    { quote: "✨ Believe you can and you're halfway there." },
    { quote: "❤️ The only way to do great work is to love what you do." },
    { quote: "🐢 It does not matter how slowly you go as long as you do not stop." },
    { quote: "🏆 Success is not final, failure is not fatal: It is the courage to continue that counts." },
    { quote: "😱 Everything you've ever wanted is on the other side of fear." },
    { quote: "💭 The future belongs to those who believe in the beauty of their dreams." },
    { quote: "🌟 Hardships often prepare ordinary people for an extraordinary destiny." },
    { quote: "⏱️ Your time is limited, don't waste it living someone else's life." },
    { quote: "⏰ Don't watch the clock; do what it does. Keep going." },
    { quote: "🔮 The best way to predict the future is to create it." },
    { quote: "🔥 If you're going through hell, keep going." },
    { quote: "🌱 You are never too old to set another goal or to dream a new dream." },
    { quote: "🚀 The secret of getting ahead is getting started." },
    { quote: "✅ It always seems impossible until it's done." },
    { quote: "📅 Don't let yesterday take up too much of today." }
  ];

  console.log('Seeding daily quotes with emojis...');
  
  for (const quote of quotes) {
    await prisma.daily_quotes.create({
      data: quote,
    });
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });