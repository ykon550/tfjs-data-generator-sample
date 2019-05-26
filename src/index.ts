import * as tf from '@tensorflow/tfjs'
import * as fs from 'fs'
import * as path from 'path'
import { hiddenCalc } from './create-datafiles'

function* inputs() {
    const fileList = fs.readdirSync(__dirname + "/../data/").filter((file) => {
        return path.extname(file) == '.json'
    })
    for (let idx = 0; idx < fileList.length; idx++) {
        const dest = __dirname + "/../data/" + fileList[idx]
        let data = fs.readFileSync(dest, { encoding: 'utf-8' })
        const json = JSON.parse(data)
        yield json.x
    }
}

function* labels() {
    const fileList = fs.readdirSync(__dirname + "/../data/").filter((file) => {
        return path.extname(file) == '.json'
    })
    for (let idx = 0; idx < fileList.length; idx++) {
        const dest = __dirname + "/../data/" + fileList[idx]
        let data = fs.readFileSync(dest, { encoding: 'utf-8' })
        const json = JSON.parse(data)
        yield json.y
    }
}

function buildModel() {
    const model = tf.sequential()
    model.add(tf.layers.dense({
        inputShape: [4],
        activation: 'relu',
        units: 50
    }))
    model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }))
    model.compile({
        optimizer: tf.train.adadelta(),
        loss: "meanSquaredError",
        metrics: ['accuracy']
    });
    model.summary()
    return model
}

async function train(model) {
    // const ds = tf.data.generator(multiGenerator)

    const xs = tf.data.generator(inputs)
    const ys = tf.data.generator(labels)
    const ds = tf.data.zip({xs, ys}).shuffle(100).batch(32)

    await model.fitDataset(ds, {
        verbose: 1,
        epochs: 1000,
        callbacks: {
            onEpochEnd: async (epoch: any, log: any) => {
                console.log(`Epoch ${epoch}, ${JSON.stringify(log)}`);
            },
        }
    })
    return model
}

async function main() {
    const model = buildModel()
    await train(model)

    console.log("=== Evaluation");
    for (let idx = 0; idx < 10; idx++) {
        const input = [Math.random(), Math.random(), Math.random(), Math.random()];
        const pred: any = model.predict(tf.tensor2d([input]));
        const answer = hiddenCalc(input[0], input[1], input[2], input[3]);
        console.log(`input:${[input]}, prediction: ${pred.dataSync()[0]}, answer: ${answer}`);
    }
}

main()

function* multiGenerator() {
    const fileList = fs.readdirSync(__dirname + "/../data/").filter((file) => {
        return path.extname(file) == '.json'
    })
    let xs = []
    let ys = []
    while (true) {
        for (let idx = 0; idx < fileList.length; idx++) {
            const dest = __dirname + "/../data/" + fileList[idx]
            let data = fs.readFileSync(dest, { encoding: 'utf-8' })
            const jsonData = JSON.parse(data)
            xs.push(jsonData.x)
            ys.push(jsonData.y)
            if (xs.length == 2) {
                const tx = tf.tensor2d(xs)
                const ty = tf.tensor2d(ys)
                const ret = { xs: tx, ys: ty }
                xs = []
                ys = []
                yield ret;
            }
        }
    }
}
