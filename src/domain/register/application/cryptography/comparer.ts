export abstract class Comparer {
	abstract compare(text: string, hash: string): Promise<boolean>;
}
