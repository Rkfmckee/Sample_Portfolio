export function screenToThreePosition(screenPos, screenDim) {
	// Three.js coordinate system
	// Center = (0, 0)
	// Top right = (1, 1)
	// Bottom left = (-1, -1)

	return ((screenPos / screenDim) * 2) - 1;
}