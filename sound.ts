export class SoundPlayer {
	audioElements: HTMLAudioElement[] = [];

	constructor(public url: string, public offset: number = 0) {
		this.url = url;
		this.offset = offset;
	}

	play() {
		const audio =
			this.audioElements.find((x) => x.paused) ??
			(this.audioElements.push(new Audio('/assets/hit.mp3')),
			this.audioElements[this.audioElements.length - 1]);

		audio.currentTime = this.offset;
		audio.play();
	}
}
