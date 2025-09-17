import { expect, Page } from '@playwright/test';

type StopType = 'coleta' | 'descarga';

export interface FreightStop {
  type: StopType;
  country: string;
  address: string;
  suggestion?: string;
}

export interface FreightCargo {
  product: string;
  weightInTon?: string;
  hasTracker: boolean;
  pickupDate: string;
}

export interface FreightVehicle {
  bodyTypes: string[];
  equipments?: string[];
}

export interface FreightPayment {
  total: string;
  method: string;
  advancePercentage?: string;
}

export interface FreightFinishing {
  assignDrivers: boolean;
  notes?: string;
}

export class FreightWizardPage {
  constructor(private readonly page: Page) {}

  async fillStopsStep(stops: FreightStop[]) {
    await expect(this.page.getByTestId('wizard-step-stops')).toBeVisible();

    for (const [index, stop] of stops.entries()) {
      if (index > 0) {
        await this.page.getByTestId('btn-add-stop').click();
      }

      await this.selectStopType(index, stop.type);
      await this.selectStopCountry(index, stop.country);
      await this.fillStopAddress(index, stop.address, stop.suggestion);
    }

    await this.page.getByTestId('wizard-next').click();
    await expect(this.page.getByTestId('wizard-step-cargo')).toBeVisible();
  }

  async fillCargoStep(cargo: FreightCargo) {
    const trackerTestId = cargo.hasTracker ? 'radio-tracker-yes' : 'radio-tracker-no';
    await this.page.getByTestId(trackerTestId).click();

    await this.page.getByTestId('input-cargo-product').fill(cargo.product);

    if (cargo.weightInTon) {
      await this.page.getByTestId('input-cargo-weight').fill(cargo.weightInTon);
    }

    await this.page.getByTestId('input-cargo-pickup-date').fill(cargo.pickupDate);

    await this.page.getByTestId('wizard-next').click();
    await expect(this.page.getByTestId('wizard-step-vehicle')).toBeVisible();
  }

  async fillVehicleStep(vehicle: FreightVehicle) {
    for (const bodyType of vehicle.bodyTypes) {
      await this.page.getByTestId(`vehicle-type-${bodyType}`).check({ force: true });
    }

    for (const equipment of vehicle.equipments ?? []) {
      await this.page.getByTestId(`vehicle-equipment-${equipment}`).check({ force: true });
    }

    await this.page.getByTestId('wizard-next').click();
    await expect(this.page.getByTestId('wizard-step-payment')).toBeVisible();
  }

  async fillPaymentStep(payment: FreightPayment) {
    await this.page.getByTestId('input-payment-total').fill(payment.total);
    await this.page.getByTestId('select-payment-method').click();
    await this.page
      .getByTestId('option-payment-method')
      .filter({ hasText: new RegExp(payment.method, 'i') })
      .first()
      .click();

    if (payment.advancePercentage) {
      await this.page.getByTestId('input-payment-advance').fill(payment.advancePercentage);
    }

    await this.page.getByTestId('wizard-next').click();
    await expect(this.page.getByTestId('wizard-step-summary')).toBeVisible();
  }

  async finishFreightStep(finishing: FreightFinishing) {
    const assignTestId = finishing.assignDrivers
      ? 'radio-assign-drivers-yes'
      : 'radio-assign-drivers-no';
    await this.page.getByTestId(assignTestId).click();

    if (finishing.notes) {
      await this.page.getByTestId('input-freight-notes').fill(finishing.notes);
    }

    await this.page.getByTestId('btn-create-freight').click();
    await expect(this.page.getByTestId('toast-freight-created')).toBeVisible();
  }

  private async selectStopType(index: number, type: StopType) {
    const testId = type === 'coleta' ? 'radio-stop-pickup' : 'radio-stop-dropoff';
    await this.page.getByTestId(testId).nth(index).check();
  }

  private async selectStopCountry(index: number, country: string) {
    await this.page.getByTestId('stop-country-select').nth(index).click();
    await this.page
      .getByTestId('stop-country-option')
      .filter({ hasText: new RegExp(country, 'i') })
      .first()
      .click();
  }

  private async fillStopAddress(index: number, address: string, suggestion?: string) {
    await this.page.getByTestId('stop-address-input').nth(index).fill(address);
    const suggestionText = suggestion ?? address;
    await this.page
      .getByTestId('stop-address-suggestion')
      .filter({ hasText: new RegExp(suggestionText, 'i') })
      .first()
      .click();
  }
}
