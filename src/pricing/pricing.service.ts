import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pricing } from '../entities/pricing.entity';
import { PricingDto } from './dto/create-pricing.dto';
import { ZapiResponse } from '../common/helpers/response';
import { PriceGroup } from '../entities/price-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
    @InjectRepository(PriceGroup)
    private readonly priceGroupRepository: Repository<PriceGroup>,
  ) {}

  /**
   * Assigns a created pricing plan to an api and then stores it in the database.
   * Returns the pricing plan along with the api if successful.
   * Returns an error if unsuccessful.
   */
  async createApiPrice(
    apiId: string,
    planName: string,
    pricings: PricingDto,
  ): Promise<PriceGroup> {
    // calls the createPricing() methods which creates pricing plans
    const pricingId = await this.createPricing(planName, pricings);

    // assigns the created pricing plans to the api
    const priceGroup = Object.assign(
      new PriceGroup(),
      { pricingId },
      { apiId },
    );
    const newPriceGroup = await this.priceGroupRepository
      .save(priceGroup)
      .catch((e) => {
        console.log(e);
        throw new BadRequestException(
          ZapiResponse.BadRequest('Error Assigning Price to API'),
        );
      });
    return newPriceGroup;
  }

  /**
   * Creates pricing plan & saves it in the database.
   * Returns the created pricing plan if successful.
   * Returns an error if unsuccessful.
   */
  async createPricing(planName: string, pricing: PricingDto) {
    const pricingData = Object.assign(new Pricing(), { planName }, pricing);
    console.log(pricingData);
    const newPricing = await this.pricingRepository
      .save(pricingData)
      .catch((e) => {
        console.log(e);
        throw new BadRequestException(
          ZapiResponse.BadRequest('Error Creating Pricing!'),
        );
      });
    return newPricing.id;
  }

  /**
   * Gets all the pricing plans for an api from the database.
   * Returns all the pricing plans if they exist.
   * Returns an error if unsuccessful.
   */
  async getApiPricing(apiId: string) {
    try {
      const priceData = await this.priceGroupRepository
        .createQueryBuilder('priceGroup')
        .innerJoinAndSelect('priceGroup.pricing', 'pricing')
        .where('priceGroup.apiId = :apiId', { apiId })
        .getMany();

      let result = priceData.map(({ pricing }) => pricing);
      return result;
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Server error', error, '500'),
      );
    }
  }
}
