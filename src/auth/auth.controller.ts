import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto} from './dto/create-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('register')
    register(@Body() body: CreateUserDto) {
        return this.auth.register(body.email, body.password, body.role);
    }

    @Post('login')
    login(@Body() body: { email: string; password: string}) {
        return this.auth.login(body.email, body.password);
    }
}
