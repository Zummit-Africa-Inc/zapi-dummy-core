import { Body, Controller, Post, Param, Get, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Ok, ZapiResponse } from '../common/helpers/response';
import { createSubscriptionDto } from './dto/create-subscription.dto';
import { Tokens } from 'src/common/types';
import { SubscriptionApiCallDto } from './dto/make-request.dto';
import { Request } from 'express';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /* This is a subscribe post request to the subscription endpoint. */
  @Post('subscribe')
  @ApiOperation({ summary: 'Add a new subscription' })
  async subscribe(
    @Body() createSubDto: createSubscriptionDto,
  ): Promise<Ok<Tokens>> {
    const subscription = await this.subscriptionService.subscribe(createSubDto);
    return ZapiResponse.Ok(subscription, 'Subscription Created', '201');
  }

  /* This is an unsubscribe post request to the subscription endpoint. */
  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscription from an api' })
  async unsubscribe(
    @Body() createSubDto: createSubscriptionDto,
  ): Promise<Ok<object>> {
    const subscription = await this.subscriptionService.unsubscribe(
      createSubDto,
    );
    return ZapiResponse.Ok(subscription, 'Unsubscribed Successfully', '200');
  }

  @Post('api-request/:token')
  @ApiOperation({ summary: 'Check subscription status of user to the api' })
  async verify(
    @Param('token') token: string,
    @Body() subscriptionApiCall: SubscriptionApiCallDto,
    @Req() request: Request,
  ): Promise<Ok<Object>> {
    // const verifySubscription = await this.subscriptionService.verifySub(verifysub)

    // Get the secret key from the request header "Api-Secret-Key"
    const uniqueApiSecurityKey = request.headers['api-secret-key'];
    const verifySubscription =
      await this.subscriptionService.makeSubscriptionRequest(
        token,
        subscriptionApiCall,
        uniqueApiSecurityKey,
      );
    return ZapiResponse.Ok(
      verifySubscription,
      'user is subcribed to this api',
      '200',
    );
  }

  @Get(':profileId/all')
  @ApiOperation({ summary: 'Get all apis a user is subscribed to' })
  async getAllSubscriptions(@Param('profileId') profileId: string) {
    const subscriptions = await this.subscriptionService.getAllSubscriptions(
      profileId,
    );
    return ZapiResponse.Ok(subscriptions, 'User Subscriptions');
  }
}
