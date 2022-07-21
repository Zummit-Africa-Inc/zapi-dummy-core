import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateTutorialDto {

    @ApiPropertyOptional()   
    title: string;

    @ApiPropertyOptional()
    body: string;

}