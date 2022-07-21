import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZapiResponse } from "src/common/helpers/response";
import { TutorialDto } from "./dto/create-tutorial-dto";
import { UpdateTutorialDto } from "./dto/update-tutorial.dto";
import { TutorialService } from "./tutorial.service";

@ApiTags('tutorial')
@Controller('tutorial')
export class TutorialController{
    constructor (
        private readonly tutorialService: TutorialService
    ){}

    @ApiOperation({ summary: 'Get tutorial by Id' })
    @Get("/:tutorialId")
    async findTutorialById(@Param('tutorialId') tutorialId: string){
        const tutorial = await this.tutorialService.getSingleTutorial(tutorialId)
        return ZapiResponse.Ok(tutorial,"Tutorial", 200)
    }

    @ApiOperation({summary: 'Create tutorial'})
    @Post('/:apiId')
    async createTutorial(
        @Param('apiId') apiId: string,
        @Body() tutorialDto: TutorialDto){
        const tutorial = await this.tutorialService.createTutorial(tutorialDto, apiId)
        return ZapiResponse.Ok(tutorial, "Tutorial created", 201)
    }

    @ApiOperation({summary :"Delete tutorial"})
    @Delete("/:tutorialId")
    async deleteTutorial(@Param("tutorialId") tutorialId: string){
        const deletedTutorial = await this.tutorialService.deleteTutorial(tutorialId)
        return ZapiResponse.Ok(deletedTutorial, "Tutorial deleted", 200)
    }

    @ApiOperation({summary :"Update tutorial"})
    @Patch('/:apiId/:tutorialId')
    async updateTutorial(
        @Param('apiId') apiId: string,
        @Param('tutorialId') tutorialId: string,
        @Body() updateTutorialDto: UpdateTutorialDto){
            const updatedTutorial = await this.tutorialService.updateTutorial(apiId, tutorialId, updateTutorialDto)
            return ZapiResponse.Ok(updatedTutorial, "Tutorial updated", 200)
        }
}   