import { faker } from "@faker-js/faker";

import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { ListUserUseCase } from "./list-users-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("List users usecase", async () => {
	let sut: ListUserUseCase;
	let usecase: SaveUserUseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(repository);
		sut = new ListUserUseCase(repository);
	});

	it("should be able get a list of users with name filter", async () => {
		const {
			value: { name },
		} = await usecase.execute({
			age: faker.number.int({ min: 10, max: 30 }),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
			password: faker.internet.password(),
		});

		await usecase.execute({
			age: faker.number.int({ min: 10, max: 30 }),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
			password: faker.internet.password(),
		});
		await usecase.execute({
			age: faker.number.int({ min: 10, max: 30 }),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
			password: faker.internet.password(),
		});

		const listOfUsers = await sut.execute({
			name,
			page: 0,
		});

		if (listOfUsers.isLeft()) {
			throw listOfUsers.value;
		}

		expect(listOfUsers.value.data).toHaveLength(1);
		expect(listOfUsers.value.totalElements).toBe(1);
		expect(listOfUsers.value.totalPages).toBe(1);
	});

	it("should be able get the list of users with pagination", async () => {
		const promises = Array(22)
			.fill("")
			.map(() =>
				usecase.execute({
					age: faker.number.int({ min: 10, max: 30 }),
					email: faker.internet.email(),
					name: faker.person.fullName(),
					role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
					password: faker.internet.password(),
				}),
			);

		await Promise.all(promises);

		const listOfUsers = await sut.execute({
			page: 2,
		});

		if (listOfUsers.isLeft()) {
			throw listOfUsers.value;
		}

		expect(listOfUsers.value.data).toHaveLength(2);
		expect(listOfUsers.value.totalElements).toBe(22);
		expect(listOfUsers.value.totalPages).toBe(3);
	});
});
