import { Money } from '@fintech/domain-common';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { FundsDepositedEvent } from '../../domain/events/funds-deposited.event';
import { InternalTransferCompletedEvent } from '../../domain/events/internal-transfer-completed.event';
import { DomainToIntegrationEventHandler } from './domain-to-integration-event.handler';
import {
  ACCOUNT_CREDITED_V1,
} from '../integration/account-credited.integration-event';
import {
  TRANSFER_COMPLETED_V1,
} from '../integration/transfer-completed.integration-event';
import type { IntegrationEventPublisherPort } from '../ports/integration-event-publisher.port';

describe('DomainToIntegrationEventHandler', () => {
  it('should map FundsDeposited to AccountCredited integration event', async () => {
    const published: unknown[] = [];
    const publisher: IntegrationEventPublisherPort = {
      publish: async (event) => {
        published.push(event);
      },
    };
    const handler = new DomainToIntegrationEventHandler(publisher);
    const accountId = AccountId.from('acc-1');
    const amount = Money.fromCents(1050n);

    await handler.handle(
      new FundsDepositedEvent(accountId, amount, 'dep-001', 'entry-1'),
    );

    expect(published).toHaveLength(1);
    expect(published[0]).toMatchObject({
      eventType: ACCOUNT_CREDITED_V1,
      payload: {
        accountId: 'acc-1',
        amountCents: '1050',
        currency: 'USD',
        idempotencyKey: 'dep-001',
        ledgerEntryId: 'entry-1',
      },
    });
  });

  it('should map InternalTransferCompleted to TransferCompleted integration event', async () => {
    const published: unknown[] = [];
    const publisher: IntegrationEventPublisherPort = {
      publish: async (event) => {
        published.push(event);
      },
    };
    const handler = new DomainToIntegrationEventHandler(publisher);
    const fromId = AccountId.from('acc-from');
    const toId = AccountId.from('acc-to');
    const amount = Money.fromCents(400n);

    await handler.handle(
      new InternalTransferCompletedEvent('tx-ref', fromId, toId, amount),
    );

    expect(published).toHaveLength(1);
    expect(published[0]).toMatchObject({
      eventType: TRANSFER_COMPLETED_V1,
      payload: {
        transferReference: 'tx-ref',
        fromAccountId: 'acc-from',
        toAccountId: 'acc-to',
        amountCents: '400',
        currency: 'USD',
      },
    });
  });
});
