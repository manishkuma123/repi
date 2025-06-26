import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { Province, ProvinceSchema } from 'src/entitites/provinces';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from 'src/entitites/countries';
import { District, DistrictSchema } from 'src/entitites/districts';
import { SubDistrict, SubDistrictSchema } from 'src/entitites/sub-district';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
      { name: District.name, schema: DistrictSchema },
      { name: SubDistrict.name, schema: SubDistrictSchema },
      { name: Country.name, schema: CountrySchema },
    ]),
  ],

  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
