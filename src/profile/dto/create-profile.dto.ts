import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  user_id: string;
}
