import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ZapiResponse } from 'src/common/helpers/response';
import { Tokens } from 'src/common/types';
import { Api } from 'src/entities/api.entity';
import { Endpoint } from 'src/entities/endpoint.entity';
import { Profile } from 'src/entities/profile.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';
import { createSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionApiCallDto } from './dto/make-request.dto';
import { HttpService } from '@nestjs/axios';
const urlEncode = require('urlencode')


@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepository: Repository<Subscription>,
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  /**
   * It takes in a createSubscriptionDto object, checks if the user is already subscribed to the api, if not, it creates a subscription, saves it, updates the user's and api's subscriptions array, and returns the
   * tokens.
   * @param {createSubscriptionDto} createSubDto - createSubscriptionDto
   * @returns The subscription object
   */

  async subscribe(createSubDto: createSubscriptionDto): Promise<Tokens> {
    const { profileId, apiId } = createSubDto;
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });

      const subscribed = profile.subscriptions.includes(apiId);

      if (subscribed) {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Existing Subscription',
            'This user is already subscribed to this api',
            '403',
          ),
        );
      } else {
        if (api && profile) {
          const subscription = this.subRepository.create(createSubDto);
          const savedSubscription = await this.subRepository.save(subscription);

          await this.profileRepository.update(profile.id, {
            subscriptions: [...profile.subscriptions, api.id],
          });

          await this.apiRepository.update(api.id, {
            subscriptions: [...api.subscriptions, profile.id],
          });

          return await this.getTokens(
            savedSubscription.apiId,
            savedSubscription.profileId,
          );
        }
      }

      throw new NotFoundException(
        ZapiResponse.NotFoundRequest(
          'Not Found',
          'Something went wrong',
          '404',
        ),
      );
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It takes in a createSubscriptionDto object, checks if the user is already subscribed to the api, and the unsubscribe the user
   * @param {createSubscriptionDto} createSubDto - createSubscriptionDto
   * @returns The subscription object
   */

  async unsubscribe(createSubDto: createSubscriptionDto): Promise<object> {
    const { profileId, apiId } = createSubDto;
    try {
      const api = await this.apiRepository.findOne({ where: { id: apiId } });
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });
      const subscribed = profile.subscriptions.includes(apiId);

      if (subscribed) {
        await this.profileRepository.update(profile.id, {
          subscriptions: [...profile.subscriptions].filter(
            (id) => id !== api.id,
          ),
        });

        await this.apiRepository.update(api.id, {
          subscriptions: [...api.subscriptions].filter(
            (id) => id !== profile.id,
          ),
        });

        const subscription = await this.subRepository.findOne({
          where: {
            apiId: createSubDto.apiId,
            profileId: createSubDto.profileId,
          },
        });

        await this.subRepository.delete(subscription.id);

        return ZapiResponse.Ok('Success', 'Unsubscribe successful', '200');
      } else {
        throw new NotFoundException(
          ZapiResponse.BadRequest(
            'Bad Request',
            'You are not subscribed to this api',
            '400',
          ),
        );
      }
    } catch (error) {
      throw new BadRequestException(
        ZapiResponse.BadRequest('Internal Server error', error.message, '500'),
      );
    }
  }

  /**
   * It takes an apiId and a profileId, and returns a subscriptionToken
   * @param {string} apiId - The id of the API you want to subscribe to.
   * @param {string} profileId - The id of the profile that is subscribing to the API.
   * @returns The subscription token is being returned.
   */
  async getTokens(apiId: string, profileId: string): Promise<Tokens> {
    const subscriptionToken = await this.jwtService.signAsync(
      {
        profileId,
        apiId,
      },
      { secret: process.env.JWT_SUBSCRIPTION_SECRET, expiresIn: 43200 },
    );
    return { subscriptionToken };
  }

  async verifySub(token: string) {
    const secret = process.env.JWT_SUBSCRIPTION_SECRET;
    // const userRequest = await this.httpService.axiosRef.post('request url', {data: 'something'})
    try {
      const { apiId, profileId } = this.jwtService.verify(token, { secret });
      // both the API and the profile are fetched from the database
      const api = await this.apiRepository.findOneBy({ id: apiId });
      const profile = await this.profileRepository.findOneBy({ id: profileId });
      // the api's subscriptions column is checked if it includes this current user through its profileID
      const subscribed = api.subscriptions.includes(profile.id);
      if (!subscribed) {
        throw new UnauthorizedException(
          ZapiResponse.BadRequest(
            'Unauthorized',
            'user not subscribed to this api',
            '401',
          ),
        );
      }
      return { api, profile };
      // in production this would return the request made by the user on the api
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          ZapiResponse.BadRequest(
            'Subscription Error',
            "User's subscription has expired or is not subscribed to this api",
            '403',
          ),
        );
      } else {
        throw new BadRequestException(
          ZapiResponse.BadRequest(
            'Internal Server Error',
            'Something went wrong',
            '500',
          ),
        );
      }
    }
  }

  async makeSubscriptionRequest(token: string, body: SubscriptionApiCallDto) {
    const { api, profile } = await this.verifySub(token);
      const encodedRoute = urlEncode(body.route)
    const endpoint = await this.endpointRepository.findOne({
      where: {
        // apiId: api.id,
        method: body.method,
        route: encodedRoute,
      },
    });

    if (!endpoint) {
      throw new BadRequestException(ZapiResponse.BadRequest('wrong endpoints'));
    }
    // we need too check that the name, data type and requirements foe each property in the
    //endpoints.payload are met explicitly

    const uniqueApiSecurityKey = api.secretKey;
    const base_url = api.base_url;
    const endRoute = urlEncode.decode(endpoint.route);
    const endMethod = endpoint.method.toLowerCase();
    const url = base_url + `${endRoute}`;
    const p = this.httpService.axiosRef;
    const axiosResponse = await p({
      method: endMethod,
      url: url,
      data: body.payload,
      headers: { 'X-Zapi-Proxy-Secret': uniqueApiSecurityKey },
    });
    const data = axiosResponse.data;
    return data;
  }

  async getAllSubscriptions(profileId) {
    const subIds = await (
      await this.subRepository.find({ where: { profileId } })
    ).map((sub) => this.apiRepository.find({ where: { id: sub.apiId } }));
    return Promise.all(subIds);
  }
}
