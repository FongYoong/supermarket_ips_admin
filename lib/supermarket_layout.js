const length = 150;
const width = 100;

export const generalDimensions = {
    length, // x-axis
    width, // z-axis
    xPositiveBoundary: length/2 + 0, // + 0
    xNegativeBoundary: -(length/2 + 0), // + 0
    zPositiveBoundary: width/2 + 0, // + 50
    zNegativeBoundary: -(width/2 - 0), // - 90
}

export const cameraParameters = {
    initialX: 0,
    initialZ: 20, // length/2 + 30
    height: 70,
    rotationX: -40, // -45
    initialFov: 100, // 70
    minFov: 35, // 35
    maxFov: 120, // 80
    near: 0.01,
    far: 1000
}

export const gridDimensions = {
    xLength: 24,
    yLength: 14,
    initialX: -length/2 + 20,
    initialZ: -width/2 + 17,
    deltaX: 5,
    deltaZ: 5,
}

export const sections = [
    {
        productCategory: "Sanitary",
        models: [
            {
                type: "shelf1",
                gridPosition: {
                    x: 5, y: 0
                },
                rotationY: 90,
                position: {
                    x: -30, y: 8, z: -40
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 0
                },
                rotationY: 90,
                position: {
                    x: -15, y: 8, z: -40
                }
            },
            {
                type: "shelf1",
                gridBoundary: {
                    startX: 4, startY: 3, endX: 9, endY: 3,
                },
                gridPosition: {
                    x: 5, y: 2
                },
                rotationY: -90,
                position: {
                    x: -30, y: 8, z: -20
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 2
                },
                rotationY: -90,
                position: {
                    x: -15, y: 8, z: -20
                }
            }
        ]
    },
    {
        productCategory: "Snacks",
        models: [
            {
                type: "shelf1",
                gridPosition: {
                    x: 5, y: 4
                },
                rotationY: 90,
                position: {
                    x: -30, y: 8, z: -17
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 4
                },
                rotationY: 90,
                position: {
                    x: -15, y: 8, z: -17
                }
            }
        ]
    },
    {
        productCategory: "Drinks",
        models: [
            {
                type: "shelf1",
                gridBoundary: {
                    startX: 4, startY: 7, endX: 9, endY: 7,
                },
                gridPosition: {
                    x: 5, y: 6
                },
                rotationY: -90,
                position: {
                    x: -30, y: 8, z: 0
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 6
                },
                rotationY: -90,
                position: {
                    x: -15, y: 8, z: 0
                }
            },
            {
                type: "shelf5",
                gridPosition: {
                    x: 23, y: 10
                },
                rotationY: 0,
                position: {
                    x: 70, y: 8, z: 15
                },
            },
        ]
    },
    {
        productCategory: "Dairy",
        models: [
            {
                type: "shelf1",
                gridPosition: {
                    x: 5, y: 8
                },
                rotationY: 90,
                position: {
                    x: -30, y: 8, z: 3
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 8
                },
                rotationY: 90,
                position: {
                    x: -15, y: 8, z: 3
                }
            },
            {
                type: "shelf1",
                gridBoundary: {
                    startX: 4, startY: 11, endX: 9, endY: 11,
                },
                gridPosition: {
                    x: 5, y: 10
                },
                rotationY: -90,
                position: {
                    x: -30, y: 8, z: 20
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 10
                },
                rotationY: -90,
                position: {
                    x: -15, y: 8, z: 20
                }
            }
        ]
    },
    {
        productCategory: "Cooking",
        models: [
            {
                type: "shelf1",
                gridPosition: {
                    x: 5, y: 11
                },
                rotationY: 90,
                position: {
                    x: -30, y: 8, z: 23
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 11
                },
                rotationY: 90,
                position: {
                    x: -15, y: 8, z: 23
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 5, y: 13
                },
                rotationY: -90,
                position: {
                    x: -30, y: 8, z: 40
                }
            },
            {
                type: "shelf1",
                gridPosition: {
                    x: 8, y: 13
                },
                rotationY: -90,
                position: {
                    x: -15, y: 8, z: 40
                }
            },
            {
                type: "shelf5",
                gridPosition: {
                    x: 23, y: 2
                },
                rotationY: 0,
                position: {
                    x: 70, y: 8, z: -25
                },
            },
            {
                type: "shelf5",
                gridPosition: {
                    x: 23, y: 6
                },
                rotationY: 0,
                position: {
                    x: 70, y: 8, z: -5
                },
            },
        ]
    },
    {
        productCategory: "Meat",
        models: [
            {
                type: "shelf3",
                gridPosition: {
                    x: 14, y: 0
                },
                rotationY: -90,
                position: {
                    x: 15, y: 3, z: -36
                },
                scale: 3.5
            },
            {
                type: "shelf3",
                gridPosition: {
                    x: 18, y: 0
                },
                rotationY: -90,
                position: {
                    x: 35, y: 3, z: -36
                },
                scale: 3.5
            },
            {
                type: "shelf3",
                gridPosition: {
                    x: 22, y: 0
                },
                rotationY: -90,
                position: {
                    x: 55, y: 3, z: -36
                },
                scale: 3.5
            },
        ]
    },
    {
        productCategory: "Vegetables",
        models: [
            {
                type: "shelf4",
                gridBoundary: {
                    startX: 13, startY: 4, endX: 15, endY: 11,
                },
                gridPosition: {
                    x: 14, y: 3
                },
                rotationY: 0,
                position: {
                    x: 22, y: 5, z: 0
                },
                scale: 2
            },
            {
                type: "shelf2",
                gridPosition: {
                    x: 14, y: 12
                },
                rotationY: 90,
                position: {
                    x: 14.5, y: 5, z: 18
                },
                scale: 2
            },
        ]
    },
    {
        productCategory: "Frozen Food",
        models: [
            {
                type: "shelf4",
                gridBoundary: {
                    startX: 18, startY: 4, endX: 20, endY: 11,
                },
                gridPosition: {
                    x: 19, y: 3
                },
                rotationY: 0,
                position: {
                    x: 47, y: 5, z: 0
                },
                scale: 2
            },
            {
                type: "shelf2",
                gridPosition: {
                    x: 19, y: 12
                },
                rotationY: 90,
                position: {
                    x: 39.5, y: 5, z: 18
                },
                scale: 2
            },
        ]
    },
]