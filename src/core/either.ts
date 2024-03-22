class Right<L, R> {
	value: R;

	constructor(value: R) {
		this.value = value;
	}

	isRight(): this is Right<L, R> {
		return true;
	}

	// eslint-disable-next-line no-use-before-define
	isLeft(): this is Left<L, R> {
		return false;
	}
}

class Left<L, R> {
	value: L;

	constructor(value: L) {
		this.value = value;
	}

	isRight(): this is Right<L, R> {
		return true;
	}

	isLeft(): this is Left<L, R> {
		return false;
	}
}

export type Either<L, R> = Right<L, R> | Left<L, R>;

export const right = <L, R>(value: R) => new Right<L, R>(value);
export const left = <L, R>(value: L) => new Left<L, R>(value);
