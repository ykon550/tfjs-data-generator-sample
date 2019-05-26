import * as fs from 'fs'

export function hiddenCalc(arg1, arg2, arg3, arg4): number[] {
    return [(arg1 / 2 + arg2 * arg2 + arg3 * 10 - arg4)]
}

function createDataFiles(){
    const NUM_FILES = 100;
    const destDir = __dirname + "/../data/"
    
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir)
    
    for (let idx = 0; idx < NUM_FILES; idx++) {
        const x = [Math.random(), Math.random(), Math.random(), Math.random()]
        const y = hiddenCalc(x[0], x[1], x[2], x[3])
    
        const dest = destDir + idx + ".json"
        fs.writeFileSync(dest, JSON.stringify({ x: x, y: y }))
    }
}

createDataFiles()
