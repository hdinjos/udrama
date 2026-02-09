import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user-create.dto';
import { AuthGuard } from 'src/common/guards';
import { Roles } from 'src/common/errors/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { RoleGuard } from 'src/common/guards';

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

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getUsers() {
    const data = await this.userService.getUsers();
    return {
      success: true,
      message: 'user retrieve success',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  async store(@Body() body: CreateUserDto) {
    const data = await this.userService.storeUser(body);
    return {
      success: true,
      message: 'user update success',
      data,
    };
  }

  @UseGuards(AuthGuard)
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
