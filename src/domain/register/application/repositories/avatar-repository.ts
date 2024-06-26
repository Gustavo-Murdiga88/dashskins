import { Avatar } from "../../enterprise/entities/avatar";

type SaveAvatar = {
	url: string;
	userId: string;
};

type EditAvatar = {
	url: string;
	id: string;
};

export abstract class AvatarRepository {
	abstract findByUserId: (userId: string) => Promise<Avatar | null>;

	abstract findById(id: string): Promise<Avatar | null>;

	abstract save(avatar: SaveAvatar): Promise<Avatar>;

	abstract delete(id: string): Promise<void>;

	abstract edit(avatar: EditAvatar): Promise<Avatar>;
}
