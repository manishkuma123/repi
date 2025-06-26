import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { GeoLocationDetailsRequestDTO } from 'src/dtos/geo-location/request/create-geo-location';
import { GetHelpersNearByLocationDTO } from 'src/dtos/geo-location/request/get-helpers-based-location-and-distance';
import { GetHelpersNearByLocationResponseDTO } from 'src/dtos/geo-location/response/get-helpers-based-location-and-distance';
import {
  GeoLocationDetails,
  GeoLocationDetailsDocument,
} from 'src/entitites/geo-location';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { UpdateGeoLocationDetailsDTO } from './dtos/request/update-geo-location.dto';
import { UpdateHelperGeoLocationResponseDTO } from './dtos/response/update-geo-location.dto';

@Injectable()
export class GeoLocationService {
  constructor(
    @InjectModel(GeoLocationDetails.name)
    private locationDetailsModel: Model<GeoLocationDetailsDocument>,
  ) {}

  async create(
    user: any,
    locationDetailsDto: GeoLocationDetailsRequestDTO,
  ): Promise<ResponseDTO> {
    try {
      let data = (await this.locationDetailsModel.findOne({
        $or: [
          { user_id: '' + user._id, role: user.role },
          { user_id: new Types.ObjectId('' + user?._id), role: user.role },
        ],
      })) as any;

      if (data) {
        data.set(locationDetailsDto);
        await data.save();
      } else {
        const createdLocationDetails = new this.locationDetailsModel({
          ...locationDetailsDto,
          user_id: user._id,
          role: user.role,
        });
        data = await createdLocationDetails.save();
      }
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async findNearbyLocations(
    getHelpersNearByLocationDTO: GetHelpersNearByLocationDTO,
  ): Promise<GetHelpersNearByLocationResponseDTO> {
    try {
      const { longitude, latitude, distance } = getHelpersNearByLocationDTO;
      const data = await this.locationDetailsModel
        .find({
          role: Role.Helper,
          location: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },

              $minDistance: 0,
              $maxDistance: distance * 1000,
            },
          },
        })
        .exec();

      if (!data || data?.length === 0) {
        return {
          status: eAPIResultStatus.Success,
          NotFoundHelpersWithInDistance: true,
        };
      }

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async update(
    geoLocationDetailsId: string,
    updateGeoLocationDetailsDto: UpdateGeoLocationDetailsDTO,
  ): Promise<UpdateHelperGeoLocationResponseDTO> {
    try {
      const updatedGeoLocationDetails =
        await this.locationDetailsModel.findOneAndUpdate(
          { _id: geoLocationDetailsId },
          { $set: updateGeoLocationDetailsDto },
          { new: true },
        );

      if (!updatedGeoLocationDetails) {
        return { status: eAPIResultStatus.Failure, invalidGeolocationId: true };
      }

      return {
        status: eAPIResultStatus.Success,
        data: updatedGeoLocationDetails,
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getHelperLocation(helper_id: string) {
    const data = await this.locationDetailsModel.findOne({
      $or: [
        { user_id: new mongoose.Types.ObjectId(helper_id) },
        { user_id: helper_id },
      ],
    });
    return data;
  }

  async getGeoLocations(userIds: string[]) {
    try {
      const geoLocations = await this.locationDetailsModel
        .find({
          user_id: { $in: userIds },
        })
        .lean()
        .exec();

      return geoLocations;
    } catch (error) {
      console.error('Error fetching geo locations:', error);
      return [];
    }
  }
}
