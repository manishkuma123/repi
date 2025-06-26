import { Module } from '@nestjs/common';
import { SubDistrictController } from './sub-district.controller';
import { SubDistrictService } from './sub-district.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubDistrict, SubDistrictSchema } from 'src/entitites/sub-district';
import { District, DistrictSchema } from 'src/entitites/districts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubDistrict.name, schema: SubDistrictSchema },
      { name: District.name, schema: DistrictSchema },
    ]),
  ],

  controllers: [SubDistrictController],
  providers: [SubDistrictService],
})
export class SubDistrictModule {}
