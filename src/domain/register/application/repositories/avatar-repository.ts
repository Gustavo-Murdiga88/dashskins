import { Response } from "@/core/response";

import { Avatar } from "../../enterprise/entities/avatar";

type SaveAvatar = {
	url: string;
	userId: string;
};

type EditAvatar = {
	url: string;
	id: string;
};

export interface IAvatarRepository {
	findByUserId: (userId: string) => Promise<Avatar | null>;
	findById(id: string): Promise<Avatar | undefined>;
	save(avatar: SaveAvatar): Promise<Avatar>;
	delete(id: string): Promise<void>;
	edit(avatar: EditAvatar): Promise<Avatar>;
}
