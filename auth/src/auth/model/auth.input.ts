import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
/**
 *
 * # SignUpWithEmailInput
 *
 * input for sign up with email
 * and password
 *
 * so we need to specify the email and password
 *
 *
 */
@InputType()
export class SignUpWithEmailInput {
  @Field({
    description:
      'Email of the user want to register or signup. The email must be the valid one',
  })
  @IsEmail()
  email!: string;

  @Field({ description: 'Password of the user want to sign up' })
  password!: string;

  @Field({
    description:
      'Apss secret key of application. Each application has their secret Key and make sure the application is registered and active',
  })
  appsSecretKey!: string;
}

/**
 * # SignInWithEmailInput
 *
 * signin with email and password
 * this will bring the email and password
 *
 *
 */
@InputType()
export class SignInWithEmailInput {
  @Field({
    description:
      'Email of the user want to register or signup. The email must be the valid one',
  })
  @IsEmail()
  email!: string;

  @Field({ description: 'Password of the user want to sign up' })
  password!: string;

  @Field({
    description:
      'Apss secret key of application. Each application has their secret Key and make sure the application is registered and active',
  })
  appsSecretKey!: string;
}

/**
 * # SignInWithGoogle
 *
 * signin using google and start the session
 * and we just need the username, and email
 * the credentials is nullable
 *
 *
 */
@InputType()
export class SignInWithGoogleInput {
  @Field({
    description:
      'Email of the user want to register or signup. The email must be the valid one',
  })
  @IsEmail()
  email!: string;

  @Field({
    description:
      'Apss secret key of application. Each application has their secret Key and make sure the application is registered and active',
  })
  appsSecretKey!: string;
}
