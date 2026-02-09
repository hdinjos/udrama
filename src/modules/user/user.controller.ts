import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user-create.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';

@Roles(Role.ADMIN)
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

  @Post()
  async store(@Body() body: CreateUserDto) {
    const data = await this.userService.storeUser(body);
    return {
      success: true,
      message: 'user update success',
      data,
    };
  }

  @Put(':id')
  async udpate(@Param() { id }, @Body() body: CreateUserDto) {
    const data = await this.userService.updateUser(id, body);
    return {
      success: true,
      message: 'user update success',
      data,
    };
  }
}
