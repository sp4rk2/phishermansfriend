const model = tf.sequential();
const inputUnits = xData[0].length;
const hiddenUnits = 4;
const outputUnits = yData[0].length;
const learningRate = 0.1;

const x = tf.tensor2d(xData);
const y = tf.tensor2d(yData);

function createModel() {
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
}

async function train() {
    for (let i = 0; i < 1000; i++) {
        const response = await model.fit(x, y);
        console.log("ITTERATION " + Number(i + 1) + ": " + response.history.loss[0]);
    }
}

function trainModel() {
    console.log("TRAINING STARTED");
    train().then(() => console.log("TRAINING COMPLETE"));
}

function predictModel(featureArray) {
    let email = tf.tensor2d([featureArray]);
    let output = model.predict(email).dataSync();
    console.log("HAM LIKELIHOOD:\t\t" + output[0]);
    console.log("PHISH LIKELIHOOD:\t" + output[1]);
}