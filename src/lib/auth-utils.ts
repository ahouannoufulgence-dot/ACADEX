export type UserRole = 'DIRECTOR' | 'TEACHER' | 'STUDENT_PARENT';

export const getRoleFromId = (userId: string): UserRole => {
  if (userId.startsWith('DIR-')) return 'DIRECTOR';
  if (userId.startsWith('ENS-')) return 'TEACHER';
  if (userId.startsWith('ELV-') || userId.startsWith('PAR-')) return 'STUDENT_PARENT';
  return 'STUDENT_PARENT'; // Default fallback
};

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'DIRECTOR': return 'Directeur';
    case 'TEACHER': return 'Enseignant';
    case 'STUDENT_PARENT': return 'Élève / Parent';
    default: return 'Utilisateur';
  }
};