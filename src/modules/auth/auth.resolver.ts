import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
import { UnauthorizedException } from '@nestjs/common';
import { Public } from 'src/constants/constants';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: { res: Response }
  ): Promise<AuthResponse> {
    try {
    const { res } = context;
    if(!res){
        throw new Error("Unable to access response object.")
    }
      return await this.authService.login(loginInput, res);
    } catch (error) {
        console.log("error", error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
