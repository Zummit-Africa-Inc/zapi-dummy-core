import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CountryResponseDto,
  CreateContactFormDto,
  TopicResponseDto,
} from './dto';
import { ContactUsService } from './contact-us.service';
import { ApiOperation } from '@nestjs/swagger';
import { Ok, ZapiResponse } from 'src/common/helpers/response';

@Controller('contact-us')
export class ContactUsController {
  constructor(private ContactUs: ContactUsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  async getAllTopics(): Promise<Ok<TopicResponseDto[]>> {
    const topics = this.ContactUs.getTopics();
    return ZapiResponse.Ok(topics, 'All topics', '200');
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  async getAllCountries(): Promise<Ok<CountryResponseDto[]>> {
    const countries = this.ContactUs.getCountries();
    return ZapiResponse.Ok(countries, 'All countries', '200');
  }

  @Post()
  @ApiOperation({ summary: 'Add a new contact details' })
  async addContactUsDetails(@Body() payload: CreateContactFormDto) {
    const contactUsDetails = await this.ContactUs.createContactUs(payload);
    return ZapiResponse.Ok(
      contactUsDetails,
      'Contact details added  successfully',
      '201',
    );
  }
}
