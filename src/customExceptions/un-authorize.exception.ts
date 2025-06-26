import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class CustomUnauthorizedException extends HttpException {
  constructor(message?: string, errorCode?: number, status?: any) {
    super(
      {
        status: eAPIResultStatus.Failure,
        message: message || 'Custom unauthorized error message',
        errorCode: errorCode || 401,
      },
      status || HttpStatus.UNAUTHORIZED,
    );
  }
}
