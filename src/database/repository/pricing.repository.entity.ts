import { Injectable } from "@nestjs/common"
import { Pricing } from "src/entities/pricing.entity"
import { EntityRepository, Repository } from "typeorm"

@Injectable()
@EntityRepository(Pricing)
export class PricingRepository extends Repository<Pricing> {}