let count = 0;

function main(args) {
    count += 1;
    console.log(`Counter executed. Current count: ${count}`);
    return { body: `Counter executed. Current count: ${count}` };
}

exports.main = main;