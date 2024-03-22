export class Entity<T> {
	private values: T;

	constructor(props: T) {
		this.values = props;
	}

	get props() {
		return this.values;
	}

	isEqual(value: Entity<T>) {
		return JSON.stringify(this.values) === JSON.stringify(value.props);
	}
}
