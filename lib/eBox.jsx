{
    // Creating layer and property mocks
    createBox({ size = [100, 100], position = [0, 0], anchor = 'center', isClosed = true, }) {
        function createTransforms(to) {
            const transform = to ? thisLayer.sub : thisLayer.add;
            const transforms = {
                topLeft: topLeft => topLeft,
                topRight: (topLeft, [width]) => transform(topLeft, [width, 0]),
                topCenter: (topLeft, [width]) => transform(topLeft, [width / 2, 0]),
                bottomCenter: (topLeft, [width, height]) => transform(topLeft, [width / 2, height]),
                bottomLeft: (topLeft, [, height]) => transform(topLeft, [0, height]),
                bottomRight: (topLeft, [width, height]) => transform(topLeft, [width, height]),
                center: (topLeft, [width, height]) => transform(topLeft, [width / 2, height / 2]),
                leftCenter: (topLeft, [, height]) => transform(topLeft, [0, height / 2]),
                rightCenter: (topLeft, [width, height]) => transform(topLeft, [width, height / 2]),
            };
            return transforms;
        }
        const anchorToTopLeft = createTransforms(true);
        const topLeftToAnchor = createTransforms(false);
        checkAnchors(anchor, 'createBox');
        const topLeft = anchorToTopLeft[anchor](position, size);
        let boxPoints = createPoints(size, topLeft);
        function getBoxPath() {
            return pointsToPath(boxPoints, isClosed);
        }
        return {
            setScale: scalePoints,
            getPath: getBoxPath,
        };
        function scalePoints(scale = [100, 100], anchor) {
            // Remap scale to [0..1]
            const normalizedScale = thisLayer.div(scale, 100);
            // Get index of anchor point
            const currentBoxSize = pointsToSize(boxPoints);
            checkAnchors(anchor, 'setScale');
            const anchorPoint = topLeftToAnchor[anchor](boxPoints[0], currentBoxSize);
            // Calculate distance from anchor point
            const pointDeltas = boxPoints.map(point => {
                return point.map((dimension, dimensionIndex) => {
                    return dimension - anchorPoint[dimensionIndex];
                });
            });
            // Scale the point deltas according to input scale
            const scaledPointDeltas = pointDeltas.map((point) => {
                return point.map((dimension, dimensionIndex) => {
                    return dimension * normalizedScale[dimensionIndex];
                });
            });
            const scaledPoints = boxPoints.map((point, pointIndex) => {
                // If not the anchor point
                // Create the point from the scaledPointDelta
                return point.map((pointDimension, dimensionIndex) => {
                    return (anchorPoint[dimensionIndex] +
                        scaledPointDeltas[pointIndex][dimensionIndex]);
                });
            });
            boxPoints = scaledPoints;
        }
        /**
         * Creates points array from size and origin
         */
        function createPoints([width, height], [x, y]) {
            // Should be anchored to topLeft
            return pointsToLayerSpace([
                [x + 0, y + 0],
                [x + width, y + 0],
                [x + width, y + height],
                [x + 0, y + height],
            ]);
        }
        /**
         * Transforms array of points to be in layer space
         */
        function pointsToLayerSpace(points) {
            return points.map((point) => thisLayer.fromComp(point));
        }
        function pointsToPath(points, isClosed) {
            return thisProperty.createPath(points, [], [], isClosed);
        }
        function pointsToSize(points) {
            const [p1, p2, p3] = points;
            return [
                // width
                p2[0] - p1[0],
                // height
                p3[1] - p2[1],
            ];
        }
        function checkAnchors(anchor, callee) {
            const validAnchors = [
                'bottomCenter',
                'bottomLeft',
                'bottomRight',
                'center',
                'leftCenter',
                'rightCenter',
                'topCenter',
                'topLeft',
                'topRight',
            ];
            const message = `in function ${callee}.\n\nInvalid anchor ${anchor}. Valid anchors are:${validAnchors.map(anchor => `\n- ${anchor}`)}`;
            if (!validAnchors.includes(anchor)) {
                throw Error(message);
            }
        }
    },
    version: '1.3.0',
}