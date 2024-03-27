export interface IUpload {
	name: string;
	body: Buffer;
	type: string;
}

export abstract class Uploader {
	abstract upload(upload: IUpload): Promise<string>;
}
