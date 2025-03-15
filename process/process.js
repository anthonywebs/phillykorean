// run
// node process.js
// out.json will be created

const fs = require('fs');

const res = fs.readFileSync('./ai.json', 'utf8');
const data = JSON.parse(res);

const newData = [];

const parse = msg => {
    const arr = msg.split(/: (.+)/);
    // console.log(arr.length)
    if (arr.length < 2){
        console.log("ERR: TOO SMALL", arr.length, msg)
    }
    if (arr.length > 2) {

    }

    const message = arr[1];
    const prefix = arr[0].split(',');
    const date = `${prefix[0]},${prefix[1]}`;
    const name = `${prefix[2]}`.replace(/\s/g, '').replace(/\u00A0/g, '');

    return {
        name,
        date,
        message
    };
}

const parseAns = msg => {
    const arr = msg.split(/: (.+)/);
    // console.log(arr.length)
    if (arr.length < 2){
        console.log("ERR: TOO SMALL", arr.length, msg)
    }
    const message = arr[1];
    const name = `${arr[0]}`.replace(/\s/g, '').replace(/\u00A0/g, '');

    return {
        name,
        message
    };
}



for (let i = 0; i < data.length; i++) {
    const { question, answers }= data[i];
    const { name, date, message } = parse(question);
    if (answers.length === 0) continue;
    const newAns = [];
    for (let j = 0; j < answers.length; j++) {
        const { name: replier, message: answer } = parseAns(answers[j]);
        newAns.push({
            replier,
            answer
        })
    }

    newData.push({
        ...data[i],
        name,
        date,
        question: message,
        answers: newAns,
    })

}

// console.log("AK: newDa", newData)

const json = JSON.stringify(newData);

fs.writeFile('./out.json', json, (err) => {
    if (err) {
        console.error("Error writing file:", err);
        return;
    }

    console.log("File written successfully!");
});

// console.log(json);