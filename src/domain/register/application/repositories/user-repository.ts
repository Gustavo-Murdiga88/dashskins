import { Optional } from "@prisma/client/runtime/library";

import { IPagination } from "@/core/pagination";
import { User, UserProps } from "@/domain/register/enterprise/entities/user";

import { UserAvatar } from "../../enterprise/value-objects/user-with-avatar";

export type SaveUserProps = Optional<UserProps, "avatar" | "id">;
export type EditUserProps = Partial<Omit<UserProps, "id">> & { id: string };
export type ListUserFilter = {
	name?: string;
	page?: number;
};
export abstract class IUserRepository {
	abstract findByEmail(email: string): Promise<User | null>;

	abstract findById(id: string): Promise<User | null>;

	abstract save(user: SaveUserProps): Promise<User>;

	abstract list(filter: ListUserFilter): Promise<IPagination<UserAvatar>>;

	abstract update(user: EditUserProps): Promise<User>;

	abstract delete(id: string): Promise<void>;
}
