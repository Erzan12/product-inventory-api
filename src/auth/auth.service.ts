import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async register(email: string, password: string, role: string = 'user') {
        const allowedRoles = ['user', 'admin']; // whitelist roles
        const userRole = role ?? 'user'; // fallback to user if undefined

        if (!allowedRoles.includes(role)) {
            throw new BadRequestException('Invalid role');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole, // default role
            },
        });
        return { message: 'User created', userId: user.id};
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwt.sign({ sub: user.id, role: user.role});
        return { access_token: token};
    }

    async validateUser(userId: number) {
        return this.prisma.user.findUnique({ where: { id: userId} });
    }
}
