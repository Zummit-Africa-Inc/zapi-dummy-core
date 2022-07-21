import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from 'src/entities/api.entity';
import { Tutorial } from 'src/entities/tutorial.entity';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';

@Module({
    imports:[TypeOrmModule.forFeature([Tutorial,Api])],
    providers:[TutorialService],
    controllers:[TutorialController]
})
export class TutorialModule {}
