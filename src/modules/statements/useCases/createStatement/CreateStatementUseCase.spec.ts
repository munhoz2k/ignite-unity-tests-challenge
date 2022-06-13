import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryUsersRepository: IUsersRepository
let inMemoryStatementsRepository: IStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create Statement Test", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("should be able to create a statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "teste@teste.com",
      name: "teste",
      password: "teste123"
    })

    const statement1 = await createStatementUseCase.execute({
      amount: 1000,
      description: "teste",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })

    expect(statement1).toHaveProperty("id")
    expect(statement1.type).toBe(OperationType.DEPOSIT)
    expect(statement1.user_id).toBe(user.id)
  })

  it("should not be able to create a statement if users does not exists", async () => {
    await expect(
      createStatementUseCase.execute({
        amount: 1000,
        description: "teste",
        type: OperationType.DEPOSIT,
        user_id: "Fake User"
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound())
  })

  it("should not be able to create a withdraw statement if users doesn't have sufficient founds", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "teste@teste.com",
      name: "teste",
      password: "teste123"
    })

    await expect(
      createStatementUseCase.execute({
        amount: 1000,
        description: "teste",
        type: OperationType.WITHDRAW,
        user_id: user.id as string
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds())
  })
})
