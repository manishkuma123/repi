import * as bcrypt from 'bcryptjs';

export const comparePassword = async (
  candidatePassword: string,
  password: string,
) => {
  return await bcrypt.compare(candidatePassword, password);
};
