import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsObject } from 'class-validator';
import { HttpMethod } from 'src/common/enums/httpMethods.enum';
import { CreateEndpointDto } from './create-endpoint.dto';

export class UpdateEndpointDto extends PartialType(CreateEndpointDto) {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional({ default: 'get' })
  method: HttpMethod;

  @ApiPropertyOptional()
  route: string;

  @IsArray()
  @ApiPropertyOptional()
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
    { format: string; body: string }
  ]
}
