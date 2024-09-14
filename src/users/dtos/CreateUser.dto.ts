import {
  IsEmail,
  IsNotEmpty,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsUnique } from '@/common/validators/is-unique';

@ValidatorConstraint({
  name: 'isPasswordMatch',
  async: false,
})
class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as CreateUserDto;
    return object.password === confirmPassword;
  }

  defaultMessage() {
    return 'Confirm password does not match password';
  }
}

export class CreateUserDto {
  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsNotEmpty()
  @IsUnique({ tableName: 'users', column: 'username' })
  username: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @IsNotEmpty()
  @Validate(IsPasswordMatch)
  confirmPassword: string;
}
