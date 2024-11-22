import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'manager1',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securepassword',
  })
  @IsString()
  password: string;
}
