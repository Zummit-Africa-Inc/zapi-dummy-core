import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ZapiResponse } from "src/common/helpers/response";
import { Api } from "src/entities/api.entity";
import { Tutorial } from "src/entities/tutorial.entity";
import { Repository } from "typeorm";
import { TutorialDto } from "./dto/create-tutorial-dto";
import { UpdateTutorialDto } from "./dto/update-tutorial.dto";

@Injectable()
export class TutorialService{
    constructor(
        @InjectRepository(Tutorial)
        private readonly tutorialRepo : Repository<Tutorial>,
        @InjectRepository(Api)
        private readonly apiRepo : Repository<Api>
    ){}

    /**
     * create tutorial for an api
     */
    async createTutorial(
        tutorialDto: TutorialDto, 
        apiId : string) : Promise<Tutorial>{
        
        try{
            //check if api exists
            const apiExists = await this.apiRepo.findOne({where : {id : apiId}})
            
            // return error if api does not exists
            if(!apiExists){
                throw new BadRequestException(
                    ZapiResponse.NotFoundRequest(
                        `Api not found`, 
                        "400")
                )
            }

            // create tutorial object
            const newTutorial = {
                title: tutorialDto.title,
                body: tutorialDto.body,
                apiId: apiId}
                
            // create and save tutorial to database
            const savedTutorial = await this.tutorialRepo.create(newTutorial)
            return await this.tutorialRepo.save(savedTutorial)

        }catch(err){
            throw new BadRequestException(
                ZapiResponse.BadRequest(
                    "Error creating tutorial", 
                    err.message, 
                    "500",)
                )
            }
        }

    /**
     * delete tutorial assigned to an api
     */
    async deleteTutorial(tutorialId: string) : Promise<Object>{
        // check if tutorial exists
        const tutorialExists = await this.tutorialRepo.findOne({where : {id:tutorialId}})
        //return error if tustorial does not exist
        if(!tutorialExists){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest(
                    "Tutorial does not exists", 
                    "404")
            )
        }
        //delete tutorial if it exists
        try{
            await this.tutorialRepo.delete({id: tutorialId})
            return {message: "Tutorial deleted"}
        }catch(err){
            ZapiResponse.OkFailure(
                "Error deleting tutorial", 
                err.message, 
                "500")
        }
    }

    /**
     * get single tutorial by id
     */
    async getSingleTutorial(tutorialId: string) : Promise<Tutorial>{
        // find tutorial 
        const tutorial = await this.tutorialRepo.findOne({where: {id: tutorialId}})
        // throw error if tutorial not found
        if(!tutorial){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest(
                    "Tutorial not found", 
                    "404")
            )
        }
        return tutorial
    }

    async updateTutorial(
        apiId: string, 
        tutorialId: string, 
        updateTutorialDto: UpdateTutorialDto) : Promise<Tutorial>{
        //check if api exists
        const apiExists = await this.apiRepo.findOne({where : {id: apiId}})
        //check if tutorial exists
        const tutorialExists = await this.tutorialRepo.findOne({where : {id: tutorialId}})
        // return error if api or tutorial does not exists
        if(!apiExists || !tutorialExists){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest(
                    `Api or Tutorial does not exists`, 
                    "404")
            )
        } 
        //update tutorial
        const updatedTutorial = await this.tutorialRepo.update(tutorialId, updateTutorialDto)

        if(!updatedTutorial){
            throw new BadRequestException(
                ZapiResponse.NotFoundRequest(
                    "Tutorial not updated", 
                    "500")
            )
        }

        return tutorialExists
        
    }
}