const model = tf.sequential();
const inputUnits = xData[0].length;
const hiddenUnits = 4;
const outputUnits = yData[0].length;
const learningRate = 0.1;

const x = tf.tensor2d(xData);
const y = tf.tensor2d(yData);

(() => {
    console.log("CREATING MODEL");
    const hidden = model.add(tf.layers.dense({
        units: hiddenUnits,
        inputShape: [inputUnits],
        activation: "sigmoid"
    }));

    const output = model.add(tf.layers.dense({
        units: outputUnits, 
        activation: "sigmoid"
    }));

    const optimizer = tf.train.sgd(learningRate);

    console.log("MODEL CREATED");

    console.log("COMPILING MODEL");
    model.compile({
        loss: "meanSquaredError",
        optimizer: optimizer
    });
    console.log("MODEL COMPILED");
})();

async function train() {
    for (let i = 0; i < 1000; i++) {
        const response = await model.fit(x, y);
        console.log("ITTERATION " + Number(i + 1) + ": " + response.history.loss[0]);
    }
    const saveResults = await model.save('localstorage://my-model-1');
}

async function test() {
    const loadedModel = await tf.loadLayersModel('localstorage://my-model-1');
    let TP = 0;
    let TN = 0;
    let FP = 0;
    let FN = 0;
    let threshold = 0.5;
    let outputText = "";
    for (let i = 0; i < xTestData.length; i++) {
        let truth;
        let email = tf.tensor2d([xTestData[i]]);
        let output = loadedModel.predict(email).dataSync();
        if (output[0] > threshold) {
            if (yTestData[i][0] === 1) {
                TP += 1;
                truth = true;
            } else {
                FP += 1;
                truth = false;
            }
        } else {
            if (yTestData[i][0] === 0) {
                TN += 1;
                truth = true;
            } else {
                FN += 1;
                truth = false;
            }
        }
        outputText += String(String(Math.round(output * 100) / 100) + " " + truth + "\n");
    }
    document.getElementById("output").innerText = outputText;
    let accuracy = (TN + TP) / TN + FP + TP + FN;
    console.log("TP: " + TP);
    console.log("TN: " + TN);
    console.log("FN: " + FN);
    console.log("FP: " + FP);
    console.log("AC: " + accuracy);
}

function predictModel(featureArray) {
    let email = tf.tensor2d([featureArray]);
    let output = model.predict(email).dataSync();
    console.log("PHISH LIKELIHOOD:\t\t" + output[0]);
    if (output[0] >= 0.5) {
        console.log("DETECTED AS PHISHING");
    } else {
        console.log("DETECTED AS HAM");
    }
}

function trainModel() {
    console.log("TRAINING STARTED");
    train().then(() => console.log("TRAINING COMPLETE"));
}

function testModel() {
    console.log("TESTING STARTED");
    test().then(() => console.log("TESTING COMPLETE"));
}