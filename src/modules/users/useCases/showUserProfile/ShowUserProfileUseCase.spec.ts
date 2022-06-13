import { IUsersRepository } from "../../repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"

let inMemoryUsersRepository: IUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile Test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    )
  })

  it("should be able to show user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test User",
      email: "test@user.com",
      password: "test"
    })

    const userProfile = await showUserProfileUseCase.execute(user.id)

    expect(userProfile).toEqual(user)
  })

  it("should not be able to show profile if user does not exist", async () => {
    await expect(
      showUserProfileUseCase.execute("Fake User ID")
    ).rejects.toEqual(new ShowUserProfileError())
  })
})
