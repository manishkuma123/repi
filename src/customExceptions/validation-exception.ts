import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class CustomValidationException extends HttpException {
  constructor(message?: string, errorCode?: number, status?: any) {
    super(
      {
        status: eAPIResultStatus.Failure,
        message: message || 'Validation error occurred',
        errorCode: errorCode || 400,
      },
      status || HttpStatus.BAD_REQUEST,
    );
  }
}
