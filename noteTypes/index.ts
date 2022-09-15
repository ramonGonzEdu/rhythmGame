export type NoteType = 'circle' | 'left' | 'up' | 'right' | 'down';
// export type Note = {
// 	type: NoteType;
// 	x: number;
// 	y: number;
// 	created: number;
// 	end: any;
// 	size: number;
// };
export type Note = {
	created: number;
	end: any;
} & (
	| {
			type: 'circle';
			x: number;
			y: number;
			size: number;
	  }
	| {
			type: 'left';
	  }
	| {
			type: 'up';
	  }
	| {
			type: 'right';
	  }
	| {
			type: 'down';
	  }
);
