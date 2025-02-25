import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto extends PartialType(CreateAuthDto) {
    @IsString()
    @MinLength(6)
    oldPassword: string;
  
    @IsString()
    @MinLength(6)
    newPassword: string;
}
