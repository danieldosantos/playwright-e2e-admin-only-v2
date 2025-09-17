import { Buffer } from 'node:buffer';
import type { FilePayload } from '@playwright/test';

import { test } from '@fixtures/auth';
import { FreightNegotiationPage } from '@pages/freight-negotiation.page';
import { FreightWizardPage } from '@pages/freight-wizard.page';
import { FretesPage } from '@pages/fretes.page';

const NEGOTIATION_ATTACHMENT = {
  name: 'negotiation-note.txt',
  mimeType: 'text/plain',
  base64Content: 'VGhpcyBpcyBhIHRlc3QgZG9jdW1lbnQgZm9yIGZyZWlnaHQgbmVnb3RpYXRpb24u',
} as const;

const createAttachmentPayload = (): FilePayload => ({
  name: NEGOTIATION_ATTACHMENT.name,
  mimeType: NEGOTIATION_ATTACHMENT.mimeType,
  buffer: Buffer.from(NEGOTIATION_ATTACHMENT.base64Content, 'base64'),
});

test.describe('Frete - Fluxo completo (Admin)', () => {
  test('Admin cria frete, negocia, homologa e conclui', async ({ page, loginAdmin }) => {
    await loginAdmin();

    const fretes = new FretesPage(page);
    const wizard = new FreightWizardPage(page);
    const negotiation = new FreightNegotiationPage(page);

    const freightReference = `Auto Frete ${Date.now()}`;

    await fretes.openList();
    await fretes.startNewFreight();

    await wizard.fillStopsStep([
      {
        type: 'coleta',
        country: 'Brasil',
        address: 'Porto Alegre, RS, Brasil',
      },
      {
        type: 'descarga',
        country: 'Brasil',
        address: 'Viamão, RS, Brasil',
      },
    ]);

    await wizard.fillCargoStep({
      product: freightReference,
      weightInTon: '4',
      hasTracker: false,
      pickupDate: '2025-09-20',
    });

    await wizard.fillVehicleStep({
      bodyTypes: ['bitrem', 'bitruck', 'carreta', 'carreta-ls', 'truck'],
      equipments: ['grade-baixa', 'graneleiro-grade-alta'],
    });

    await wizard.fillPaymentStep({
      total: '4000',
      method: 'Pix',
      advancePercentage: '80',
    });

    await wizard.finishFreightStep({
      assignDrivers: true,
      notes: 'Envie os documentos',
    });

    await fretes.openNegotiationPanel();

    await negotiation.openConversationByReference(freightReference);
    await negotiation.postMessage('oi isso é um teste');
    const attachment = createAttachmentPayload();

    await negotiation.uploadAttachment(attachment);

    await negotiation.moveToHomologation('envie os documentos');
    await negotiation.moveToApproved('tudo certo');
    await negotiation.confirmApproval('foi aprovado');

    await negotiation.updateTravelStatus('in-transit');
    await negotiation.updateTravelStatus('delivered');

    await negotiation.openFreightDataTab();
    await negotiation.openTripsTab();
    await negotiation.openNegotiationsTab();
    await negotiation.openDriverDataTab();

    await fretes.openList();
    await fretes.openFreightOptions(freightReference);
    await fretes.concludeFreightFromMenu();
  });
});
