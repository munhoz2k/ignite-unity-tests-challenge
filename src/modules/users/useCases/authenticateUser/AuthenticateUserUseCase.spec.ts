import { IUsersRepository } from "../../repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { hash } from "bcryptjs"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate User Test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it("should be able to authenticate a user", async () => {
    const testUserPassword = "test"
    const passwordHash = await hash(testUserPassword, 8);
    const userTest = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test User",
      password: passwordHash
    })

    const authentication = await authenticateUserUseCase.execute({
      email: userTest.email,
      password: testUserPassword
    })

    expect(authentication).toHaveProperty("token")
  })

  it("should not be able to authenticate user with incorrect e-mail", async () => {
    const testUserPassword = "test"
    const passwordHash = await hash(testUserPassword, 8)
    await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test User",
      password: passwordHash
    })

    await expect(
      authenticateUserUseCase.execute({
        email: "wrong@mail.com",
        password: testUserPassword
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

  it("should not be able to authenticate user with incorrect password", async () => {
    const testUserPassword = "test"
    const passwordHash = await hash(testUserPassword, 8)
    const userTest = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test User",
      password: passwordHash
    })

    await expect(
      authenticateUserUseCase.execute({
        email: userTest.email,
        password: "wrongpass"
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})
