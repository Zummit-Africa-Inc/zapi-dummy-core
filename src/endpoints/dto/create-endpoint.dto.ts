import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';
import { HttpMethod } from '../../common/enums/httpMethods.enum';

export class CreateEndpointDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ default: 'get' })
  method: HttpMethod;

  @ApiProperty()
  route: string;

  @IsArray()
  @ApiProperty()
  headers: {
    name: string;
    description: string;
    type: string;
    value: string;
    required: boolean;
  }[];

  @IsArray()
  @ApiPropertyOptional()
  requestBody: [
    { name: string; data_type: any }
  ]
}
