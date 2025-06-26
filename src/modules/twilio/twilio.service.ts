import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eAPIResultStatus } from 'src/utils/enum';
import * as Twilio from 'twilio';
import axios from 'axios';

@Injectable()
export class TwilioService {
  private readonly client: Twilio.Twilio;
  private readonly from: string;

  constructor() {
    const accountSid = 'AC38f97e30f4a27eb7c0b383a6d939ddc7';
    const authToken = '45aab17db5a2eea9be8ea4050b82b232';
    this.from = '+12693593348';

    if (!accountSid || !authToken || !this.from) {
      throw new InternalServerErrorException(
        'Missing Twilio configuration in environment variables.',
      );
    }

    this.client = Twilio(accountSid, authToken);
  }

  async sendOTP(
    otp: string,
    countryCode: string,
    phoneNumber: string,
  ): Promise<any> {
    // try {
    //   const message = await this.client.messages.create({
    //     body: `Your Krib app verification code is:  ${otp}`,
    //     from: this.from,
    //     to: countryCode.concat(phoneNumber),
    //   });

    //   return { status: eAPIResultStatus.Success, message };
    // } catch (err) {
    //   console.log('ERROR ::', err);
    //   if (err.code === 21608) {
    //     return {
    //       status: eAPIResultStatus.Failure,
    //       invalidPhoneNumber: true,
    //       message: 'Invalid Phone Number.',
    //     };
    //   }
    //   throw new InternalServerErrorException('Failed to send OTP.');
    // }

    try {
      const payload = {
        messages: [
          {
            channel: 'sms',
            recipients: [`${countryCode}${phoneNumber}`],
            content: `Your Krib app verification code is: ${otp}`,
            msg_type: 'text',
            data_coding: 'text',
          },
        ],
        message_globals: {
          originator: 'SignOTP',
        },
      };

      const config = {
        method: 'post',
        url: 'https://api.d7networks.com/messages/v1/send',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNWM4YjAxODctMDI5MS00NTk2LWEyNDgtYTQ5MGM2N2FhYWJjIn0.uwhftnEKsyYo4-FcjugWtm1J2TtQ9cQMUx8M08jFdKw',
        },
        data: JSON.stringify(payload),
      };

      try {
        const response = await axios(config);
        return { status: eAPIResultStatus.Success };
      } catch (error) {
        console.error(
          'Error sending OTP: ',
          error?.response?.data || error.message,
        );
        throw new InternalServerErrorException('Failed to send OTP.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      throw new InternalServerErrorException('Failed to send OTP.');
    }
  }
}
