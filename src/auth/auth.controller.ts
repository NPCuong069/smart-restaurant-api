import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.services';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validate user credentials (delegates to AuthService)
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    // If credentials are invalid, throw an exception
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If valid, return the JWT token
    return this.authService.login(user);
  }
}
