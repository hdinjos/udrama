import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('gen')
  generateUser() {
    this.userService.generateUser();
    return {
      success: true,
      message: 'generate user success',
    };
  }

  @Get('gen-role')
  generateRole() {
    this.userService.generateRole();
    return {
      success: true,
      message: 'generate role success',
    };
  }

  @Get()
  async getUsers() {
    const data = await this.userService.getUsers();
    return {
      success: true,
      message: 'user retrieve success',
      data,
    };
  }
}
