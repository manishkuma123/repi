import { Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema } from 'src/entitites/provinces';
import { District, DistrictSchema } from 'src/entitites/districts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
      { name: District.name, schema: DistrictSchema },
    ]),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
