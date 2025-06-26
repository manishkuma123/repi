import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import * as url from "url";
import { eAPIResultStatus } from "src/utils/enum";

@Injectable()
export class MediaService {
  private s3: AWS.S3;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.s3 = new AWS.S3({
      region: "us-east-1", // Your bucket region
      accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
    });
  }

  async create(
    userId: string,
    imageKey: string
  ): Promise<any> {
    // Validate required fields
    let response;
    try {
      let url = await this.generateSignedUrl(imageKey);
      response.data = url;
      response.status = eAPIResultStatus.Success;
      response.message = "Media added successfully";
      return response;
    } catch (error) {
      response.message = "Internal server error";
      return response;
    }
  }

  // async getAll(userId: string): Promise<APIResponse<Array<IUserMedia>>> {
  //   // Validate required fields
  //   let response = new APIResponse<Array<IUserMedia>>(
  //     eAPIResultStatus.Failure,
  //     null
  //   );
  //   try {
  //     const createdUserMedia = await this.userMediaModel
  //       .find({ userId: userId })
  //       .sort({ date: 1 })
  //       .exec();
  //     response.data = createdUserMedia;
  //     response.status = eAPIResultStatus.Success;
  //     response.message = "Media fetched successfully";
  //     return response;
  //   } catch (error) {
  //     response.message = "Internal server error";
  //     return response;
  //   }
  // }

  // async deleteImage(
  //   userId: string,
  //   media: DeleteMediaRequestDto
  // ): Promise<APIResponse<Array<IUserMedia>>> {
  //   let response = new APIResponse<Array<IUserMedia>>(
  //     eAPIResultStatus.Failure,
  //     null
  //   );
  //   try {
  //     const updatedMedia = await this.userMediaModel
  //       .findOne({ userId: userId, date: media.date })
  //       .exec();
  //     let arrMediaImages = [...updatedMedia.imageURLs];
  //     await this.deleteS3Image(media.url);
  //     arrMediaImages = arrMediaImages.filter((item) => {
  //       return item != media.url;
  //     });

  //     updatedMedia.imageURLs = arrMediaImages;
  //     await this.userMediaModel.updateOne(
  //       { userId: userId, date: media.date },
  //       updatedMedia
  //     );

  //     response.data = await this.userMediaModel
  //       .find({ userId: userId })
  //       .sort({ date: 1 })
  //       .exec();

  //     return response;
  //   } catch (error) {
  //     response.message = "Internal server error";
  //     return response;
  //   }
  // }

  generateSignedUrl(objectKey: string): Promise<string> {
    const params = {
      Bucket: "dymnd-v2",
      Key: objectKey,
      Expires: 365 * 24 * 60 * 60, // 1 hour validity
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl("getObject", params, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
  }

  async deleteS3Image(imageURL: string): Promise<void> {
    let objectKey = this.getKeyFromSignedUrl(imageURL);

    const params = {
      Bucket: "dymnd-v2",
      Key: objectKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
      console.log(`File deleted successfully: ${objectKey}`);
    } catch (error) {
      console.error(`Error deleting file: ${objectKey}`, error);
      throw new Error(`Error deleting file: ${objectKey}`);
    }
  }

  getKeyFromSignedUrl(signedUrl: string): string {
    const parsedUrl = url.parse(signedUrl);
    if (parsedUrl.pathname) {
      // Remove leading slash if present
      return parsedUrl.pathname.startsWith("/")
        ? parsedUrl.pathname.substring(1)
        : parsedUrl.pathname;
    }
    throw new Error("Invalid signed URL");
  }
}
