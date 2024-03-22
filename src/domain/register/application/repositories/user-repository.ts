import { Optional } from "@prisma/client/runtime/library";

import { IPagination } from "@/core/pagination";
import { User, UserProps } from "@/domain/register/enterprise/entities/user";

import { UserAvatar } from "../../enterprise/value-objects/user-with-avatar";

export type SaveUserProps = Optional<UserProps, "avatar" | "id">;
export type EditUserProps = Optional<UserProps, "avatar" | "role">;
export type ListUserFilter = {
	name?: string;
	page?: number;
};
export interface IUserRepository {
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;
	save(user: SaveUserProps): Promise<User>;
	list(filter: ListUserFilter): Promise<IPagination<UserAvatar>>;
	edit(user: EditUserProps): Promise<void>;
	delete(id: string): Promise<void>;
}
