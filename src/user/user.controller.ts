import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get.user.decorator';



@Controller('users')
export class UserController {
    constructor() {} 
    @UseGuards(JwtGuard)
    @Get('personal')
    getPersonal(@GetUser() user: User) {
        return user;
    };
};
