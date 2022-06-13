import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError"

let inMemoryStatementsRepository: IStatementsRepository
let inMemoryUsersRepository: IUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe("Get Balance From Users", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  })

  it("should be able to get balance from the user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Teste User",
      email: "teste@teste.com",
      password: "testepass"
    })

    const userBalance = await getBalanceUseCase.execute({ user_id: user.id })

    expect(userBalance.balance).toBe(0)
    expect(userBalance).toHaveProperty("statement")
  })

  it("should not be able to get balance from a user that not exists", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "Fake User ID"})
    ).rejects.toEqual(new GetBalanceError())
  })
})
