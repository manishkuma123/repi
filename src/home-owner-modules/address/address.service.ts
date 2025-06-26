import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HomeOwnerAddress,
  HomeOwnerAddressDocument,
} from 'src/entitites/home-owner-address';
import { User, UserDocument } from 'src/entitites/user';
import { CreateHomeOwnerAddressRequestDTO } from './dtos/request/create-address.dto';
import { CreateHomeOwnerAddressResponseDTO } from './dtos/response/create-address.dto';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { UpdateHomeOwnerAddressResponseDTO } from './dtos/response/update-address.dto';
import { UpdateHomeOwnerAddressRequestDTO } from './dtos/request/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(HomeOwnerAddress.name)
    private homeOwnerAddressModel: Model<HomeOwnerAddressDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    user_id: any,
    createHomeOwnerAddressDto: CreateHomeOwnerAddressRequestDTO,
  ): Promise<CreateHomeOwnerAddressResponseDTO> {
    try {
      const customer = await this.userModel.findOne({
        _id: user_id,
        role: Role.Customer,
      });

      if (!customer) {
        return { status: eAPIResultStatus.Failure, InValidCustomerId: true };
      }
      const createdHomeOwnerAddress = new this.homeOwnerAddressModel({
        ...createHomeOwnerAddressDto,
        user_id,
      });
      const data = await createdHomeOwnerAddress.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAllAddressesByCustomerId(user_id: string): Promise<ResponseDTO> {
    try {
      const data = await this.homeOwnerAddressModel.find({ user_id });
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async update(
    address_id: string,
    updateHomeOwnerAddressDto: UpdateHomeOwnerAddressRequestDTO,
  ): Promise<UpdateHomeOwnerAddressResponseDTO> {
    try {
      const updatedHomeOwnerAddress =
        await this.homeOwnerAddressModel.findOneAndUpdate(
          { _id: address_id },
          { $set: updateHomeOwnerAddressDto },
          { new: true },
        );

      if (!updatedHomeOwnerAddress) {
        return { status: eAPIResultStatus.Failure, invalidAddressId: true };
      }

      return {
        status: eAPIResultStatus.Success,
        data: updatedHomeOwnerAddress,
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}
