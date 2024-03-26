export abstract class Encrypter {
	abstract encrypt(text: string): Promise<string>;
}
