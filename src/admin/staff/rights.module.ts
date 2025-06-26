import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import both class and schema correctly, avoiding naming conflicts
import {
  RightsModule as RightsModuleClass,
  RightsModuleSchema,
} from 'src/entitites/rights-module.entity';

import {
  RightsList,
  RightsListSchema,
} from 'src/entitites/rights-list.entity';

import { RightsModuleService } from './rights-module.service';
import { RightsListService } from './rights-list.service';
import { RightsModuleController } from './rights-module.controller';
import { RightsListController } from './rights-list.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      // Use the class name for model registration
      { name: RightsModuleClass.name, schema: RightsModuleSchema },
      { name: RightsList.name, schema: RightsListSchema },
    ]),
  ],
  controllers: [
    RightsModuleController,
    RightsListController,
  ],
  providers: [
    RightsModuleService,
    RightsListService,
  ],
})
export class RightsModule {}
