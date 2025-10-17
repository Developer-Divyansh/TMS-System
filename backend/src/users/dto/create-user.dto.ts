import { IsEmail, IsString, IsNotEmpty, MinLength, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsArray()
  @IsString({ each: true })
  teamIds: string[];
}