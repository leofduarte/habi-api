// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

export default async function main() {

    console.log("missao especial calendarizada")

    // try {
    //     // Get all unique timezone offsets from users
    //     const timezoneOffsets = await prisma.users.findMany({
    //         select: {
    //             timezone_offset: true
    //         },
    //         distinct: ['timezone_offset']
    //     });

    //     const results = [];
        
    //     // For each timezone, trigger the reset function
    //     for (const { timezone_offset } of timezoneOffsets) {
    //         try {
    //             // In a real implementation, this would be an HTTP call to your serverless function
    //             // For Digital Ocean Functions, you would use their SDK or HTTP client
    //             const response = await fetch(process.env.FUNCTION_ENDPOINT, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${process.env.FUNCTION_API_KEY}`
    //                 },
    //                 body: JSON.stringify({
    //                     timezoneOffset: timezone_offset
    //                 })
    //             });

    //             const result = await response.json();
    //             results.push({
    //                 timezoneOffset: timezone_offset,
    //                 success: response.ok,
    //                 result
    //             });
    //         } catch (error) {
    //             console.error(`Error processing timezone ${timezone_offset}:`, error);
    //             results.push({
    //                 timezoneOffset: timezone_offset,
    //                 success: false,
    //                 error: error.message
    //             });
    //         }
    //     }

    //     return {
    //         statusCode: 200,
    //         body: {
    //             message: 'Special mission reset scheduling completed',
    //             results
    //         }
    //     };
    // } catch (error) {
    //     console.error('Error in scheduler function:', error);
    //     return {
    //         statusCode: 500,
    //         body: {
    //             error: 'Failed to schedule special mission resets',
    //             details: error.message
    //         }
    //     };
    // } finally {
    //     await prisma.$disconnect();
    // }
}
