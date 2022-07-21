import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsNotEmpty, IsString } from "class-validator";

export class TutorialDto {

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @ApiProperty()
    body: string;

}