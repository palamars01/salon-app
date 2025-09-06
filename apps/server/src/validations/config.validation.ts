import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class ConfigVariables {
  @IsEnum(Environment, { message: 'Check NODE_ENV environment variable' })
  NODE_ENV: Environment;

  @IsString({ message: 'Check MONGO_URI environment variable' })
  MONGO_URI: string;

  @IsString({ message: 'Check JWT_ACCESS_SECRET environment variable' })
  JWT_ACCESS_SECRET: string;

  @IsString({ message: 'Check JWT_ACCESS_EXPIRES_IN environment variable' })
  JWT_ACCESS_EXPIRES_IN: string;

  @IsString({ message: 'Check JWT_REFRESH_SECRET environment variable' })
  JWT_REFRESH_SECRET: string;

  @IsString({ message: 'Check JWT_REFRESH_EXPIRES_IN environment variable' })
  JWT_REFRESH_EXPIRES_IN: string;

  @IsString({ message: 'Check GOOGLE_CLIENT_ID environment variable' })
  GOOGLE_CLIENT_ID: string;

  @IsString({ message: 'Check GOOGLE_CLIENT_SECRET environment variable' })
  GOOGLE_CLIENT_SECRET: string;

  @IsString({ message: 'Check GOOGLE_CALLBACK_URL environment variable' })
  GOOGLE_CALLBACK_URL: string;

  @IsString({ message: 'Check FRONTEND_URL environment variable' })
  FRONTEND_URL: string;
}

export function validateEnv(config: Record<string, unknown>): ConfigVariables {
  const validatedConfig = plainToInstance(ConfigVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const err = errors.map(({ constraints }) => Object.values(constraints!)[0]);
    throw new Error(err.join(', '));
  }

  return validatedConfig;
}
