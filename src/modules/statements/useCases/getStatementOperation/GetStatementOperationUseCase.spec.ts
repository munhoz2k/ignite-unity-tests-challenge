import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"

let inMemoryStatementsRepository: IStatementsRepository
let inMemoryUsersRepository: IUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Find Statement Test", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("should be able to find a statement from the id", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test User",
      password: "test"
    })

    const statementTest = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Test",
      type: OperationType.DEPOSIT ,
      user_id: user.id
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statementTest.id
    })

    expect(statementOperation).toEqual(statementTest)
  })

  it("should not be able to find a statement if user does not exist", async () => {
    const statementTest = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: "Fake User ID"
    })

    await expect(
      getStatementOperationUseCase.execute({
        user_id: statementTest.user_id,
        statement_id: statementTest.id
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound())
  })

  it("should not be able to find a statement if statement does not even exist", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test User",
      password: "test"
    })

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "Fake Statement ID"
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound())
  })
})
