import * as Joi from "joi";
import * as fs from "fs";
import { SignOptions } from "jsonwebtoken";
import { ObjectLiteral } from "@shared/interface/common.interface";
export class ConfigService {
  private readonly envConfig: ObjectLiteral;

  constructor(filePath: string) {
    const config = JSON.parse(fs.readFileSync(filePath).toString("utf8"));
    this.envConfig = this.validateInput(config);
  }

  get(key: string) {
    return this.envConfig[key];
  }

  getJWTConfig(): SignOptions {
    return {
      expiresIn: this.get("JWT_EXPIRATION_DAYS"),
      algorithm: "HS512",
    };
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: ObjectLiteral): ObjectLiteral {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid("dev", "prod", "staging")
        .default("dev"),
      PORT: Joi.number().default(3000),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION_DAYS: Joi.string().default("30d"),
      MONGO_URI: Joi.string().required(),
      SERVER_URL: Joi.string().required()
    });
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
