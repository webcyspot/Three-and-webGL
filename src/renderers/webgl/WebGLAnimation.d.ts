export class WebGLAnimation {
	start(): void;

	stop(): void;

	setAnimationLoop(callback: Function): void;

	setContext(value: CanvasRenderingContext2D | WebGLRenderingContext): void;
}
