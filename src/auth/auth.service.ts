import { Injectable, ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService, private config: ConfigService) { }

    async signup(dto: AuthDto): Promise<any> {
        const hash = await argon.hash(dto.password);
        try {
            const newUser: User = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    password: hash
                }
            })
            return this.generateToken(newUser.id, newUser.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential Taken')
                }
            }
            throw error;
        }
    };

    async login(dto: AuthDto):Promise<{access_token: string}> {
        const potentialUser: User = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if(!potentialUser) {
            throw new ForbiddenException('User not found');
        }

        const passwordsMatch = await argon.verify(potentialUser.password, dto.password);
        if(!passwordsMatch) {
            throw new ForbiddenException('Passwords must match');
        }
        return this.generateToken(potentialUser.id, potentialUser.email);
    };

    async generateToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_TOKEN');
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '2h',
            secret: secret
        });
        return { access_token: token };
    }
}
