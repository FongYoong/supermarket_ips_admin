import { gridDimensions, sections } from "./supermarket_layout";

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