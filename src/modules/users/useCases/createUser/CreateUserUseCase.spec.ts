import { IUsersRepository } from "../../repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { CreateUserError } from "./CreateUserError"

let inMemoryUsersRepository: IUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User Test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "test@user.com",
      password: "test"
    })

    expect(user).toHaveProperty("id")
    expect(user.email).toBe("test@user.com")
  })

  it("should not be able to create a new user if email is already beeing used", async () => {
    await createUserUseCase.execute({
      name:"Test User",
      email: "test@user.com",
      password: "test"
    })

    await expect(
      createUserUseCase.execute({
        name: "Test User 2",
        email: "test@user.com",
        password: "test"
      })
    ).rejects.toEqual(new CreateUserError())
  })
})
