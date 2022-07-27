import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceGroup } from '../entities/price-group.entity';
import { Pricing } from '../entities/pricing.entity';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pricing, PriceGroup])],
  controllers: [PricingController],
  providers: [PricingService],
})
export class PricingModule {}
