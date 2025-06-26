export class CreateStaffDto {
  readonly name: string;
  readonly email: string;
  readonly password: string; // Ideally hashed before save
  readonly phone?: string;
  readonly isActive?: boolean;
}

export class UpdateStaffDto {
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly isActive?: boolean;
}
