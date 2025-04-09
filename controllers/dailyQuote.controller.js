const prisma = require('../utils/prisma');

class DailyQuoteController {
    static async getDailyQuote(req, res) {
        try {
            const { userId } = req.query;
            
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const userQuote = await prisma.user_daily_quotes.findFirst({
                where: {
                    fk_id_user: parseInt(userId),
                    presented_at: {
                        gte: today
                    }
                },
                include: {
                    daily_quotes: true
                },
                orderBy: {
                    presented_at: 'desc'
                }
            });
            
            if (userQuote) {
                return res.status(200).json({
                    quote: userQuote.daily_quotes.quote,
                    presentedAt: userQuote.presented_at
                });
            }
            
            const quotesCount = await prisma.daily_quotes.count();
            const randomIndex = Math.floor(Math.random() * quotesCount);
            
            const randomQuote = await prisma.daily_quotes.findFirst({
                skip: randomIndex,
                take: 1
            });
            
            if (!randomQuote) {
                return res.status(404).json({ error: 'No quotes available' });
            }
            
            const newUserQuote = await prisma.user_daily_quotes.create({
                data: {
                    fk_id_user: parseInt(userId),
                    fk_id_daily_quote: randomQuote.id,
                    presented_at: new Date()
                }
            });
            
            res.status(200).json({
                quote: randomQuote.quote,
                presentedAt: newUserQuote.presented_at
            });
        } catch (error) {
            console.error('Error fetching daily quote:', error);
            res.status(500).json({ error: 'Failed to fetch daily quote' });
        }
    }
}

module.exports = DailyQuoteController;