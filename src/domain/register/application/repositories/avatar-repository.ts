import { Response } from "@/core/response";

import { Avatar } from "../../enterprise/entities/avatar";

type SaveAvatar = {
	buffer: Buffer;
	type: string;
	userId: string;
};

type EditAvatar = SaveAvatar;

export interface IAvatarRepository {
	save(avatar: SaveAvatar): Promise<
		Response<{
			url: string;
		}>
	>;
	delete(id: string): Promise<Response>;
	edit(avatar: EditAvatar): Promise<Avatar>;
}
