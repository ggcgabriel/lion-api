import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
