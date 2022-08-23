import { physicalDimensions, threeDimensions, gridDimensions, sections } from "./supermarket_layout";

export const createGrid = (value) => {
    return Array.from({length: gridDimensions.yLength}, (_, y) => {
        const row =  Array.from({length: gridDimensions.xLength}, (_, x) => {
            return value
        });
        return row;
    })
}

export const rawGrid = createGrid(1);

for (const section of sections) {
    for (const model of section.models) {
        if (model.gridBoundary) {
            const bounds = model.gridBoundary;
            for (let j = bounds.startY; j <= bounds.endY; j++) {
                for (let i = bounds.startX; i <= bounds.endX; i++) {
                    rawGrid[j][i] = 0;
                }
            }
        }
    }
}

export const stringToPhysicalCoordinates = (value) => {
    const coords = value ? value.split(',') : ['0', '0'];
    return {
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1])
    }
}

export const physicalCoordinatesToThreeCoordinates = (x, y) => {
    let ratioX = Math.max(x/physicalDimensions.length, 0);
    ratioX = ratioX <= 1 ? ratioX : 1;
    let ratioY = Math.max(y/physicalDimensions.width, 0);
    ratioY = ratioY <= 1 ? ratioY : 1;

    return {
        x: ratioX * threeDimensions.length - threeDimensions.length/2,
        z: ratioY * threeDimensions.width - threeDimensions.width/2
    }
}

// export const filterGridByCategories = () => {
//     const grid = createGrid(0);
//     // for (const section of sections) {
//     //     for (const model of section.models) {
//     //         if (model.gridBoundary) {
//     //             const bounds = model.gridBoundary;
//     //             for (let j = bounds.startY; j <= bounds.endY; j++) {
//     //                 for (let i = bounds.startX; i <= bounds.endX; i++) {
//     //                     rawGrid[j][i] = 0;
//     //                 }
//     //             }
//     //         }
//     //         else {

//     //         }
//     //     }
//     // }
//     return grid;
// }