import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('gen')
  // generateUser() {
  //   this.userService.generateUser();
  //   return {
  //     success: true,
  //     message: 'generate user success',
  //   };
  // }
}
