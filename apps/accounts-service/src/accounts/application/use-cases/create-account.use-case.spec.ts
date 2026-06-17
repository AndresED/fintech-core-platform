import { Account } from '../../domain/entities/account.entity';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import type { AccountRepositoryPort } from '../../domain/ports/account.repository.port';
import { CreateAccountUseCase } from './create-account.use-case';

class InMemoryAccountRepository implements AccountRepositoryPort {
  private readonly store = new Map<string, Account>();

  async save(account: Account): Promise<void> {
    this.store.set(account.id.value, account);
  }

  async findById(id: AccountId): Promise<Account | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(): Promise<Account[]> {
    return [...this.store.values()];
  }
}

describe('CreateAccountUseCase', () => {
  it('should persist a new account', async () => {
    const repo = new InMemoryAccountRepository();
    const useCase = new CreateAccountUseCase(repo);

    const id = await useCase.execute({ ownerName: 'Jane Doe' });
    const saved = await repo.findById(id);

    expect(saved?.ownerName).toBe('Jane Doe');
  });
});
